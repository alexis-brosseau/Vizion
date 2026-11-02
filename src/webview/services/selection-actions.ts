import type { VizionWebviewStore } from '../state.svelte';

export function deleteSelection(store: VizionWebviewStore): void {
  if (store.isReadOnly || store.selectedIds.length === 0) return;
  const doc = store.umlDoc;
  if (!doc) return;

  const nodeIds = doc.nodes.filter((node) => store.selectedIds.includes(node.id)).map((node) => node.id);
  const edgeIds = doc.edges.filter((edge) => store.selectedIds.includes(edge.id)).map((edge) => edge.id);
  if (nodeIds.length === 0 && edgeIds.length === 0) return;

  store.dispatchOperation({ type: 'uml.deleteEntities', nodeIds, edgeIds });
  store.clearSelection();
}

export function duplicateSelection(store: VizionWebviewStore): void {
  if (store.isReadOnly || store.selectedIds.length === 0) return;
  const doc = store.umlDoc;
  if (!doc) return;

  const nodeIds = doc.nodes.filter((node) => store.selectedIds.includes(node.id)).map((node) => node.id);
  const edgeIds = doc.edges.filter((edge) => store.selectedIds.includes(edge.id)).map((edge) => edge.id);
  if (nodeIds.length === 0 && edgeIds.length === 0) return;

  store.dispatchOperation({
    type: 'uml.duplicateSelection',
    nodeIds,
    edgeIds,
    offsetX: 20,
    offsetY: 20
  });
}
