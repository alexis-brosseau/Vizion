<script lang="ts">
  let {
    visible = false,
    onconnect
  }: {
    visible?: boolean;
    onconnect?: (event: PointerEvent) => void;
  } = $props();
</script>

{#if visible}
  <div
    class="vz-connect-port"
    title="Drag to another node to connect relation"
    role="presentation"
    onpointerdown={(event) => onconnect?.(event)}
  ></div>
{/if}
