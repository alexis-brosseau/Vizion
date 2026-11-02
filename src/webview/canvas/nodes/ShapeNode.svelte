<script lang="ts">
  import type { UmlNode, UmlNodeLayout } from '../../../shared/documents/types';
  import { buildShapeSvgPath } from '../../../shared/geometry';
  import type { ResizeHandle } from '../../state/gesture-machine.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';
  import NodeHeader from './parts/NodeHeader.svelte';
  import ResizeHandles from './parts/ResizeHandles.svelte';
  import ConnectPorts from './parts/ConnectPorts.svelte';

  let {
    store,
    node,
    box,
    selected = false,
    onpointerdown,
    oncontextmenu,
    ondblclick,
    onresizestart,
    onconnectstart,
    oneditlabel
  }: {
    store: VizionWebviewStore;
    node: UmlNode;
    box: UmlNodeLayout;
    selected?: boolean;
    onpointerdown?: (event: PointerEvent, node: UmlNode) => void;
    oncontextmenu?: (event: MouseEvent, node: UmlNode) => void;
    ondblclick?: (event: MouseEvent, node: UmlNode) => void;
    onresizestart?: (event: PointerEvent, node: UmlNode, handle: ResizeHandle) => void;
    onconnectstart?: (event: PointerEvent, node: UmlNode) => void;
    oneditlabel?: (node: UmlNode) => void;
  } = $props();

  const editingState = $derived(
    store.inlineEdit.state.mode === 'node' && store.inlineEdit.state.nodeId === node.id
      ? store.inlineEdit.state
      : null
  );
  const readOnly = $derived(store.isReadOnly);
  const isEditing = $derived(Boolean(editingState));
  const shapePath = $derived(buildShapeSvgPath(node.shape, box.width, box.height));

  let inputEl = $state<HTMLInputElement | undefined>(undefined);

  $effect(() => {
    if (!isEditing) return;
    const input = inputEl;
    if (!input) return;
    requestAnimationFrame(() => {
      if (!input.isConnected) return;
      input.focus();
      input.select();
    });
  });
</script>

<div
  class="vz-uml-node kind-shape"
  class:selected
  class:inline-editing={isEditing}
  data-node-id={node.id}
  style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
  role="button"
  tabindex={readOnly ? -1 : 0}
  aria-label="Shape: {node.name}"
  aria-pressed={selected}
  onpointerdown={(event) => onpointerdown?.(event, node)}
  oncontextmenu={(event) => oncontextmenu?.(event, node)}
  ondblclick={(event) => ondblclick?.(event, node)}
>
  <svg class="vz-shape-svg" width={box.width} height={box.height} aria-hidden="true">
    <path d={shapePath} class="vz-shape-outline"></path>
    {#if selected}
      <rect
        class="vz-shape-selection-box"
        x="1"
        y="1"
        width={Math.max(0, box.width - 2)}
        height={Math.max(0, box.height - 2)}
        rx="4"
      ></rect>
    {/if}
  </svg>

  {#if editingState}
    <div class="vz-shape-label editing">
      <input
        bind:this={inputEl}
        type="text"
        class="vz-shape-inline-input"
        value={editingState.name}
        aria-label="Shape label"
        oninput={(event) => store.inlineEdit.updateNodeDraft({ name: event.currentTarget.value })}
        onblur={() => store.inlineEdit.commitNode(node)}
        onkeydown={(event) => {
          if (event.key === 'Enter') store.inlineEdit.commitNode(node);
          else if (event.key === 'Escape') store.inlineEdit.cancelAll();
        }}
      />
    </div>
  {:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="vz-shape-label"
      class:selected
      role="presentation"
      onclick={(event) => {
        if (!selected || readOnly) return;
        event.stopPropagation();
        oneditlabel?.(node);
      }}
    >
      <NodeHeader {node} />
    </div>
  {/if}

  <ResizeHandles
    {selected}
    visible={selected && !readOnly}
    onresize={(event, handle) => onresizestart?.(event, node, handle)}
  />
  <ConnectPorts
    visible={selected && !readOnly && !editingState}
    onconnect={(event) => onconnectstart?.(event, node)}
  />
</div>
