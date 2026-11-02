import type { UmlDocument } from '../../shared/documents/types';
import { selectEntity, syncSelectionEdges } from './selection-logic';

/**
 * Owns the multi-selection set and the node/edge coupling rules:
 * selecting both endpoints selects their relation; deselecting an endpoint
 * deselects incident relations.
 */
export class SelectionController {
  selectedIds = $state<string[]>([]);

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  setSelectedIds(doc: UmlDocument | undefined, ids: string[]): void {
    this.selectedIds = this.syncSelectionEdges(doc, ids, this.selectedIds);
  }

  selectSingle(doc: UmlDocument | undefined, id: string, additive = false): void {
    this.selectedIds = selectEntity(doc, this.selectedIds, id, additive);
  }

  clear(): void {
    this.selectedIds = [];
  }

  /**
   * Drops ids that no longer exist in the authoritative document.
   */
  prune(doc: UmlDocument | undefined): void {
    if (!doc) return;
    const validIds = new Set<string>([
      ...doc.nodes.map((node) => node.id),
      ...doc.edges.map((edge) => edge.id)
    ]);
    const filtered = this.selectedIds.filter((id) => validIds.has(id));
    if (filtered.length !== this.selectedIds.length) {
      this.selectedIds = this.syncSelectionEdges(doc, filtered, this.selectedIds);
    }
  }

  syncSelectionEdges(
    doc: UmlDocument | undefined,
    baseIds: string[],
    prevIds: string[] = this.selectedIds
  ): string[] {
    return syncSelectionEdges(doc, baseIds, prevIds);
  }
}
