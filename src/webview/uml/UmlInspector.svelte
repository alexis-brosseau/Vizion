<script lang="ts">
  import type {
    UmlAttribute,
    UmlEdge,
    UmlEdgeRouting,
    UmlNode,
    UmlOperation,
    UmlRoutingKind,
    UmlShapeGeometry
  } from '../../shared/documents/types';
  import {
    formatAttributesToText,
    formatOperationsToText,
    parseAttributesFromText,
    parseOperationsFromText
  } from '../../shared/operations';
  import {
    getUmlNodeKind,
    listEndpointShapes,
    listUmlRelationPresets,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import { isMigrationNeeded, isNewerVersionDocument } from '../../shared/documents/migrations';
  import { EXTENSION_VERSION } from '../../shared/documents/version';
  import AccessibleOutline from '../common/AccessibleOutline.svelte';
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

  const selectedEdgeTouchesNote = $derived.by(() => {
    if (!selectedEdge || !store.umlDoc) return false;
    const s = store.umlDoc.nodes.find((n) => n.id === selectedEdge.source.nodeId);
    const t = store.umlDoc.nodes.find((n) => n.id === selectedEdge.target.nodeId);
    return s?.kind === 'note' || t?.kind === 'note';
  });

  const relationPresets = listUmlRelationPresets();
  const endpointShapes = listEndpointShapes();

  let inspectorAttributesDraft = $state('');
  let inspectorOperationsDraft = $state('');

  $effect(() => {
    if (selectedNode) {
      const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
      const isEditingAttrs = activeEl?.getAttribute('data-field') === 'inspector-attributes';
      const isEditingOps = activeEl?.getAttribute('data-field') === 'inspector-operations';

      if (!isEditingAttrs) {
        inspectorAttributesDraft = formatAttributesToText(selectedNode.attributes ?? []);
      }
      if (!isEditingOps) {
        inspectorOperationsDraft = formatOperationsToText(selectedNode.operations ?? []);
      }
    } else {
      inspectorAttributesDraft = '';
      inspectorOperationsDraft = '';
    }
  });

  function flushInspectorAttributes(): void {
    if (!selectedNode || selectedNode.kind === 'note' || selectedNode.kind === 'shape' || selectedNode.kind === 'frame') return;
    const nextAttrs = parseAttributesFromText(
      inspectorAttributesDraft,
      selectedNode.id,
      selectedNode.attributes ?? []
    );
    const currAttrs = selectedNode.attributes ?? [];
    const attrsChanged =
      nextAttrs.length !== currAttrs.length ||
      nextAttrs.some((a, i) => {
        const c = currAttrs[i];
        return (
          !c ||
          a.name !== c.name ||
          (a.type ?? '') !== (c.type ?? '') ||
          (a.visibility ?? '+') !== (c.visibility ?? '+')
        );
      });
    if (attrsChanged) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: selectedNode.id,
        attributes: nextAttrs
      });
    }
    inspectorAttributesDraft = formatAttributesToText(nextAttrs);
  }

  function flushInspectorOperations(): void {
    if (!selectedNode || selectedNode.kind === 'note' || selectedNode.kind === 'shape' || selectedNode.kind === 'frame') return;
    const nextOps = parseOperationsFromText(
      inspectorOperationsDraft,
      selectedNode.id,
      selectedNode.operations ?? []
    );
    const currOps = selectedNode.operations ?? [];
    const opsChanged =
      nextOps.length !== currOps.length ||
      nextOps.some((o, i) => {
        const c = currOps[i];
        return (
          !c ||
          o.name !== c.name ||
          (o.signature ?? '()') !== (c.signature ?? '()') ||
          (o.returnType ?? '') !== (c.returnType ?? '') ||
          (o.visibility ?? '+') !== (c.visibility ?? '+')
        );
      });
    if (opsChanged) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: selectedNode.id,
        operations: nextOps
      });
    }
    inspectorOperationsDraft = formatOperationsToText(nextOps);
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
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="vz-inspector-pane"
      oncontextmenu={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }}
    >
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
              <span class="vz-field-label">Name</span>
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
              <div class="vz-inspector-section">
                <div class="vz-section-divider"></div>
                <div class="vz-section-header">
                  <span class="vz-field-label">Content</span>
                </div>
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
              </div>
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
            {:else if selectedNode.kind === 'frame'}
              <label class="vz-field">
                <span class="vz-field-label">Border Style</span>
                <select
                  class="vz-select"
                  aria-label="Frame border style"
                  value={selectedNode.line ?? 'solid'}
                  disabled={store.isReadOnly}
                  onchange={(e) =>
                    store.dispatchOperation({
                      type: 'uml.updateNode',
                      nodeId: selectedNode.id,
                      line: e.currentTarget.value as 'solid' | 'dashed'
                    })}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
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

              <!-- Attributes Section -->
              <div class="vz-inspector-section">
                <div class="vz-section-divider"></div>
                <div class="vz-section-header">
                  <span class="vz-field-label">Attributes</span>
                  <button
                    type="button"
                    class="vz-eye-toggle-btn compact"
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
                  <textarea
                    class="vz-textarea vz-inspector-members-textarea"
                    data-field="inspector-attributes"
                    aria-label="Attributes"
                    placeholder="+ name: type&#10;- secret: number"
                    rows={Math.max(4, (inspectorAttributesDraft.split('\n').length || 1))}
                    bind:value={inspectorAttributesDraft}
                    disabled={store.isReadOnly}
                    onblur={flushInspectorAttributes}
                    onchange={flushInspectorAttributes}
                  ></textarea>
                {/if}
              </div>

              <!-- Operations Section -->
              <div class="vz-inspector-section">
                <div class="vz-section-divider"></div>
                <div class="vz-section-header">
                  <span class="vz-field-label">Operations</span>
                  <button
                    type="button"
                    class="vz-eye-toggle-btn compact"
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
                  <textarea
                    class="vz-textarea vz-inspector-members-textarea"
                    data-field="inspector-operations"
                    aria-label="Operations"
                    placeholder="+ method(a: string): void&#10;- helper(): boolean"
                    rows={Math.max(4, (inspectorOperationsDraft.split('\n').length || 1))}
                    bind:value={inspectorOperationsDraft}
                    disabled={store.isReadOnly}
                    onblur={flushInspectorOperations}
                    onchange={flushInspectorOperations}
                  ></textarea>
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
            <span class="vz-field-label">Semantic Relation</span>
            <select
              class="vz-select"
              aria-label="Relation kind"
              value={selectedEdge.kind}
              disabled={store.isReadOnly}
              onchange={(e) => {
                if (!selectedEdge) return;
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: selectedEdge.id,
                  kind: e.currentTarget.value as typeof selectedEdge.kind
                });
              }}
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
              onchange={(e) => {
                if (!selectedEdge) return;
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: selectedEdge.id,
                  label: e.currentTarget.value
                });
              }}
            />
          </label>

          <button
            type="button"
            class="vz-btn"
            disabled={store.isReadOnly}
            title={`Switch Direction (${selectedEdge.target.nodeId} → ${selectedEdge.source.nodeId})`}
            onclick={() => {
              if (!selectedEdge) return;
              store.dispatchOperation({
                type: 'uml.updateEdge',
                edgeId: selectedEdge.id,
                reverseDirection: true
              });
            }}
          >
            ⇄ Switch Direction
          </button>

          <div class="vz-field-grid">
            <label class="vz-field">
              <span class="vz-field-label">Line Style</span>
              <select
                class="vz-select"
                value={selectedEdge.visual?.line ?? (selectedEdgeTouchesNote ? 'dashed' : 'solid')}
                disabled={store.isReadOnly}
                onchange={(e) => {
                  if (!selectedEdge) return;
                  store.dispatchOperation({
                    type: 'uml.updateEdge',
                    edgeId: selectedEdge.id,
                    line: e.currentTarget.value as 'solid' | 'dashed'
                  });
                }}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </label>

            <label class="vz-field">
              <span class="vz-field-label">Routing</span>
              <select
                class="vz-select"
                value={selectedEdge.visual?.routing ?? 'default'}
                disabled={store.isReadOnly}
                onchange={(e) => {
                  if (!selectedEdge) return;
                  store.dispatchOperation({
                    type: 'uml.updateEdge',
                    edgeId: selectedEdge.id,
                    routing: e.currentTarget.value as UmlEdgeRouting
                  });
                }}
              >
                <option value="default">Default</option>
                <option value="orthogonal">Orthogonal</option>
                <option value="straight">Straight</option>
                <option value="bezier">Smooth</option>
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
            <div class="vz-inspector-section">
              <div class="vz-section-divider"></div>
              <div class="vz-section-header">
                <span class="vz-field-label">
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
                  onchange={(e) => {
                    if (!selectedEdge) return;
                    store.dispatchOperation({
                      type: 'uml.updateEdge',
                      edgeId: selectedEdge.id,
                      ...(endKey === 'start'
                        ? { sourceMultiplicity: e.currentTarget.value.trim() }
                        : { targetMultiplicity: e.currentTarget.value.trim() })
                    });
                  }}
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
                    onchange={(e) => {
                      if (!selectedEdge) return;
                      store.dispatchOperation({
                        type: 'uml.updateEndpoint',
                        edgeId: selectedEdge.id,
                        end: endKey,
                        decoration: {
                          ...currentDec,
                          shape: e.currentTarget.value
                        }
                      });
                    }}
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
                      onchange={(e) => {
                        if (!selectedEdge) return;
                        store.dispatchOperation({
                          type: 'uml.updateEndpoint',
                          edgeId: selectedEdge.id,
                          end: endKey,
                          decoration: {
                            ...currentDec,
                            fill: e.currentTarget.value as 'hollow' | 'filled'
                          }
                        });
                      }}
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
          {#if isNewerVersionDocument(store.umlDoc)}
            <div class="vz-migration-banner vz-compatibility-banner">
              <div class="vz-migration-header">
                <span class="vz-migration-title">Compatibility Warning</span>
              </div>
              <p class="vz-migration-text">
                This document was created with a newer version of Vizion ({store.umlDoc.version ?? 'future'}). Please update the extension to ensure full compatibility.
              </p>
              <button
                type="button"
                class="vz-btn vz-btn-primary vz-migration-btn"
                onclick={() => store.checkForExtensionUpdate()}
              >
                Update
              </button>
            </div>
          {:else if isMigrationNeeded(store.umlDoc)}
            <div class="vz-migration-banner">
              <div class="vz-migration-header">
                <span class="vz-migration-title">Update Available</span>
              </div>
              <p class="vz-migration-text">
                Document version ({store.umlDoc.version ?? 'legacy'}) does not match the latest rules ({EXTENSION_VERSION}).
              </p>
              <button
                type="button"
                class="vz-btn vz-btn-primary vz-migration-btn"
                disabled={store.isReadOnly}
                onclick={() => store.dispatchOperation({ type: 'uml.migrateDocument' })}
              >
                Migrate Document
              </button>
            </div>
          {/if}

          <label class="vz-field">
            <span class="vz-field-label">Title</span>
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
            <span class="vz-field-label">Description</span>
            <textarea
              class="vz-textarea"
              rows="4"
              value={store.umlDoc.description ?? store.umlDoc.ai?.purpose ?? ''}
              disabled={store.isReadOnly}
              placeholder="Describe the purpose of this architecture model…"
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateMetadata',
                  description: e.currentTarget.value
                })}
            ></textarea>
          </label>

          <label class="vz-field">
            <span class="vz-field-label">Default Routing</span>
            <select
              class="vz-select"
              aria-label="Default Routing"
              value={store.umlDoc.defaultRouting ?? 'orthogonal'}
              disabled={store.isReadOnly}
              onchange={(e) =>
                store.dispatchOperation({
                  type: 'uml.updateMetadata',
                  defaultRouting: e.currentTarget.value as UmlRoutingKind
                })}
            >
              <option value="orthogonal">Orthogonal</option>
              <option value="straight">Straight</option>
              <option value="bezier">Smooth</option>
            </select>
          </label>
        </div>
      {/if}
    </div>
  </aside>
{/if}
