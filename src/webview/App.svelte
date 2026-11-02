<script lang="ts">
  import type { VizionDocumentKind } from '../shared/documents/types';
  import ContextMenu from './ui/menu/ContextMenu.svelte';
  import ErrorView from './common/ErrorView.svelte';
  import { VizionWebviewStore } from './state.svelte';
  import CanvasViewport from './canvas/CanvasViewport.svelte';
  import SidebarContainer from './sidebar/SidebarContainer.svelte';
  import { deleteSelection, duplicateSelection } from './services/selection-actions';
  import Banner from './ui/layout/Banner.svelte';
  import ReadonlyBar from './ui/layout/ReadonlyBar.svelte';

  let { initialKind = 'uml' }: { initialKind?: VizionDocumentKind } = $props();
  // svelte-ignore state_referenced_locally
  const store = new VizionWebviewStore(initialKind);
</script>

<main class="vz-root" aria-label="Vizion Visual Architecture Editor">
  {#if store.staleNotice}
    <Banner
      severity="warning"
      message={store.staleNotice}
      ondismiss={() => store.setStaleNotice(null)}
    />
  {/if}

  {#if store.statusMessage}
    <Banner message={store.statusMessage} ondismiss={() => store.setStatusMessage(null)} />
  {/if}

  {#if store.isReadOnly}
    <ReadonlyBar />
  {/if}

  {#if !store.valid}
    <ErrorView {store} />
  {:else}
    <div class="vz-main-split">
      <CanvasViewport {store} />
      <SidebarContainer
        {store}
        onDeleteSelected={() => deleteSelection(store)}
        onDuplicateSelected={() => duplicateSelection(store)}
      />
    </div>
  {/if}

  <ContextMenu {store} />
</main>
