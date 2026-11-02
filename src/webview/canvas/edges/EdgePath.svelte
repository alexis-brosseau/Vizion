<script lang="ts">
  let {
    pathD,
    isDashed = false,
    selected = false,
    interactive = true,
    onselect,
    ondblclick,
    oncontextmenu
  }: {
    pathD: string;
    isDashed?: boolean;
    selected?: boolean;
    interactive?: boolean;
    onselect?: (event: PointerEvent) => void;
    ondblclick?: (event: MouseEvent) => void;
    oncontextmenu?: (event: MouseEvent) => void;
  } = $props();
</script>

{#if interactive}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <path
    class="vz-edge-line"
    class:dashed={isDashed}
    class:selected
    d={pathD}
    onpointerdown={(event) => onselect?.(event)}
    ondblclick={(event) => ondblclick?.(event)}
    oncontextmenu={(event) => oncontextmenu?.(event)}
  ></path>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <path
    class="vz-edge-hit-path"
    d={pathD}
    onpointerdown={(event) => onselect?.(event)}
    ondblclick={(event) => ondblclick?.(event)}
    oncontextmenu={(event) => oncontextmenu?.(event)}
  ></path>
{:else}
  <path class="vz-edge-line" class:dashed={isDashed} d={pathD}></path>
{/if}
