<script lang="ts">
  import type { UmlNode, UmlNodeLayout } from '../../../shared/documents/types';
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
    onconnectstart
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
  } = $props();

  const editingState = $derived(
    store.inlineEdit.state.mode === 'node' && store.inlineEdit.state.nodeId === node.id
      ? store.inlineEdit.state
      : null
  );
  const readOnly = $derived(store.isReadOnly);
</script>

<div
  class="vz-uml-node kind-note"
  class:selected
  class:inline-editing={Boolean(editingState)}
  data-node-id={node.id}
  style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
  role="button"
  tabindex={readOnly ? -1 : 0}
  aria-label="Note: {node.name}"
  aria-pressed={selected}
  onpointerdown={(event) => onpointerdown?.(event, node)}
  oncontextmenu={(event) => oncontextmenu?.(event, node)}
  ondblclick={(event) => ondblclick?.(event, node)}
>
  <NodeHeader
    {node}
    editing={Boolean(editingState)}
    name={editingState?.name ?? ''}
    {readOnly}
    onDraftChange={(patch) => store.inlineEdit.updateNodeDraft(patch)}
    onCommit={() => store.inlineEdit.commitNode(node)}
  />

  {#if editingState}
    <div class="vz-note-body editing">
      <div class="vz-inline-sec-hdr"><span>Content</span></div>
      <textarea
        class="vz-inline-textarea vz-note-textarea"
        placeholder="Write architecture notes, constraints, or implementation guidance…"
        value={editingState.text}
        aria-label="Note content"
        oninput={(event) => store.inlineEdit.updateNodeDraft({ text: event.currentTarget.value })}
        onblur={() => store.inlineEdit.commitNode(node)}
        onkeydown={(event) => {
          if (event.key === 'Escape') store.inlineEdit.cancelAll();
        }}
      ></textarea>
    </div>
  {:else}
    <div class="vz-note-body">
      {#if node.text}
        <div class="vz-note-text">{node.text}</div>
      {:else}
        <div class="vz-note-placeholder">Double-click to add note text</div>
      {/if}
    </div>
  {/if}

  <ResizeHandles
    visible={selected && !readOnly}
    onresize={(event, handle) => onresizestart?.(event, node, handle)}
  />
  <ConnectPorts
    visible={selected && !readOnly && !editingState}
    onconnect={(event) => onconnectstart?.(event, node)}
  />
</div>
