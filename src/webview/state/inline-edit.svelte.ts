import type {
  EndpointDecoration,
  UmlAttribute,
  UmlDocument,
  UmlEdge,
  UmlNode,
  UmlOperation
} from '../../shared/documents/types';
import {
  formatAttributesToText,
  formatOperationsToText,
  parseAttributesFromText,
  parseOperationsFromText
} from '../../shared/operations';
import type { VizionOperationPayload } from '../../shared/operations';

export interface InlineEditHost {
  readonly umlDoc: UmlDocument | undefined;
  dispatchOperation(operation: VizionOperationPayload): unknown;
}

export type InlineEditState =
  | { mode: 'none' }
  | {
      mode: 'node';
      nodeId: string;
      name: string;
      stereotype: string;
      text: string;
      attributes: string;
      operations: string;
    }
  | { mode: 'edgeLabel'; edgeId: string; label: string }
  | { mode: 'multiplicity'; edgeId: string; end: 'start' | 'end'; draft: string }
  | {
      mode: 'endpointPopup';
      x: number;
      y: number;
      edgeId: string;
      end: 'start' | 'end';
      current: EndpointDecoration;
      multiplicityDraft: string;
    };

/**
 * Owns all transient inline-editing drafts behind one discriminated state.
 * Commits dispatch semantic operations; cancellation discards drafts without touching the document.
 */
export class InlineEditController {
  constructor(private readonly host: InlineEditHost) {}

  state = $state<InlineEditState>({ mode: 'none' });

  get editingNodeId(): string | null {
    return this.state.mode === 'node' ? this.state.nodeId : null;
  }

  get editingEdgeId(): string | null {
    return this.state.mode === 'edgeLabel' ? this.state.edgeId : null;
  }

  get hasActiveEdit(): boolean {
    return this.state.mode !== 'none';
  }

  cancelAll(): void {
    this.state = { mode: 'none' };
  }

  beginNode(node: UmlNode): void {
    if (this.state.mode === 'node' && this.state.nodeId !== node.id) this.commitNode();
    if (this.state.mode === 'edgeLabel') this.commitEdgeLabel();
    if (this.state.mode === 'multiplicity') this.commitMultiplicity();
    this.state = {
      mode: 'node',
      nodeId: node.id,
      name: node.name ?? '',
      stereotype:
        node.kind === 'note' || node.kind === 'shape' || node.kind === 'frame'
          ? ''
          : (node.stereotype ?? ''),
      text: node.text ?? '',
      attributes: formatAttributesToText(node.attributes ?? []),
      operations: formatOperationsToText(node.operations ?? [])
    };
  }

  updateNodeDraft(
    patch: Partial<{
      name: string;
      stereotype: string;
      text: string;
      attributes: string;
      operations: string;
    }>
  ): void {
    if (this.state.mode !== 'node') return;
    this.state = { ...this.state, ...patch };
  }

  flushNodeHeader(node?: UmlNode): void {
    if (this.state.mode !== 'node') return;
    const nodeId = this.state.nodeId;
    const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
    if (!targetNode) return;

    const nextName = this.state.name.trim();
    const nextStereo = this.state.stereotype.replace(/^[«<]+|[»>]+$/g, '').trim();
    const updates: { name?: string; stereotype?: string } = {};
    if (nextName !== targetNode.name) updates.name = nextName;
    if (
      targetNode.kind !== 'note' &&
      targetNode.kind !== 'shape' &&
      targetNode.kind !== 'frame' &&
      nextStereo !== (targetNode.stereotype ?? '')
    ) {
      updates.stereotype = nextStereo;
    }
    if (Object.keys(updates).length > 0) {
      this.host.dispatchOperation({ type: 'uml.updateNode', nodeId: targetNode.id, ...updates });
    }
  }

  flushNodeMembers(node?: UmlNode): void {
    if (this.state.mode !== 'node') return;
    const nodeId = this.state.nodeId;
    const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
    if (!targetNode || targetNode.kind === 'note' || targetNode.kind === 'shape' || targetNode.kind === 'frame') {
      return;
    }

    const nextAttrs = parseAttributesFromText(this.state.attributes, targetNode.id, targetNode.attributes ?? []);
    const nextOps = parseOperationsFromText(this.state.operations, targetNode.id, targetNode.operations ?? []);

    const updates: { attributes?: UmlAttribute[]; operations?: UmlOperation[] } = {};
    const currentAttrs = targetNode.attributes ?? [];
    const attrsChanged =
      nextAttrs.length !== currentAttrs.length ||
      nextAttrs.some((attr, index) => {
        const current = currentAttrs[index];
        return (
          !current ||
          attr.name !== current.name ||
          (attr.type ?? '') !== (current.type ?? '') ||
          (attr.visibility ?? '+') !== (current.visibility ?? '+')
        );
      });
    if (attrsChanged) updates.attributes = nextAttrs;

    const currentOps = targetNode.operations ?? [];
    const opsChanged =
      nextOps.length !== currentOps.length ||
      nextOps.some((op, index) => {
        const current = currentOps[index];
        return (
          !current ||
          op.name !== current.name ||
          (op.returnType ?? '') !== (current.returnType ?? '') ||
          (op.visibility ?? '+') !== (current.visibility ?? '+') ||
          (op.signature ?? '()') !== (current.signature ?? '()')
        );
      });
    if (opsChanged) updates.operations = nextOps;

    if (Object.keys(updates).length > 0) {
      this.host.dispatchOperation({ type: 'uml.updateNode', nodeId: targetNode.id, ...updates });
    }
  }

  flushNodeText(node?: UmlNode): void {
    if (this.state.mode !== 'node') return;
    const nodeId = this.state.nodeId;
    const targetNode = node ?? this.host.umlDoc?.nodes.find((candidate) => candidate.id === nodeId);
    if (!targetNode || targetNode.kind !== 'note') return;
    if (this.state.text !== (targetNode.text ?? '')) {
      this.host.dispatchOperation({ type: 'uml.updateNode', nodeId: targetNode.id, text: this.state.text });
    }
  }

  commitNode(node?: UmlNode): void {
    this.flushNodeHeader(node);
    this.flushNodeMembers(node);
    this.flushNodeText(node);
    this.state = { mode: 'none' };
  }

  beginEdgeLabel(edge: UmlEdge): void {
    if (this.state.mode === 'node') this.commitNode();
    if (this.state.mode === 'multiplicity') this.commitMultiplicity();
    this.state = { mode: 'edgeLabel', edgeId: edge.id, label: edge.label ?? '' };
  }

  commitEdgeLabel(edge?: UmlEdge): void {
    if (this.state.mode !== 'edgeLabel') return;
    const edgeId = this.state.edgeId;
    const nextLabel = this.state.label.trim();
    const targetEdge = edge ?? this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
    this.state = { mode: 'none' };
    if (!targetEdge) return;
    if (nextLabel !== (targetEdge.label ?? '')) {
      this.host.dispatchOperation({ type: 'uml.updateEdge', edgeId: targetEdge.id, label: nextLabel });
    }
  }

  beginMultiplicity(edge: UmlEdge, end: 'start' | 'end'): void {
    if (this.state.mode === 'node') this.commitNode();
    if (this.state.mode === 'edgeLabel') this.commitEdgeLabel();
    this.state = {
      mode: 'multiplicity',
      edgeId: edge.id,
      end,
      draft: end === 'start' ? (edge.source.multiplicity ?? '') : (edge.target.multiplicity ?? '')
    };
  }

  commitMultiplicity(edge?: UmlEdge): void {
    if (this.state.mode !== 'multiplicity') return;
    const { edgeId, end, draft } = this.state;
    const targetEdge = edge ?? this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
    this.state = { mode: 'none' };
    if (!targetEdge) return;
    const cleaned = draft.trim();
    const previous =
      end === 'start' ? (targetEdge.source.multiplicity ?? '') : (targetEdge.target.multiplicity ?? '');
    if (cleaned !== previous) {
      this.host.dispatchOperation({
        type: 'uml.updateEdge',
        edgeId: targetEdge.id,
        ...(end === 'start' ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned })
      });
    }
  }

  beginEndpointPopup(
    x: number,
    y: number,
    edge: UmlEdge,
    end: 'start' | 'end',
    current: EndpointDecoration
  ): void {
    this.closeEndpointPopup();
    this.state = {
      mode: 'endpointPopup',
      x: Math.max(12, Math.min(x, (globalThis.innerWidth ?? 1024) - 260)),
      y: Math.max(12, Math.min(y, (globalThis.innerHeight ?? 768) - 360)),
      edgeId: edge.id,
      end,
      current,
      multiplicityDraft: end === 'start' ? (edge.source.multiplicity ?? '') : (edge.target.multiplicity ?? '')
    };
  }

  commitEndpointMultiplicity(): void {
    if (this.state.mode !== 'endpointPopup') return;
    const { edgeId, end, multiplicityDraft } = this.state;
    const targetEdge = this.host.umlDoc?.edges.find((candidate) => candidate.id === edgeId);
    if (!targetEdge) return;
    const cleaned = multiplicityDraft.trim();
    const previous =
      end === 'start' ? (targetEdge.source.multiplicity ?? '') : (targetEdge.target.multiplicity ?? '');
    if (cleaned !== previous) {
      this.host.dispatchOperation({
        type: 'uml.updateEdge',
        edgeId: targetEdge.id,
        ...(end === 'start' ? { sourceMultiplicity: cleaned } : { targetMultiplicity: cleaned })
      });
    }
  }

  closeEndpointPopup(): void {
    if (this.state.mode !== 'endpointPopup') return;
    this.commitEndpointMultiplicity();
    this.state = { mode: 'none' };
  }

  clearEndpointPopup(): void {
    if (this.state.mode === 'endpointPopup') this.state = { mode: 'none' };
  }
}
