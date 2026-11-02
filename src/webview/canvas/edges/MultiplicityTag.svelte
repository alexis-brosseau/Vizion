<script lang="ts">
  import type { Point2D } from '../../../shared/geometry';

  let {
    point,
    text,
    selected = false,
    editing = false,
    draft = '',
    onclick,
    ondblclick,
    onDraftChange,
    onCommit,
    onCancel
  }: {
    point: Point2D;
    text?: string;
    selected?: boolean;
    editing?: boolean;
    draft?: string;
    onclick?: (event: MouseEvent | KeyboardEvent) => void;
    ondblclick?: (event: MouseEvent) => void;
    onDraftChange?: (value: string) => void;
    onCommit?: () => void;
    onCancel?: () => void;
  } = $props();

  const width = $derived(Math.max(38, (draft.length || text?.length || 0) * 8 + 14));
</script>

{#if editing}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="vz-edge-inline-editor vz-mult-inline-editor"
    style="left: {point.x}px; top: {point.y}px; width: {width}px; transform: translate(-50%, -50%);"
    onpointerdown={(event) => event.stopPropagation()}
  >
    <input
      type="text"
      class="vz-edge-label-input"
      value={draft}
      aria-label="Multiplicity"
      placeholder="1, *, 0..1"
      oninput={(event) => onDraftChange?.(event.currentTarget.value)}
      onblur={() => onCommit?.()}
      onkeydown={(event) => {
        if (event.key === 'Enter') onCommit?.();
        else if (event.key === 'Escape') onCancel?.();
      }}
    />
  </div>
{:else if text}
  <div
    class="vz-mult-badge"
    class:selected
    style="left: {point.x}px; top: {point.y}px; transform: translate(-50%, -50%);"
    role="button"
    tabindex="-1"
    onclick={(event) => onclick?.(event)}
    onkeydown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onclick?.(event);
      }
    }}
    ondblclick={(event) => ondblclick?.(event)}
  >
    {text}
  </div>
{/if}
