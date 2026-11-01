<script lang="ts">
  import type { VizionDocumentKind } from '../shared/documents/types';
  import ContextMenu from './common/ContextMenu.svelte';
  import ErrorView from './common/ErrorView.svelte';
  import { VizionWebviewStore } from './state.svelte';
  import UmlCanvas from './uml/UmlCanvas.svelte';

  let { initialKind = 'uml' }: { initialKind?: VizionDocumentKind } = $props();
  const store = new VizionWebviewStore(initialKind);
</script>

<main class="vz-root" aria-label="Vizion Visual Architecture Editor">
  {#if store.statusMessage}
    <div class="vz-status-banner" role="status" aria-live="polite">
      <span>{store.statusMessage}</span>
      <button
        type="button"
        class="vz-banner-close"
        aria-label="Dismiss notification"
        onclick={() => (store.statusMessage = null)}
      >
        ×
      </button>
    </div>
  {/if}

  {#if store.isReadOnly}
    <div class="vz-readonly-bar" role="note">
      Read-Only Mode (Non-file URI or untrusted document)
    </div>
  {/if}

  {#if !store.valid}
    <ErrorView {store} />
  {:else}
    <UmlCanvas {store} />
  {/if}

  <ContextMenu {store} />
</main>
