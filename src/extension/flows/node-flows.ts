import * as vscode from 'vscode';
import type { UmlShapeGeometry } from '../../shared/documents/types';
import { listUmlNodeKinds, UML_SHAPE_GEOMETRIES } from '../../shared/registry/uml-registry';
import type { FlowContext } from './flow-context';

export interface NodeFlowParams {
  x?: number;
  y?: number;
  defaultKind?: string;
  stereotype?: string;
  name?: string;
  shapeGeometry?: UmlShapeGeometry;
}

export async function promptAddUmlNodeFlow(
  ctx: FlowContext,
  params: NodeFlowParams = {}
): Promise<void> {
  const { x = 120, y = 100, defaultKind } = params;

  // Step 1: Choose node kind if not specified
  let chosenKind = defaultKind;
  if (!chosenKind) {
    const kindItems = listUmlNodeKinds().map((desc) => ({
      label: desc.label,
      description: desc.kind,
      detail: desc.description,
      kindValue: desc.kind
    }));
    const picked = await vscode.window.showQuickPick(kindItems, {
      title: 'Vizion UML: Choose Node Kind',
      placeHolder: 'Select class, note, shape, or frame'
    });
    if (!picked) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenKind = picked.kindValue;
  }

  // Step 2a: If class, optionally choose stereotype
  let chosenStereotype = params.stereotype;
  if (chosenKind === 'class' && chosenStereotype === undefined) {
    const stereotypeItems = [
      { label: '$(symbol-class) (None)', description: 'Standard UML Class', value: '' },
      { label: '$(symbol-interface) «interface»', description: 'Interface specification', value: 'interface' },
      { label: '$(symbol-structure) «abstract»', description: 'Abstract base class', value: 'abstract' },
      { label: '$(symbol-misc) «service»', description: 'Business or domain service', value: 'service' },
      { label: '$(database) «entity»', description: 'Persistent domain entity', value: 'entity' },
      { label: '$(edit) Custom Stereotype...', description: 'Specify a custom stereotype label', value: '__CUSTOM__' }
    ];

    const pickedStereo = await vscode.window.showQuickPick(stereotypeItems, {
      title: 'Vizion UML: Class Stereotype',
      placeHolder: 'Select a standard stereotype or leave as standard class'
    });

    if (pickedStereo === undefined) {
      ctx.restoreFocus(ctx.panel);
      return;
    }

    if (pickedStereo.value === '__CUSTOM__') {
      const customStereo = await vscode.window.showInputBox({
        title: 'Vizion UML: Custom Stereotype',
        prompt: 'Enter custom stereotype (without guillemets)',
        placeHolder: 'e.g. repository, controller, boundary',
        validateInput: (v) => (!v.trim() ? 'Stereotype cannot be empty' : undefined)
      });
      if (customStereo === undefined) {
        ctx.restoreFocus(ctx.panel);
        return;
      }
      chosenStereotype = customStereo.replace(/[«»]/g, '').trim();
    } else {
      chosenStereotype = pickedStereo.value;
    }
  }

  // Step 2b: If shape, choose shape geometry
  let chosenShapeGeometry = params.shapeGeometry;
  if (chosenKind === 'shape' && !chosenShapeGeometry) {
    const shapeItems: { label: string; description: string; geometry: UmlShapeGeometry }[] = UML_SHAPE_GEOMETRIES.map((geo) => ({
      label: geo.label,
      description: `UML 2.5 ${geo.kind} geometry`,
      geometry: geo.kind
    }));

    const pickedShape = await vscode.window.showQuickPick(shapeItems, {
      title: 'Vizion UML: Shape Geometry',
      placeHolder: 'Select geometric shape outline'
    });

    if (!pickedShape) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    chosenShapeGeometry = pickedShape.geometry;
  }

  // Step 3: Prompt for Name / Summary
  const defaultName =
    params.name ??
    (chosenKind === 'note'
      ? 'Architecture Note'
      : chosenKind === 'shape'
        ? (chosenShapeGeometry ? chosenShapeGeometry.charAt(0).toUpperCase() + chosenShapeGeometry.slice(1) : 'Shape')
        : chosenKind === 'frame'
          ? 'Frame'
          : chosenStereotype === 'interface'
            ? 'IService'
            : 'DomainEntity');

  const enteredName = await vscode.window.showInputBox({
    title: `Vizion UML: New ${chosenKind.toUpperCase()} Name`,
    prompt: chosenKind === 'note' ? 'Enter note text or summary' : `Enter ${chosenKind} identifier`,
    value: defaultName,
    validateInput: (val) => {
      const trimmed = val.trim();
      if (trimmed.length === 0) return 'Name cannot be empty';
      if (chosenKind === 'class' && !/^[a-zA-Z_$][\w$-]*$/.test(trimmed)) {
        return 'Class name should be a valid identifier (e.g. OrderService, User_Entity)';
      }
      return undefined;
    }
  });

  ctx.restoreFocus(ctx.panel);
  if (!enteredName || enteredName.trim().length === 0) return;

  if (ctx.document.version !== ctx.expectedVersion) {
    void vscode.window.showWarningMessage('Document changed while the picker was open. Please retry adding the node.');
    return;
  }

  const baseSlug =
    enteredName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || chosenKind;
  const uniqueId = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

  await ctx.enqueueOperation(async () => {
    await ctx.executeOperation(ctx.panel, `host-add-${uniqueId}`, ctx.expectedVersion, {
      type: 'uml.addNode',
      id: uniqueId,
      kind: chosenKind,
      name: enteredName.trim(),
      x,
      y,
      ...(chosenShapeGeometry ? { shape: chosenShapeGeometry } : {}),
      text: chosenKind === 'note' ? enteredName.trim() : undefined
    });

    if (chosenKind === 'class' && chosenStereotype) {
      await ctx.executeOperation(ctx.panel, `host-set-stereo-${uniqueId}`, ctx.document.version, {
        type: 'uml.updateNode',
        nodeId: uniqueId,
        stereotype: chosenStereotype
      });
    }
  });
}

/**
 * Backward-compatible alias for promptAddUmlNodeFlow.
 */
export const promptCreateNodeFlow = promptAddUmlNodeFlow;
