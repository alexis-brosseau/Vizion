import type { UmlDocument } from '../../shared/documents/types';

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
    let next: string[];
    if (additive) {
      next = this.selectedIds.includes(id)
        ? this.selectedIds.filter((existing) => existing !== id)
        : [...this.selectedIds, id];
    } else {
      next = [id];
    }
    this.selectedIds = this.syncSelectionEdges(doc, next, this.selectedIds);
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
    if (!doc) return baseIds;
    const selectedSet = new Set(baseIds);
    const prevNodeIds = new Set(
      doc.nodes.filter((node) => prevIds.includes(node.id)).map((node) => node.id)
    );
    const nextNodeIds = new Set(
      doc.nodes.filter((node) => selectedSet.has(node.id)).map((node) => node.id)
    );

    const deselectedNodes = new Set([...prevNodeIds].filter((id) => !nextNodeIds.has(id)));

    for (const deselectedId of deselectedNodes) {
      for (const edge of doc.edges) {
        if (edge.source.nodeId === deselectedId || edge.target.nodeId === deselectedId) {
          selectedSet.delete(edge.id);
        }
      }
    }

    if (nextNodeIds.size >= 2) {
      for (const edge of doc.edges) {
        if (nextNodeIds.has(edge.source.nodeId) && nextNodeIds.has(edge.target.nodeId)) {
          selectedSet.add(edge.id);
        } else if (
          edge.source.nodeId &&
          edge.target.nodeId &&
          (!nextNodeIds.has(edge.source.nodeId) || !nextNodeIds.has(edge.target.nodeId))
        ) {
          selectedSet.delete(edge.id);
        }
      }
    } else {
      for (const edge of doc.edges) {
        if (
          selectedSet.has(edge.id) &&
          (nextNodeIds.has(edge.source.nodeId) || nextNodeIds.has(edge.target.nodeId))
        ) {
          selectedSet.delete(edge.id);
        }
      }
    }

    return Array.from(selectedSet);
  }
}
