<script lang="ts">
  import type { UmlNode, UmlNodeLayout } from '../../../shared/documents/types';
  import type { ResizeHandle } from '../../state/gesture-machine.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';

  let {
    store,
    node,
    box,
    selected = false,
    onpointerdown,
    oncontextmenu,
    ondblclick,
    onresizestart
  }: {
    store: VizionWebviewStore;
    node: UmlNode;
    box: UmlNodeLayout;
    selected?: boolean;
    onpointerdown?: (event: PointerEvent, node: UmlNode) => void;
    oncontextmenu?: (event: MouseEvent, node: UmlNode) => void;
    ondblclick?: (event: MouseEvent, node: UmlNode) => void;
    onresizestart?: (event: PointerEvent, node: UmlNode, handle: ResizeHandle) => void;
  } = $props();

  const readOnly = $derived(store.isReadOnly);
  const handles: Array<{ direction: ResizeHandle; className: string; label: string }> = [
    { direction: 'n', className: 'top', label: 'Drag to resize top side' },
    { direction: 's', className: 'bottom', label: 'Drag to resize bottom side' },
    { direction: 'w', className: 'left', label: 'Drag to resize left side' },
    { direction: 'e', className: 'right', label: 'Drag to resize right side' }
  ];
</script>

<div
  class="vz-uml-node kind-frame"
  class:selected
  class:dashed={node.line === 'dashed'}
  data-node-id={node.id}
  style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
  role="button"
  tabindex={readOnly ? -1 : 0}
  aria-label="UML frame {node.name}"
  aria-pressed={selected}
  onpointerdown={(event) => onpointerdown?.(event, node)}
  oncontextmenu={(event) => oncontextmenu?.(event, node)}
  ondblclick={(event) => ondblclick?.(event, node)}
>
  {#if !readOnly}
    {#each handles as handle (handle.direction)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="vz-frame-edge-hit {handle.className}"
        title={handle.label}
        role="presentation"
        onpointerdown={(event) => onresizestart?.(event, node, handle.direction)}
      ></div>
    {/each}
  {/if}

  {#if selected && !readOnly}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="vz-resize-handle"
      title="Drag to resize frame (snaps to 20px grid)"
      role="presentation"
      onpointerdown={(event) => onresizestart?.(event, node, 'se')}
    ></div>
  {/if}
</div>
