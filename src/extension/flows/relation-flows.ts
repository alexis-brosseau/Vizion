import * as vscode from 'vscode';
import type {
  EndpointDecoration,
  EndpointFillMode,
  UmlRelationKind
} from '../../shared/documents/types';
import { listEndpointShapes, listUmlRelationPresets } from '../../shared/registry/uml-registry';
import type { FlowContext } from './flow-context';

export interface RelationFlowParams {
  sourceNodeId?: string;
  targetNodeId?: string;
  defaultKind?: UmlRelationKind;
  label?: string;
}

export interface EndpointDecorationFlowParams {
  edgeId: string;
  end: 'start' | 'end';
  currentDecoration?: EndpointDecoration;
}

export interface ChangeRelationKindParams {
  edgeId: string;
  currentKind?: UmlRelationKind;
}

export async function promptAddUmlEdgeFlow(
  ctx: FlowContext,
  params: RelationFlowParams = {}
): Promise<void> {
  let { sourceNodeId, targetNodeId, defaultKind, label } = params;

  // If source or target node ID is not provided (e.g. triggered from Command Palette),
  // prompt the user to pick from eligible non-frame nodes.
  if (!sourceNodeId || !targetNodeId) {
    const docAst = ctx.getLastValidDocument?.();
    const availableNodes = docAst?.nodes.filter((n) => n.kind !== 'frame') ?? [];

    if (availableNodes.length < 2) {
      void vscode.window.showWarningMessage(
        'At least two non-frame nodes are required in the diagram to connect a relation.'
      );
      ctx.restoreFocus(ctx.panel);
      return;
    }

    if (!sourceNodeId) {
      const sourceItems = availableNodes.map((n) => ({
        label: n.name || n.id,
        description: n.kind + (n.stereotype ? ` «${n.stereotype}»` : ''),
        detail: `ID: ${n.id}`,
        nodeId: n.id
      }));

      const pickedSource = await vscode.window.showQuickPick(sourceItems, {
        title: 'Vizion UML: Select Source Node',
        placeHolder: 'Choose starting entity for relation'
      });

      if (!pickedSource) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      sourceNodeId = pickedSource.nodeId;
    }

    if (!targetNodeId) {
      const targetItems = availableNodes
        .filter((n) => n.id !== sourceNodeId)
        .map((n) => ({
          label: n.name || n.id,
          description: n.kind + (n.stereotype ? ` «${n.stereotype}»` : ''),
          detail: `ID: ${n.id}`,
          nodeId: n.id
        }));

      const pickedTarget = await vscode.window.showQuickPick(targetItems, {
        title: 'Vizion UML: Select Target Node',
        placeHolder: 'Choose destination entity for relation'
      });

      if (!pickedTarget) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      targetNodeId = pickedTarget.nodeId;
    }
  }

  const presetItems = listUmlRelationPresets().map((preset) => ({
    label: preset.label,
    description: preset.kind,
    detail: preset.description,
    picked: preset.kind === (defaultKind ?? 'association'),
    presetKind: preset.kind
  }));

  const picked = await vscode.window.showQuickPick(presetItems, {
    title: `Vizion UML: Relation Kind (${sourceNodeId} → ${targetNodeId})`,
    placeHolder: 'Choose semantic relationship kind'
  });

  ctx.restoreFocus(ctx.panel);
  if (!picked) return;

  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode.window.showWarningMessage('Document changed while choosing relation kind. Connection cancelled.');
    return;
  }

  const edgeId = `edge-${sourceNodeId}-${targetNodeId}-${Date.now().toString(36).slice(-4)}`;
  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-edge-${edgeId}`, ctx.expectedVersion, {
      type: 'uml.addEdge',
      id: edgeId,
      kind: picked.presetKind,
      sourceNodeId: sourceNodeId!,
      targetNodeId: targetNodeId!,
      ...(label ? { label } : {})
    });
  });
}

export async function promptEndpointDecorationFlow(
  ctx: FlowContext,
  params: EndpointDecorationFlowParams
): Promise<void> {
  const { edgeId, end, currentDecoration } = params;
  const endLabel = end === 'start' ? 'START (Source)' : 'END (Target)';

  const shapeItems = listEndpointShapes().map((shape) => ({
    label: shape.label,
    description: currentDecoration?.shape === shape.kind ? `${shape.kind} (current)` : shape.kind,
    detail: shape.description,
    shapeDescriptor: shape
  }));

  const pickedShape = await vscode.window.showQuickPick(shapeItems, {
    title: `Vizion UML: Customize ${endLabel} Endpoint Shape`,
    placeHolder: `Select decoration shape for ${endLabel} endpoint of relation "${edgeId}"`
  });

  if (!pickedShape) {
    ctx.restoreFocus(ctx.panel);
    return;
  }

  let chosenFill: EndpointFillMode | undefined;
  if (pickedShape.shapeDescriptor.supportsFill) {
    const currentFill = currentDecoration?.fill ?? pickedShape.shapeDescriptor.defaultFill ?? 'hollow';
    const fillItems: { label: string; description: string; detail: string; fillValue: EndpointFillMode }[] = [
      {
        label: 'Hollow',
        description: currentFill === 'hollow' ? 'hollow (current)' : 'hollow',
        detail: 'Interior filled with theme canvas background; path trimmed cleanly at boundary',
        fillValue: 'hollow'
      },
      {
        label: 'Filled',
        description: currentFill === 'filled' ? 'filled (current)' : 'filled',
        detail: 'Solid foreground fill',
        fillValue: 'filled'
      }
    ];

    const pickedFill = await vscode.window.showQuickPick(fillItems, {
      title: `Vizion UML: Choose ${endLabel} ${pickedShape.shapeDescriptor.label} Fill Mode`,
      placeHolder: 'Select Hollow or Filled appearance'
    });

    if (!pickedFill) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenFill = pickedFill.fillValue;
  }

  ctx.restoreFocus(ctx.panel);

  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode.window.showWarningMessage('Document changed while endpoint picker was open. Endpoint update cancelled.');
    return;
  }

  const decoration: EndpointDecoration = {
    shape: pickedShape.shapeDescriptor.kind,
    size: currentDecoration?.size ?? pickedShape.shapeDescriptor.defaultSize,
    ...(chosenFill ? { fill: chosenFill } : {})
  };

  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-endpoint-${edgeId}-${end}`, ctx.expectedVersion, {
      type: 'uml.updateEndpoint',
      edgeId,
      end,
      decoration
    });
  });
}

export async function promptChangeRelationKindFlow(
  ctx: FlowContext,
  params: ChangeRelationKindParams
): Promise<void> {
  const { edgeId, currentKind } = params;

  const items = listUmlRelationPresets().map((preset) => ({
    label: preset.label,
    description: preset.kind === currentKind ? `${preset.kind} (current)` : preset.kind,
    detail: preset.description,
    presetKind: preset.kind
  }));

  const picked = await vscode.window.showQuickPick(items, {
    title: `Vizion UML: Change Relation Kind (${edgeId})`,
    placeHolder: 'Select relation semantic kind and reset notation preset'
  });

  ctx.restoreFocus(ctx.panel);
  if (!picked) return;

  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode.window.showWarningMessage('Document changed while picker was open. Operation cancelled.');
    return;
  }

  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-relkind-${edgeId}`, ctx.expectedVersion, {
      type: 'uml.updateEdge',
      edgeId,
      kind: picked.presetKind
    });
  });
}

/**
 * Backward-compatible alias for promptAddUmlEdgeFlow.
 */
export const promptCreateRelationFlow = promptAddUmlEdgeFlow;
