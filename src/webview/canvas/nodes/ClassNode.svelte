<script lang="ts">
  import type { UmlNode, UmlNodeLayout } from '../../../shared/documents/types';
  import type { ResizeHandle } from '../../state/gesture-machine.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';
  import NodeCompartment from './parts/NodeCompartment.svelte';
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
  const isEditing = $derived(Boolean(editingState));
  const readOnly = $derived(store.isReadOnly);
  const showAttributes = $derived(node.showAttributes !== false);
  const showOperations = $derived(node.showOperations !== false);
  const operationsRendered = $derived(
    isEditing || (showOperations && (node.operations ?? []).length > 0)
  );
  const attributesLast = $derived(!operationsRendered);

  function toggleCompartment(kind: 'attributes' | 'operations'): void {
    if (readOnly) return;
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      ...(kind === 'attributes'
        ? { showAttributes: node.showAttributes === false }
        : { showOperations: node.showOperations === false })
    });
  }
</script>

<div
  class="vz-uml-node kind-class"
  class:selected
  class:inline-editing={isEditing}
  data-node-id={node.id}
  style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
  role="button"
  tabindex={readOnly ? -1 : 0}
  aria-label="{node.kind}: {node.name}"
  aria-pressed={selected}
  onpointerdown={(event) => onpointerdown?.(event, node)}
  oncontextmenu={(event) => oncontextmenu?.(event, node)}
  ondblclick={(event) => ondblclick?.(event, node)}
>
  <NodeHeader
    {node}
    editing={isEditing}
    name={editingState?.name ?? ''}
    stereotype={editingState?.stereotype ?? ''}
    {readOnly}
    onDraftChange={(patch) => store.inlineEdit.updateNodeDraft(patch)}
    onCommit={() => store.inlineEdit.commitNode(node)}
  />

  <NodeCompartment
    {node}
    kind="attributes"
    visible={showAttributes}
    editing={isEditing}
    draft={editingState?.attributes ?? ''}
    {readOnly}
    last={attributesLast}
    onToggle={() => toggleCompartment('attributes')}
    onDraftChange={(value) => store.inlineEdit.updateNodeDraft({ attributes: value })}
    onCommit={() => store.inlineEdit.commitNode(node)}
  />

  <NodeCompartment
    {node}
    kind="operations"
    visible={showOperations}
    editing={isEditing}
    draft={editingState?.operations ?? ''}
    {readOnly}
    last
    onToggle={() => toggleCompartment('operations')}
    onDraftChange={(value) => store.inlineEdit.updateNodeDraft({ operations: value })}
    onCommit={() => store.inlineEdit.commitNode(node)}
  />

  <ResizeHandles
    visible={selected && !readOnly}
    onresize={(event, handle) => onresizestart?.(event, node, handle)}
  />
  <ConnectPorts
    visible={selected && !readOnly && !isEditing}
    onconnect={(event) => onconnectstart?.(event, node)}
  />
</div>
