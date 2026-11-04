<script lang="ts">
  import type { ResizeHandle } from '../../../state/gesture-machine.svelte';

  let {
    visible = false,
    onresize
  }: {
    visible?: boolean;
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
{/if}
