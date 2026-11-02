<script lang="ts">
  import type { UmlNode } from '../../../../shared/documents/types';
  import {
    extractOperationParameters,
    formatVisibilitySign
  } from '../../../../shared/operations';

  let {
    node,
    kind,
    visible = true,
    editing = false,
    draft = '',
    readOnly = false,
    onToggle,
    onDraftChange,
    onCommit,
    onCancel
  }: {
    node: UmlNode;
    kind: 'attributes' | 'operations';
    visible?: boolean;
    editing?: boolean;
    draft?: string;
    readOnly?: boolean;
    onToggle?: () => void;
    onDraftChange?: (value: string) => void;
    onCommit?: () => void;
    onCancel?: () => void;
  } = $props();

  const title = $derived(kind === 'attributes' ? 'Attributes' : 'Operations');
  const placeholder = $derived(
    kind === 'attributes'
      ? '+ name: type\n- privateField: string'
      : '+ method(): returnType\n+ execute(arg: type)'
  );
  const memberCount = $derived(
    kind === 'attributes' ? (node.attributes ?? []).length : (node.operations ?? []).length
  );

  function handleBlur(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (next?.closest(`[data-node-id="${node.id}"]`)) return;
    onCommit?.();
  }
</script>

{#if editing || (visible && memberCount > 0)}
<div class="vz-uml-compartment">
  {#if editing}
    <div class="vz-inline-sec-hdr">
      <span>{title}</span>
      <button
        type="button"
        class="vz-eye-toggle-btn"
        class:off={!visible}
        title={visible ? `Hide ${title}` : `Show ${title}`}
        aria-label={visible ? `Hide ${title}` : `Show ${title}`}
        disabled={readOnly}
        onclick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
      >
        {visible ? '◉' : '○'}
      </button>
    </div>
    {#if visible}
      <textarea
        class="vz-inline-textarea"
        rows={Math.max(1, draft.split('\n').length)}
        {placeholder}
        value={draft}
        aria-label={title}
        oninput={(event) => onDraftChange?.(event.currentTarget.value)}
        onblur={handleBlur}
        onkeydown={(event) => {
          if (event.key === 'Escape') onCancel?.();
        }}
      ></textarea>
    {/if}
  {:else if kind === 'attributes'}
    {#each node.attributes ?? [] as attribute (attribute.id)}
      <div class="vz-uml-member">
        <span class="vz-vis">{formatVisibilitySign(attribute.visibility)}</span>
        <span>{attribute.name}</span>
        {#if attribute.type}
          <span class="vz-type">: {attribute.type}</span>
        {/if}
      </div>
    {/each}
  {:else}
    {#each node.operations ?? [] as operation (operation.id)}
      {@const parameters = extractOperationParameters(operation)}
      <div class="vz-uml-member">
        <span class="vz-vis">{formatVisibilitySign(operation.visibility)}</span>
        <span>{operation.name}(</span>
        {#each parameters as parameter, index (parameter.id ?? index)}
          {#if index > 0}<span>, </span>{/if}
          <span>{parameter.name}</span>
          {#if parameter.type}<span class="vz-type">: {parameter.type}</span>{/if}
        {/each}
        <span>)</span>
        {#if operation.returnType}
          <span class="vz-type">: {operation.returnType}</span>
        {/if}
      </div>
    {/each}
  {/if}
</div>
{/if}
