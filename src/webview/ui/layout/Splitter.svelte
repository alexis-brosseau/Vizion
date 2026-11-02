<script lang="ts">
  let {
    orientation = 'vertical',
    label = 'Resize panel',
    onresize
  }: {
    orientation?: 'vertical' | 'horizontal';
    label?: string;
    onresize?: (delta: number) => void;
  } = $props();

  let dragging = $state(false);
  let lastPosition = 0;

  function handlePointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    dragging = true;
    lastPosition = orientation === 'vertical' ? event.clientX : event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!dragging) return;
    const current = orientation === 'vertical' ? event.clientX : event.clientY;
    const delta = current - lastPosition;
    if (delta === 0) return;
    lastPosition = current;
    onresize?.(delta);
  }

  function handlePointerUp(): void {
    dragging = false;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 40 : 10;
    if (orientation === 'vertical') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onresize?.(-step);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onresize?.(step);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      onresize?.(-step);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      onresize?.(step);
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="vz-ui-splitter {orientation}"
  class:dragging
  role="separator"
  aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
  aria-label={label}
  tabindex="0"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  onkeydown={handleKeyDown}
></div>

<style>
  .vz-ui-splitter {
    position: relative;
    flex: 0 0 auto;
    z-index: var(--vz-z-overlay);
    background: transparent;
  }

  .vz-ui-splitter.vertical {
    width: 5px;
    cursor: col-resize;
  }

  .vz-ui-splitter.horizontal {
    height: 5px;
    cursor: row-resize;
  }

  .vz-ui-splitter:hover,
  .vz-ui-splitter.dragging,
  .vz-ui-splitter:focus-visible {
    background: var(--vz-accent);
  }
</style>
