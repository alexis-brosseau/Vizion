<script lang="ts">
  import type { ResizeHandle } from '../../../state/gesture-machine.svelte';

  let {
    selected = false,
    visible = false,
    showCorner = true,
    onresize
  }: {
    selected?: boolean;
    visible?: boolean;
    showCorner?: boolean;
    onresize?: (event: PointerEvent, handle: ResizeHandle) => void;
  } = $props();
</script>

{#if visible}
  <div
    class="vz-resize-handle"
    title="Drag to resize (snaps to 20px grid)"
    role="presentation"
    onpointerdown={(event) => onresize?.(event, 'se')}
  ></div>
  {#if selected && showCorner}
    <div
      class="vz-resize-handle vz-resize-corner"
      title="Drag to resize (snaps to 20px grid)"
      role="presentation"
      onpointerdown={(event) => onresize?.(event, 'se')}
    ></div>
  {/if}
{/if}
