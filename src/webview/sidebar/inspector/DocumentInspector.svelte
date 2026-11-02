<script lang="ts">
  import type { UmlRoutingKind } from '../../../shared/documents/types';
  import { isMigrationNeeded, isNewerVersionDocument } from '../../../shared/documents/migrations';
  import { EXTENSION_VERSION } from '../../../shared/documents/version';
  import Select from '../../ui/input/Select.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';

  let { store }: { store: VizionWebviewStore } = $props();
  const doc = $derived(store.umlDoc);
</script>

<div class="vz-sidebar-header">
  <span class="vz-sidebar-title">UML Document</span>
</div>

<div class="vz-inspector-body">
  {#if doc && isNewerVersionDocument(doc)}
    <div class="vz-migration-banner vz-compatibility-banner">
      <div class="vz-migration-header">
        <span class="vz-migration-title">Compatibility Warning</span>
      </div>
      <p class="vz-migration-text">
        This document was created with a newer version of Vizion ({doc.version ?? 'future'}). Please update the extension to ensure full compatibility.
      </p>
      <button
        type="button"
        class="vz-btn vz-btn-primary vz-migration-btn"
        onclick={() => store.checkForExtensionUpdate()}
      >
        Update
      </button>
    </div>
  {:else if doc && isMigrationNeeded(doc)}
    <div class="vz-migration-banner">
      <div class="vz-migration-header">
        <span class="vz-migration-title">Update Available</span>
      </div>
      <p class="vz-migration-text">
        Document version ({doc.version ?? 'legacy'}) does not match the latest rules ({EXTENSION_VERSION}).
      </p>
      <button
        type="button"
        class="vz-btn vz-btn-primary vz-migration-btn"
        disabled={store.isReadOnly}
        onclick={() => store.dispatchOperation({ type: 'uml.migrateDocument' })}
      >
        Migrate Document
      </button>
    </div>
  {/if}

  {#if doc}
    <label class="vz-field">
      <span class="vz-field-label">Title</span>
      <input
        type="text"
        class="vz-input"
        value={doc.title}
        disabled={store.isReadOnly}
        onchange={(event) =>
          store.dispatchOperation({
            type: 'uml.updateMetadata',
            title: event.currentTarget.value
          })}
      />
    </label>

    <label class="vz-field">
      <span class="vz-field-label">Description</span>
      <textarea
        class="vz-textarea"
        rows="4"
        value={doc.description ?? doc.ai?.purpose ?? ''}
        disabled={store.isReadOnly}
        placeholder="Describe the purpose of this architecture model…"
        onchange={(event) =>
          store.dispatchOperation({
            type: 'uml.updateMetadata',
            description: event.currentTarget.value
          })}
      ></textarea>
    </label>

    <div class="vz-field">
      <span class="vz-field-label">Default Routing</span>
      <Select
        ariaLabel="Default Routing"
        value={doc.defaultRouting ?? 'orthogonal'}
        options={[
          { value: 'orthogonal', label: 'Orthogonal' },
          { value: 'straight', label: 'Straight' },
          { value: 'bezier', label: 'Smooth' }
        ]}
        disabled={store.isReadOnly}
        onchange={(value) =>
          store.dispatchOperation({
            type: 'uml.updateMetadata',
            defaultRouting: value as UmlRoutingKind
          })}
      />
    </div>
  {/if}
</div>
