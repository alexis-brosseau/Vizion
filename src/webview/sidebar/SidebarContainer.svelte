<script lang="ts">
  import type { VizionWebviewStore } from '../state.svelte';
  import Splitter from '../ui/layout/Splitter.svelte';
  import ElementsOutline from './outline/ElementsOutline.svelte';
  import InspectorPane from './inspector/InspectorPane.svelte';

  let {
    store,
    onDeleteSelected,
    onDuplicateSelected
  }: {
    store: VizionWebviewStore;
    onDeleteSelected: () => void;
    onDuplicateSelected: () => void;
  } = $props();
</script>

<Splitter
  orientation="vertical"
  label="Resize sidebar width"
  onresize={(delta) => store.setSidebarWidth(store.sidebarWidth - delta)}
/>

<aside
  class="vz-sidebar vz-inspector"
  style="width: {store.sidebarWidth}px;"
  aria-label="UML Property Inspector"
>
  <ElementsOutline {store} {onDeleteSelected} {onDuplicateSelected} />
  <InspectorPane {store} />
</aside>
