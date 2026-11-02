<script lang="ts">
  import type { UmlEdge, UmlNode } from '../../../shared/documents/types';
  import type { VizionWebviewStore } from '../../state.svelte';
  import DocumentInspector from './DocumentInspector.svelte';
  import EdgeInspector from './EdgeInspector.svelte';
  import NodeInspector from './NodeInspector.svelte';

  let { store }: { store: VizionWebviewStore } = $props();

  const selectedNode = $derived<UmlNode | undefined>(
    store.umlDoc?.nodes.find((node) => store.selectedIds.includes(node.id))
  );
  const selectedEdge = $derived<UmlEdge | undefined>(
    store.umlDoc?.edges.find((edge) => store.selectedIds.includes(edge.id))
  );
  const selectedEdgeTouchesNote = $derived.by(() => {
    if (!selectedEdge || !store.umlDoc) return false;
    const source = store.umlDoc.nodes.find((node) => node.id === selectedEdge.source.nodeId);
    const target = store.umlDoc.nodes.find((node) => node.id === selectedEdge.target.nodeId);
    return source?.kind === 'note' || target?.kind === 'note';
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="vz-inspector-pane"
  oncontextmenu={(event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"], [data-vz-select]')) return;
    event.preventDefault();
    event.stopPropagation();
  }}
>
  {#if selectedNode}
    <NodeInspector {store} {selectedNode} />
  {:else if selectedEdge}
    <EdgeInspector {store} {selectedEdge} touchesNote={selectedEdgeTouchesNote} />
  {:else}
    <DocumentInspector {store} />
  {/if}
</div>
