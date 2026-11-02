<script lang="ts">
  import type { UmlNode } from '../../../../shared/documents/types';
  import { getUmlNodeKind } from '../../../../shared/registry/uml-registry';

  let {
    node,
    editing = false,
    name = '',
    stereotype = '',
    readOnly = false,
    onDraftChange,
    onCommit,
    onCancel
  }: {
    node: UmlNode;
    editing?: boolean;
    name?: string;
    stereotype?: string;
    readOnly?: boolean;
    onDraftChange?: (patch: { name?: string; stereotype?: string }) => void;
    onCommit?: () => void;
    onCancel?: () => void;
  } = $props();

  const kindDescriptor = $derived(getUmlNodeKind(node.kind));
  const displayStereotype = $derived(node.stereotype || kindDescriptor?.defaultStereotype || '');

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      onCommit?.();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onCancel?.();
    }
  }

  function handleBlur(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (next?.closest(`[data-node-id="${node.id}"]`)) return;
    onCommit?.();
  }
</script>

<div class="vz-uml-node-header" class:editing>
  {#if editing}
    {#if node.kind === 'note'}
      <div class="vz-inline-field">
        <div class="vz-inline-sec-hdr"><span>Name</span></div>
        <input
          type="text"
          class="vz-inline-input"
          value={name}
          aria-label="Note name"
          oninput={(event) => onDraftChange?.({ name: event.currentTarget.value })}
          onblur={handleBlur}
          onkeydown={handleKeyDown}
        />
      </div>
    {:else}
      <div class="vz-inline-fields">
        <div class="vz-inline-field">
          <div class="vz-inline-sec-hdr"><span>Name</span></div>
          <input
            type="text"
            class="vz-inline-input"
            placeholder="Name"
            value={name}
            aria-label="Node name"
            oninput={(event) => onDraftChange?.({ name: event.currentTarget.value })}
            onblur={handleBlur}
            onkeydown={handleKeyDown}
          />
        </div>
        {#if node.kind !== 'note'}
          <div class="vz-inline-field">
            <div class="vz-inline-sec-hdr"><span>Stereotype</span></div>
            <input
              type="text"
              class="vz-inline-input"
              placeholder="e.g. entity, service"
              value={stereotype}
              aria-label="Stereotype"
              oninput={(event) => onDraftChange?.({ stereotype: event.currentTarget.value })}
              onblur={handleBlur}
              onkeydown={handleKeyDown}
            />
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    {#if node.kind !== 'note' && displayStereotype}
      <div class="vz-uml-stereotype">«{displayStereotype}»</div>
    {:else if !kindDescriptor}
      <div class="vz-uml-stereotype">«unsupported: {node.kind}»</div>
    {/if}
    <div class="vz-uml-node-title">{node.name}</div>
  {/if}
</div>
