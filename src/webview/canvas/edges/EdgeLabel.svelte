<script lang="ts">
  import type { Point2D } from '../../../shared/geometry';

  let {
    point,
    label,
    selected = false,
    editing = false,
    draft = '',
    maxWidth = 220,
    align = 'center',
    frameLabel = false,
    onselect,
    ondblclick,
    onDraftChange,
    onCommit,
    onCancel
  }: {
    point: Point2D;
    label?: string;
    selected?: boolean;
    editing?: boolean;
    draft?: string;
    maxWidth?: number;
    align?: 'center' | 'above-left';
    frameLabel?: boolean;
    onselect?: (event: MouseEvent) => void;
    ondblclick?: (event: MouseEvent) => void;
    onDraftChange?: (value: string) => void;
    onCommit?: () => void;
    onCancel?: () => void;
  } = $props();

  const width = $derived(
    editing
      ? Math.min(maxWidth, Math.max(70, draft.length * 7.6 + 24))
      : Math.min(maxWidth, Math.max(28, (label?.length ?? 0) * 7.6 + 20))
  );
  const transform = $derived(align === 'above-left' ? 'translateY(-50%)' : 'translate(-50%, -50%)');

  let inputEl = $state<HTMLInputElement | undefined>(undefined);

  $effect(() => {
    if (!editing) return;
    const input = inputEl;
    if (!input) return;
    requestAnimationFrame(() => {
      if (!input.isConnected) return;
      input.focus();
      input.select();
    });
  });
</script>

{#if editing}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="vz-edge-inline-editor"
    style="left: {point.x}px; top: {point.y}px; width: {width}px; transform: {transform};"
    onpointerdown={(event) => event.stopPropagation()}
  >
    <input
      bind:this={inputEl}
      type="text"
      class="vz-edge-label-input"
      value={draft}
      aria-label="Relation label"
      oninput={(event) => onDraftChange?.(event.currentTarget.value)}
      onblur={() => onCommit?.()}
      onkeydown={(event) => {
        if (event.key === 'Enter') onCommit?.();
        else if (event.key === 'Escape') onCancel?.();
      }}
    />
  </div>
{:else if label}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="vz-edge-label-group"
    class:selected
    class:frame={frameLabel}
    style="left: {point.x}px; top: {point.y}px; width: {width}px; transform: {transform};"
    role="button"
    tabindex="-1"
    onclick={(event) => onselect?.(event)}
    ondblclick={(event) => ondblclick?.(event)}
  >
    <span>{label}</span>
  </div>
{/if}
