<script lang="ts">
  import type {
    UmlAttribute,
    UmlEdge,
    UmlNode,
    UmlOperation,
    UmlParameter,
    UmlShapeGeometry
  } from '../../shared/documents/types';
  import {
    buildOperationSignature,
    extractOperationParameters
  } from '../../shared/operations';
  import {
    getUmlNodeKind,
    listEndpointShapes,
    listUmlRelationPresets,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import AccessibleOutline from '../common/AccessibleOutline.svelte';
  import VisibilityPicker from '../common/VisibilityPicker.svelte';
  import type { VizionWebviewStore } from '../state.svelte';

  let {
    store,
    onDeleteSelected,
    onDuplicateSelected
  }: {
    store: VizionWebviewStore;
    onDeleteSelected: () => void;
    onDuplicateSelected: () => void;
  } = $props();

  let resizingSidebar = $state<{ startX: number; initialWidth: number } | null>(null);

  function handleSidebarResizeStart(e: PointerEvent): void {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
    resizingSidebar = {
      startX: e.clientX,
      initialWidth: store.sidebarWidth
    };
  }

  function handleWindowPointerMove(e: PointerEvent): void {
    if (!resizingSidebar) return;
    const dx = resizingSidebar.startX - e.clientX;
    store.setSidebarWidth(resizingSidebar.initialWidth + dx);
  }

  function handleWindowPointerUp(): void {
    if (resizingSidebar) {
      resizingSidebar = null;
    }
  }

  const selectedNode = $derived<UmlNode | undefined>(
    store.umlDoc?.nodes.find((n) => store.selectedIds.includes(n.id))
  );

  const selectedEdge = $derived<UmlEdge | undefined>(
    store.umlDoc?.edges.find((e) => store.selectedIds.includes(e.id))
  );

  const relationPresets = listUmlRelationPresets();
  const endpointShapes = listEndpointShapes();

  function addAttribute(node: UmlNode): void {
    const existing = node.attributes ?? [];
    const nextAttr: UmlAttribute = {
      id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
      visibility: '+',
      name: `field${existing.length + 1}`,
      type: 'string'
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      attributes: [...existing, nextAttr]
    });
  }

  function updateAttribute(node: UmlNode, index: number, partial: Partial<UmlAttribute>): void {
    const existing = [...(node.attributes ?? [])];
    existing[index] = { ...existing[index], ...partial };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      attributes: existing
    });
  }

  function removeAttribute(node: UmlNode, index: number): void {
    const existing = (node.attributes ?? []).filter((_, idx) => idx !== index);
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      attributes: existing
    });
  }

  function addOperation(node: UmlNode): void {
    const existing = node.operations ?? [];
    const nextOp: UmlOperation = {
      id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
      visibility: '+',
      name: `method${existing.length + 1}`,
      signature: '()',
      returnType: 'void',
      parameters: []
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: [...existing, nextOp]
    });
  }

  function updateOperation(node: UmlNode, index: number, partial: Partial<UmlOperation>): void {
    const existing = [...(node.operations ?? [])];
    existing[index] = { ...existing[index], ...partial };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: existing
    });
  }

  function removeOperation(node: UmlNode, index: number): void {
    const existing = (node.operations ?? []).filter((_, idx) => idx !== index);
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: existing
    });
  }

  function addOperationArgument(node: UmlNode, opIndex: number): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIndex];
    if (!targetOp) return;
    const currentArgs = extractOperationParameters(targetOp);
    const nextArg: UmlParameter = {
      id: `${targetOp.id}-arg-${Date.now().toString(36).slice(-4)}`,
      name: `arg${currentArgs.length + 1}`,
      type: 'string'
    };
    const nextArgs = [...currentArgs, nextArg];
    ops[opIndex] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }

  function updateOperationArgument(
    node: UmlNode,
    opIndex: number,
    argIndex: number,
    partial: Partial<UmlParameter>
  ): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIndex];
    if (!targetOp) return;
    const nextArgs = [...extractOperationParameters(targetOp)];
    if (!nextArgs[argIndex]) return;
    nextArgs[argIndex] = { ...nextArgs[argIndex], ...partial };
    ops[opIndex] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }

  function removeOperationArgument(node: UmlNode, opIndex: number, argIndex: number): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIndex];
    if (!targetOp) return;
    const nextArgs = extractOperationParameters(targetOp).filter((_, i) => i !== argIndex);
    ops[opIndex] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }
</script>

{#snippet eyeIcon(visible: boolean)}
  {#if visible}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  {:else}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  {/if}
{/snippet}

<svelte:window
  onpointermove={handleWindowPointerMove}
  onpointerup={handleWindowPointerUp}
/>

{#if store.umlDoc}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="vz-sidebar-resizer"
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize Sidebar Width"
    tabindex="0"
    onpointerdown={handleSidebarResizeStart}
  ></div>

  <aside
    class="vz-sidebar vz-inspector"
    style="width: {store.sidebarWidth}px;"
    aria-label="UML Property Inspector"
  >
    <AccessibleOutline
      {store}
      {onDeleteSelected}
      {onDuplicateSelected}
    />
    <div class="vz-inspector-pane">
      {#if selectedNode}
        {@const nodeDesc = getUmlNodeKind(selectedNode.kind)}
        {@const attrsVisible = selectedNode.showAttributes !== false}
        {@const opsVisible = selectedNode.showOperations !== false}
        <div class="vz-sidebar-header">
          <span class="vz-sidebar-title">
            {nodeDesc?.label ?? selectedNode.kind}: {selectedNode.name}
          </span>
        </div>

        <div class="vz-inspector-body">
          {#if !nodeDesc}
            <div class="vz-warning-box">
              Unsupported node kind <code>{selectedNode.kind}</code>. Shown in non-destructive read-only fallback mode.
            </div>
          {:else}
            <label class="vz-field">
              <span class="vz-field-label">{selectedNode.kind === 'shape' ? 'Label (Name)' : 'Name'}</span>
              <input
                type="text"
                class="vz-input"
                value={selectedNode.name}
                disabled={store.isReadOnly}
                onchange={(e) =>
                  store.dispatchOperation({
                    type: 'uml.updateNode',
                    nodeId: selectedNode.id,
                    name: e.currentTarget.value
                  })}
              />
            </label>

            {#if selectedNode.kind === 'note'}
              <label class="vz-field">
                <span class="vz-field-label">Note Content</span>
                <textarea
                  class="vz-textarea"
                  rows="4"
                  value={selectedNode.text ?? ''}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateNode',
                      nodeId: selectedNode.id,
                      text: e.currentTarget.value
                    })}
                ></textarea>
              </label>
            {:else if selectedNode.kind === 'shape'}
              <label class="vz-field">
                <span class="vz-field-label">Shape Geometry</span>
                <select
                  class="vz-select"
                  aria-label="Shape geometry"
                  value={selectedNode.shape ?? 'rectangle'}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateNode',
                      nodeId: selectedNode.id,
                      shape: e.currentTarget.value as UmlShapeGeometry
                    })}
                >
                  {#each UML_SHAPE_GEOMETRIES as sh (sh.kind)}
                    <option value={sh.kind}>{sh.label}</option>
                  {/each}
                </select>
              </label>

              <label class="vz-field">
                <span class="vz-field-label">Stereotype (optional)</span>
                <input
                  type="text"
                  class="vz-input"
                  placeholder="e.g. process, decision, actor"
                  value={selectedNode.stereotype ?? ''}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateNode',
                      nodeId: selectedNode.id,
                      stereotype: e.currentTarget.value
                    })}
                />
              </label>
            {:else}
              <label class="vz-field">
                <span class="vz-field-label">Stereotype (optional)</span>
                <input
                  type="text"
                  class="vz-input"
                  placeholder="e.g. entity, service, aggregate"
                  value={selectedNode.stereotype ?? ''}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateNode',
                      nodeId: selectedNode.id,
                      stereotype: e.currentTarget.value
                    })}
                />
              </label>

              <!-- Attributes Compartment -->
              <div class="vz-compartment-section" class:section-hidden={!attrsVisible}>
                <div class="vz-compartment-header">
                  <span>Attributes ({(selectedNode.attributes ?? []).length})</span>
                  <button
                    type="button"
                    class="vz-eye-toggle-btn"
                    class:off={!attrsVisible}
                    title={attrsVisible ? 'Hide Attributes section on node' : 'Show Attributes section on node'}
                    aria-label={attrsVisible ? 'Hide Attributes section' : 'Show Attributes section'}
                    disabled={store.isReadOnly}
                    onclick={() =>
                      store.dispatchOperation({
                        type: 'uml.updateNode',
                        nodeId: selectedNode.id,
                        showAttributes: !attrsVisible
                      })}
                  >
                    {@render eyeIcon(attrsVisible)}
                  </button>
                </div>

                {#if attrsVisible}
                  {#each selectedNode.attributes ?? [] as attr, idx (attr.id)}
                    <div class="vz-member-row">
                      <VisibilityPicker
                        value={attr.visibility ?? '+'}
                        disabled={store.isReadOnly}
                        ariaLabel="Attribute visibility"
                        onSelect={(nextVis) =>
                          updateAttribute(selectedNode, idx, { visibility: nextVis })}
                      />
                      <input
                        type="text"
                        class="vz-input-mini"
                        aria-label="Attribute name"
                        value={attr.name}
                        disabled={store.isReadOnly}
                        onchange={(e) =>
                          updateAttribute(selectedNode, idx, { name: e.currentTarget.value })}
                      />
                      <input
                        type="text"
                        class="vz-input-mini"
                        aria-label="Attribute type"
                        placeholder="type"
                        value={attr.type ?? ''}
                        disabled={store.isReadOnly}
                        onchange={(e) =>
                          updateAttribute(selectedNode, idx, { type: e.currentTarget.value })}
                      />
                      <button
                        type="button"
                        class="vz-icon-btn vz-danger-btn vz-square-del-btn"
                        aria-label="Remove attribute"
                        disabled={store.isReadOnly}
                        onclick={() => removeAttribute(selectedNode, idx)}
                      >
                        ×
                      </button>
                    </div>
                  {/each}
                  <button
                    type="button"
                    class="vz-inline-add-btn"
                    disabled={store.isReadOnly}
                    onclick={() => addAttribute(selectedNode)}
                  >
                    ＋ Attribute
                  </button>
                {/if}
              </div>

              <!-- Operations Compartment -->
              <div class="vz-compartment-section" class:section-hidden={!opsVisible}>
                <div class="vz-compartment-header">
                  <span>Operations ({(selectedNode.operations ?? []).length})</span>
                  <button
                    type="button"
                    class="vz-eye-toggle-btn"
                    class:off={!opsVisible}
                    title={opsVisible ? 'Hide Operations section on node' : 'Show Operations section on node'}
                    aria-label={opsVisible ? 'Hide Operations section' : 'Show Operations section'}
                    disabled={store.isReadOnly}
                    onclick={() =>
                      store.dispatchOperation({
                        type: 'uml.updateNode',
                        nodeId: selectedNode.id,
                        showOperations: !opsVisible
                      })}
                  >
                    {@render eyeIcon(opsVisible)}
                  </button>
                </div>

                {#if opsVisible}
                  {#each selectedNode.operations ?? [] as op, idx (op.id)}
                    {@const opArgs = extractOperationParameters(op)}
                    <div class="vz-operation-card">
                      <div class="vz-member-row">
                        <VisibilityPicker
                          value={op.visibility ?? '+'}
                          disabled={store.isReadOnly}
                          ariaLabel="Operation visibility"
                          onSelect={(nextVis) =>
                            updateOperation(selectedNode, idx, { visibility: nextVis })}
                        />
                        <input
                          type="text"
                          class="vz-input-mini"
                          aria-label="Operation name"
                          value={op.name}
                          disabled={store.isReadOnly}
                          onchange={(e) =>
                            updateOperation(selectedNode, idx, { name: e.currentTarget.value })}
                        />
                        <input
                          type="text"
                          class="vz-input-mini"
                          aria-label="Return type"
                          placeholder="return"
                          value={op.returnType ?? ''}
                          disabled={store.isReadOnly}
                          onchange={(e) =>
                            updateOperation(selectedNode, idx, { returnType: e.currentTarget.value })}
                        />
                        <button
                          type="button"
                          class="vz-icon-btn vz-danger-btn vz-square-del-btn"
                          aria-label="Remove operation"
                          disabled={store.isReadOnly}
                          onclick={() => removeOperation(selectedNode, idx)}
                        >
                          ×
                        </button>
                      </div>

                      <!-- Operation Arguments Subsection -->
                      <div class="vz-op-params-section">
                        <div class="vz-op-params-title">Arguments ({opArgs.length})</div>
                        {#each opArgs as argItem, aIdx (argItem.id)}
                          <div class="vz-param-row">
                            <input
                              type="text"
                              class="vz-input-mini"
                              aria-label="Argument name"
                              placeholder="argName"
                              value={argItem.name}
                              disabled={store.isReadOnly}
                              onchange={(e) =>
                                updateOperationArgument(selectedNode, idx, aIdx, {
                                  name: e.currentTarget.value
                                })}
                            />
                            <input
                              type="text"
                              class="vz-input-mini"
                              aria-label="Argument type"
                              placeholder="argType"
                              value={argItem.type ?? ''}
                              disabled={store.isReadOnly}
                              onchange={(e) =>
                                updateOperationArgument(selectedNode, idx, aIdx, {
                                  type: e.currentTarget.value
                                })}
                            />
                            <button
                              type="button"
                              class="vz-icon-btn vz-danger-btn vz-square-del-btn"
                              aria-label="Remove argument"
                              disabled={store.isReadOnly}
                              onclick={() => removeOperationArgument(selectedNode, idx, aIdx)}
                            >
                              ×
                            </button>
                          </div>
                        {/each}
                        <button
                          type="button"
                          class="vz-inline-add-btn vz-param-add-btn"
                          disabled={store.isReadOnly}
                          onclick={() => addOperationArgument(selectedNode, idx)}
                        >
                          ＋ Argument
                        </button>
                      </div>
                    </div>
                  {/each}
                  <button
                    type="button"
                    class="vz-inline-add-btn"
                    disabled={store.isReadOnly}
                    onclick={() => addOperation(selectedNode)}
                  >
                    ＋ Operation
                  </button>
                {/if}
              </div>
            {/if}
          {/if}
        </div>
      {:else if selectedEdge}
        <div class="vz-sidebar-header">
          <span class="vz-sidebar-title">Relation: {selectedEdge.id}</span>
        </div>

        <div class="vz-inspector-body">
          <label class="vz-field">
            <span class="vz-field-label">Semantic Relation Kind</span>
            <select
              class="vz-select"
              aria-label="Relation kind"
              value={selectedEdge.kind}
              disabled={store.isReadOnly}
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: selectedEdge.id,
                  kind: e.currentTarget.value as typeof selectedEdge.kind
                })}
            >
              {#each relationPresets as preset}
                <option value={preset.kind}>{preset.label}</option>
              {/each}
            </select>
          </label>

          <label class="vz-field">
            <span class="vz-field-label">Label</span>
            <input
              type="text"
              class="vz-input"
              placeholder="e.g. belongs to, uses"
              value={selectedEdge.label ?? ''}
              disabled={store.isReadOnly}
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: selectedEdge.id,
                  label: e.currentTarget.value
                })}
            />
          </label>

          <button
            type="button"
            class="vz-btn"
            disabled={store.isReadOnly}
            title={`Switch Direction (${selectedEdge.target.nodeId} → ${selectedEdge.source.nodeId})`}
            onclick={() =>
              store.dispatchOperation({
                type: 'uml.updateEdge',
                edgeId: selectedEdge.id,
                reverseDirection: true
              })}
          >
            ⇄ Switch Direction
          </button>

          <div class="vz-field-grid">
            <label class="vz-field">
              <span class="vz-field-label">Line Style</span>
              <select
                class="vz-select"
                value={selectedEdge.visual?.line ?? 'solid'}
                disabled={store.isReadOnly}
                onchange={(e) =>
                  store.dispatchOperation({
                    type: 'uml.updateEdge',
                    edgeId: selectedEdge.id,
                    line: e.currentTarget.value as 'solid' | 'dashed'
                  })}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </label>

            <label class="vz-field">
              <span class="vz-field-label">Routing</span>
              <select
                class="vz-select"
                value={selectedEdge.visual?.routing ?? 'bezier'}
                disabled={store.isReadOnly}
                onchange={(e) =>
                  store.dispatchOperation({
                    type: 'uml.updateEdge',
                    edgeId: selectedEdge.id,
                    routing: e.currentTarget.value as 'straight' | 'bezier'
                  })}
              >
                <option value="bezier">Smooth Bézier</option>
                <option value="straight">Straight</option>
              </select>
            </label>
          </div>

          <!-- Independent Start & End Endpoint Customization + Multiplicities -->
          {#each ['start', 'end'] as const as endKey}
            {@const currentDec = selectedEdge.visual?.[endKey] ?? {
              shape: 'none'
            }}
            {@const shapeObj = endpointShapes.find((s) => s.kind === currentDec.shape)}
            {@const currentMult =
              endKey === 'start'
                ? (selectedEdge.source.multiplicity ?? '')
                : (selectedEdge.target.multiplicity ?? '')}
            <div class="vz-endpoint-box">
              <div class="vz-compartment-header">
                <span>
                  {endKey === 'start'
                    ? `Start Side (${selectedEdge.source.nodeId})`
                    : `End Side (${selectedEdge.target.nodeId})`}
                </span>
              </div>

              <label class="vz-field">
                <span class="vz-field-label">Multiplicity (optional)</span>
                <input
                  type="text"
                  class="vz-input"
                  placeholder="e.g. 1, *, 1..5, 2..*"
                  value={currentMult}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateEdge',
                      edgeId: selectedEdge.id,
                      ...(endKey === 'start'
                        ? { sourceMultiplicity: e.currentTarget.value.trim() }
                        : { targetMultiplicity: e.currentTarget.value.trim() })
                    })}
                />
              </label>

              <div class="vz-field-grid">
                <label class="vz-field">
                  <span class="vz-field-label">Shape</span>
                  <select
                    class="vz-select"
                    aria-label="{endKey} endpoint shape"
                    value={currentDec.shape}
                    disabled={store.isReadOnly}
                    onchange={(e) =>
                      store.dispatchOperation({
                        type: 'uml.updateEndpoint',
                        edgeId: selectedEdge.id,
                        end: endKey,
                        decoration: {
                          ...currentDec,
                          shape: e.currentTarget.value
                        }
                      })}
                  >
                    {#each endpointShapes as sh}
                      <option value={sh.kind}>{sh.label}</option>
                    {/each}
                  </select>
                </label>

                {#if shapeObj?.supportsFill}
                  <label class="vz-field">
                    <span class="vz-field-label">Fill</span>
                    <select
                      class="vz-select"
                      aria-label="{endKey} endpoint fill"
                      value={currentDec.fill ?? shapeObj.defaultFill ?? 'hollow'}
                      disabled={store.isReadOnly}
                      onchange={(e) =>
                        store.dispatchOperation({
                          type: 'uml.updateEndpoint',
                          edgeId: selectedEdge.id,
                          end: endKey,
                          decoration: {
                            ...currentDec,
                            fill: e.currentTarget.value as 'hollow' | 'filled'
                          }
                        })}
                    >
                      <option value="hollow">Hollow</option>
                      <option value="filled">Filled</option>
                    </select>
                  </label>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Document Metadata & AI Guidance Overview -->
        <div class="vz-sidebar-header">
          <span class="vz-sidebar-title">UML Document</span>
        </div>

        <div class="vz-inspector-body">
          <label class="vz-field">
            <span class="vz-field-label">Diagram Title</span>
            <input
              type="text"
              class="vz-input"
              value={store.umlDoc.title}
              disabled={store.isReadOnly}
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateMetadata',
                  title: e.currentTarget.value
                })}
            />
          </label>

          <label class="vz-field">
            <span class="vz-field-label">Purpose</span>
            <textarea
              class="vz-textarea"
              rows="4"
              value={store.umlDoc.ai.purpose}
              disabled={store.isReadOnly}
              placeholder="Describe the purpose of this architecture model…"
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateMetadata',
                  purpose: e.currentTarget.value
                })}
            ></textarea>
          </label>
        </div>
      {/if}
    </div>
  </aside>
{/if}
