import type { UmlDocument, VizionDocumentKind } from '../../shared/documents/types';

export interface ClipboardState {
  kind: VizionDocumentKind;
  nodeIds: string[];
  edgeIds: string[];
  pasteCount: number;
}

/**
 * Owns copy/paste bookkeeping. The clipboard is intentionally session-local:
 * it never persists across webview lifetimes and never serializes to disk.
 */
export class ClipboardController {
  state = $state<ClipboardState | null>(null);

  copy(doc: UmlDocument | undefined, selectedIds: string[]): void {
    if (!doc || selectedIds.length === 0) return;
    const nodeIds = doc.nodes.filter((node) => selectedIds.includes(node.id)).map((node) => node.id);
    const edgeIds = doc.edges.filter((edge) => selectedIds.includes(edge.id)).map((edge) => edge.id);
    if (nodeIds.length === 0 && edgeIds.length === 0) return;

    this.state = { kind: 'uml', nodeIds, edgeIds, pasteCount: 0 };
  }

  nextPasteOffset(): number {
    if (!this.state) return 0;
    this.state.pasteCount += 1;
    return this.state.pasteCount * 20;
  }

  reset(): void {
    this.state = null;
  }
}
