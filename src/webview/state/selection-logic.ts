import type { UmlDocument } from '../../shared/documents/types';

/**
 * Applies node/edge coupling to a set of selected ids.
 *
 * Selecting or deselecting nodes updates incident relations. Relations are
 * never inferred away when the user explicitly selects an edge; that case is
 * handled by `selectEntity` before this helper runs.
 */
export function syncSelectionEdges(
  doc: UmlDocument | undefined,
  baseIds: string[],
  prevIds: string[]
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

/**
 * Resolves a direct click on a node or relation.
 * A direct relation click is authoritative: it is not removed just because
 * the relation happens to touch a previously selected node.
 */
export function selectEntity(
  doc: UmlDocument | undefined,
  currentIds: string[],
  id: string,
  additive: boolean
): string[] {
  const isEdge = doc?.edges.some((edge) => edge.id === id) ?? false;

  if (isEdge) {
    if (!additive) return [id];
    return currentIds.includes(id)
      ? currentIds.filter((existing) => existing !== id)
      : [...currentIds, id];
  }

  const next = additive
    ? currentIds.includes(id)
      ? currentIds.filter((existing) => existing !== id)
      : [...currentIds, id]
    : [id];

  return syncSelectionEdges(doc, next, currentIds);
}
