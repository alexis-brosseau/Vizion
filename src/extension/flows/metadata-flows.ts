import * as vscode from 'vscode';
import type { UmlAttribute, UmlOperation } from '../../shared/documents/types';
import {
  formatOperationsToText,
  parseAttributesFromText,
  parseOperationsFromText
} from '../../shared/operations/text-parsers';
import type { FlowContext } from './flow-context';

export type RenameTargetKind =
  | 'node'
  | 'edgeLabel'
  | 'attribute'
  | 'operation'
  | 'documentTitle';

export interface RenameFlowParams {
  targetKind?: RenameTargetKind;
  targetId?: string;
  memberId?: string;
  currentValue?: string;
}

const ATTR_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/;
const OP_REGEX = /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)\s*(?:\((.*?)\))?(?:\s*:\s*(.+?))?\s*$/;

export async function promptRenameEntityFlow(
  ctx: FlowContext,
  params: RenameFlowParams = {}
): Promise<void> {
  let { targetKind, targetId, memberId, currentValue } = params;
  const doc = ctx.getLastValidDocument?.();

  // If targetKind is missing, ask the user what to rename
  if (!targetKind) {
    const kindItems: { label: string; description: string; targetKindValue: RenameTargetKind }[] = [
      { label: '$(symbol-class) Node Name', description: 'Rename a class, note, or shape', targetKindValue: 'node' },
      { label: '$(git-commit) Relation Label', description: 'Edit text label on a relation link', targetKindValue: 'edgeLabel' },
      { label: '$(symbol-field) Class Attribute', description: 'Edit visibility, name, or type of an attribute', targetKindValue: 'attribute' },
      { label: '$(symbol-method) Class Operation', description: 'Edit method signature, parameters, or return type', targetKindValue: 'operation' },
      { label: '$(book) Document Title', description: 'Change the title of this .viz diagram', targetKindValue: 'documentTitle' }
    ];

    const pickedKind = await vscode.window.showQuickPick(kindItems, {
      title: 'Vizion: What would you like to edit?',
      placeHolder: 'Select entity category'
    });

    if (!pickedKind) {
      ctx.restoreFocus(ctx.panel);
      return;
    }
    targetKind = pickedKind.targetKindValue;
  }

  // Handle specific target kinds
  switch (targetKind) {
    case 'node': {
      if (!targetId) {
        const nodes = doc?.nodes ?? [];
        if (nodes.length === 0) {
          void vscode.window.showInformationMessage('No nodes found in diagram to rename.');
          ctx.restoreFocus(ctx.panel);
          return;
        }
        const pickedNode = await vscode.window.showQuickPick(
          nodes.map((n) => ({ label: n.name || n.id, description: n.kind, nodeId: n.id })),
          { title: 'Vizion: Select Node to Rename' }
        );
        if (!pickedNode) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetId = pickedNode.nodeId;
        const found = nodes.find((n) => n.id === targetId);
        if (found) currentValue = found.name;
      }

      const nextName = await vscode.window.showInputBox({
        title: 'Vizion: Rename UML Node',
        value: currentValue ?? '',
        prompt: 'Enter new node identifier',
        validateInput: (v) => (!v.trim() ? 'Name cannot be empty.' : undefined)
      });

      ctx.restoreFocus(ctx.panel);
      if (!nextName || !nextName.trim()) return;

      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode.window.showWarningMessage('Document changed while input box was open. Edit cancelled.');
        return;
      }

      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `rename-node-${targetId}`, ctx.expectedVersion, {
          type: 'uml.updateNode',
          nodeId: targetId!,
          name: nextName.trim()
        });
      });
      break;
    }

    case 'edgeLabel': {
      if (!targetId) {
        const edges = doc?.edges ?? [];
        if (edges.length === 0) {
          void vscode.window.showInformationMessage('No relations found in diagram.');
          ctx.restoreFocus(ctx.panel);
          return;
        }
        const pickedEdge = await vscode.window.showQuickPick(
          edges.map((e) => ({
            label: e.label || `(${e.kind ?? 'relation'})`,
            description: `${e.sourceNodeId} → ${e.targetNodeId}`,
            edgeId: e.id
          })),
          { title: 'Vizion: Select Relation to Edit Label' }
        );
        if (!pickedEdge) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetId = pickedEdge.edgeId;
        const found = edges.find((e) => e.id === targetId);
        if (found) currentValue = found.label ?? '';
      }

      const nextLabel = await vscode.window.showInputBox({
        title: 'Vizion: Edit Relation Label',
        value: currentValue ?? '',
        prompt: 'Enter relation label (leave empty to clear)'
      });

      ctx.restoreFocus(ctx.panel);
      if (nextLabel === undefined) return;

      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode.window.showWarningMessage('Document changed while input box was open. Edit cancelled.');
        return;
      }

      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `rename-edge-${targetId}`, ctx.expectedVersion, {
          type: 'uml.updateEdge',
          edgeId: targetId!,
          label: nextLabel.trim()
        });
      });
      break;
    }

    case 'documentTitle': {
      const nextTitle = await vscode.window.showInputBox({
        title: 'Vizion: Rename Document Title',
        value: currentValue ?? doc?.title ?? '',
        prompt: 'Enter new diagram title',
        validateInput: (v) => (!v.trim() ? 'Title cannot be empty.' : undefined)
      });

      ctx.restoreFocus(ctx.panel);
      if (!nextTitle || !nextTitle.trim()) return;

      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode.window.showWarningMessage('Document changed while input box was open. Edit cancelled.');
        return;
      }

      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, 'rename-doc', ctx.expectedVersion, {
          type: 'uml.updateMetadata',
          title: nextTitle.trim()
        });
      });
      break;
    }

    case 'attribute': {
      const candidateNodes = doc?.nodes.filter((n) => n.kind === 'class' || (n.attributes && n.attributes.length > 0)) ?? [];
      if (candidateNodes.length === 0) {
        void vscode.window.showInformationMessage('No classes with attributes found in diagram.');
        ctx.restoreFocus(ctx.panel);
        return;
      }

      let targetNode = candidateNodes.find((n) => n.id === targetId);
      if (!targetNode) {
        const picked = await vscode.window.showQuickPick(
          candidateNodes.map((n) => ({ label: n.name, description: `${n.attributes?.length ?? 0} attributes`, node: n })),
          { title: 'Vizion: Select Class Containing Attribute' }
        );
        if (!picked) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetNode = picked.node;
        targetId = targetNode.id;
      }

      const attrs = targetNode.attributes ?? [];
      let targetAttr: UmlAttribute | undefined = attrs.find((a) => a.id === memberId);
      if (!targetAttr && attrs.length > 0) {
        const pickedAttr = await vscode.window.showQuickPick(
          attrs.map((a) => ({
            label: `${a.visibility ?? '+'} ${a.name}${a.type ? `: ${a.type}` : ''}`,
            attr: a
          })),
          { title: `Vizion: Select Attribute in "${targetNode.name}"` }
        );
        if (!pickedAttr) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetAttr = pickedAttr.attr;
        memberId = targetAttr.id;
      }

      const defaultAttrText = targetAttr
        ? `${targetAttr.visibility ?? '+'} ${targetAttr.name}${targetAttr.type ? `: ${targetAttr.type}` : ''}`
        : '+ id: string';

      const nextAttrText = await vscode.window.showInputBox({
        title: `Vizion: Edit Attribute (${targetNode.name})`,
        value: currentValue ?? defaultAttrText,
        prompt: 'Format: [+|-|#|~] name: type (e.g. + totalAmount: number)',
        validateInput: (v) => (!ATTR_REGEX.test(v.trim()) ? 'Invalid attribute syntax. Example: + name: string' : undefined)
      });

      ctx.restoreFocus(ctx.panel);
      if (!nextAttrText || !nextAttrText.trim()) return;

      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode.window.showWarningMessage('Document changed while input box was open. Edit cancelled.');
        return;
      }

      // Parse the new attribute text and update the attribute list
      const parsedAttrs = parseAttributesFromText(nextAttrText.trim(), targetId!, targetAttr ? [targetAttr] : []);
      if (parsedAttrs.length === 0) return;

      const newAttr = parsedAttrs[0];
      const updatedList: UmlAttribute[] = attrs.map((a) => (a.id === memberId ? newAttr : a));
      if (!attrs.some((a) => a.id === memberId)) {
        updatedList.push(newAttr);
      }

      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `update-attr-${targetId}`, ctx.expectedVersion, {
          type: 'uml.updateNode',
          nodeId: targetId!,
          attributes: updatedList
        });
      });
      break;
    }

    case 'operation': {
      const candidateNodes = doc?.nodes.filter((n) => n.kind === 'class' || (n.operations && n.operations.length > 0)) ?? [];
      if (candidateNodes.length === 0) {
        void vscode.window.showInformationMessage('No classes with operations found in diagram.');
        ctx.restoreFocus(ctx.panel);
        return;
      }

      let targetNode = candidateNodes.find((n) => n.id === targetId);
      if (!targetNode) {
        const picked = await vscode.window.showQuickPick(
          candidateNodes.map((n) => ({ label: n.name, description: `${n.operations?.length ?? 0} operations`, node: n })),
          { title: 'Vizion: Select Class Containing Operation' }
        );
        if (!picked) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetNode = picked.node;
        targetId = targetNode.id;
      }

      const ops = targetNode.operations ?? [];
      let targetOp: UmlOperation | undefined = ops.find((o) => o.id === memberId);
      if (!targetOp && ops.length > 0) {
        const pickedOp = await vscode.window.showQuickPick(
          ops.map((o) => ({
            label: `${o.visibility ?? '+'} ${o.name}${o.signature ?? '()'}${o.returnType ? `: ${o.returnType}` : ''}`,
            op: o
          })),
          { title: `Vizion: Select Operation in "${targetNode.name}"` }
        );
        if (!pickedOp) {
          ctx.restoreFocus(ctx.panel);
          return;
        }
        targetOp = pickedOp.op;
        memberId = targetOp.id;
      }

      const defaultOpText = targetOp
        ? `${targetOp.visibility ?? '+'} ${targetOp.name}${targetOp.signature ?? '()'}${targetOp.returnType ? `: ${targetOp.returnType}` : ''}`
        : '+ execute(): void';

      const nextOpText = await vscode.window.showInputBox({
        title: `Vizion: Edit Operation (${targetNode.name})`,
        value: currentValue ?? defaultOpText,
        prompt: 'Format: [+|-|#|~] name(param: type): returnType (e.g. + calculateTotal(discount: number): number)',
        validateInput: (v) => (!OP_REGEX.test(v.trim()) ? 'Invalid operation syntax. Example: + execute(): void' : undefined)
      });

      ctx.restoreFocus(ctx.panel);
      if (!nextOpText || !nextOpText.trim()) return;

      if (ctx.document.version !== ctx.expectedVersion) {
        void vscode.window.showWarningMessage('Document changed while input box was open. Edit cancelled.');
        return;
      }

      const parsedOps = parseOperationsFromText(nextOpText.trim(), targetId!, targetOp ? [targetOp] : []);
      if (parsedOps.length === 0) return;

      const newOp = parsedOps[0];
      const updatedList: UmlOperation[] = ops.map((o) => (o.id === memberId ? newOp : o));
      if (!ops.some((o) => o.id === memberId)) {
        updatedList.push(newOp);
      }

      await ctx.enqueueOperation(async () => {
        await ctx.executeOperation(ctx.panel, `update-op-${targetId}`, ctx.expectedVersion, {
          type: 'uml.updateNode',
          nodeId: targetId!,
          operations: updatedList
        });
      });
      break;
    }
  }
}
