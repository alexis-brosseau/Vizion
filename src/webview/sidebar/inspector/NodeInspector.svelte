<script lang="ts">
  import type { UmlNode } from '../../../shared/documents/types';
  import {
    formatAttributesToText,
    formatOperationsToText,
    parseAttributesFromText,
    parseOperationsFromText
  } from '../../../shared/operations';
  import {
    getUmlNodeKind,
    UML_SHAPE_GEOMETRIES
  } from '../../../shared/registry/uml-registry';
  import Select from '../../ui/input/Select.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';

  let { store, selectedNode }: { store: VizionWebviewStore; selectedNode: UmlNode } = $props();

  const nodeDesc = $derived(getUmlNodeKind(selectedNode.kind));
  const shapeOptions = UML_SHAPE_GEOMETRIES.map((shape) => ({
    value: shape.kind,
    label: shape.label
  }));
  const frameBorderOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' }
  ];
  const attrsVisible = $derived(selectedNode.showAttributes !== false);
  const opsVisible = $derived(selectedNode.showOperations !== false);

  let inspectorAttributesDraft = $state('');
  let inspectorOperationsDraft = $state('');

  $effect(() => {
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
    const isEditingAttrs = activeEl?.getAttribute('data-field') === 'inspector-attributes';
    const isEditingOps = activeEl?.getAttribute('data-field') === 'inspector-operations';
    if (!isEditingAttrs) inspectorAttributesDraft = formatAttributesToText(selectedNode.attributes ?? []);
    if (!isEditingOps) inspectorOperationsDraft = formatOperationsToText(selectedNode.operations ?? []);
  });

  function flushInspectorAttributes(): void {
    if (selectedNode.kind === 'note' || selectedNode.kind === 'shape' || selectedNode.kind === 'frame') return;
    const nextAttrs = parseAttributesFromText(
      inspectorAttributesDraft,
      selectedNode.id,
      selectedNode.attributes ?? []
    );
    const currentAttrs = selectedNode.attributes ?? [];
    const changed =
      nextAttrs.length !== currentAttrs.length ||
      nextAttrs.some((attribute, index) => {
        const current = currentAttrs[index];
        return (
          !current ||
          attribute.name !== current.name ||
          (attribute.type ?? '') !== (current.type ?? '') ||
          (attribute.visibility ?? '+') !== (current.visibility ?? '+')
        );
      });
    if (changed) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: selectedNode.id,
        attributes: nextAttrs
      });
    }
  }

  function flushInspectorOperations(): void {
    if (selectedNode.kind === 'note' || selectedNode.kind === 'shape' || selectedNode.kind === 'frame') return;
    const nextOps = parseOperationsFromText(
      inspectorOperationsDraft,
      selectedNode.id,
      selectedNode.operations ?? []
    );
    const currentOps = selectedNode.operations ?? [];
    const changed =
      nextOps.length !== currentOps.length ||
      nextOps.some((operation, index) => {
        const current = currentOps[index];
        return (
          !current ||
          operation.name !== current.name ||
          (operation.returnType ?? '') !== (current.returnType ?? '') ||
          (operation.visibility ?? '+') !== (current.visibility ?? '+') ||
          (operation.signature ?? '()') !== (current.signature ?? '()')
        );
      });
    if (changed) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: selectedNode.id,
        operations: nextOps
      });
    }
  }
</script>

{#snippet eyeIcon(visible: boolean)}
  {#if visible}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  {:else}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  {/if}
{/snippet}

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
        onchange={(event) =>
          store.dispatchOperation({
            type: 'uml.updateNode',
            nodeId: selectedNode.id,
            name: event.currentTarget.value
          })}
      />
    </label>

    {#if selectedNode.kind === 'note'}
      <div class="vz-inspector-section">
        <div class="vz-section-divider"></div>
        <div class="vz-section-header">
          <span class="vz-field-label">Note Text</span>
        </div>
        <textarea
          class="vz-textarea"
          rows="6"
          placeholder="Write architecture notes, constraints, or implementation guidance…"
          value={selectedNode.text ?? ''}
          disabled={store.isReadOnly}
          onchange={(event) =>
            store.dispatchOperation({
              type: 'uml.updateNode',
              nodeId: selectedNode.id,
              text: event.currentTarget.value
            })}
        ></textarea>
      </div>
    {:else if selectedNode.kind === 'shape'}
      <div class="vz-field">
        <span class="vz-field-label">Shape Geometry</span>
        <Select
          value={selectedNode.shape ?? 'rectangle'}
          options={shapeOptions}
          disabled={store.isReadOnly}
          onchange={(value) =>
            store.dispatchOperation({
              type: 'uml.updateNode',
              nodeId: selectedNode.id,
              shape: value as UmlNode['shape']
            })}
        />
      </div>
    {:else if selectedNode.kind === 'frame'}
      <div class="vz-field">
        <span class="vz-field-label">Frame Border</span>
        <Select
          value={selectedNode.line ?? 'solid'}
          options={frameBorderOptions}
          disabled={store.isReadOnly}
          onchange={(value) =>
            store.dispatchOperation({
              type: 'uml.updateNode',
              nodeId: selectedNode.id,
              line: value as UmlNode['line']
            })}
        />
      </div>
    {:else}
      <label class="vz-field">
        <span class="vz-field-label">Stereotype</span>
        <input
          type="text"
          class="vz-input"
          placeholder="e.g. entity, service, aggregate"
          value={selectedNode.stereotype ?? ''}
          disabled={store.isReadOnly}
          onchange={(event) =>
            store.dispatchOperation({
              type: 'uml.updateNode',
              nodeId: selectedNode.id,
              stereotype: event.currentTarget.value
            })}
        />
      </label>

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
            placeholder="+ name: type\n- secret: number"
            rows={Math.max(4, inspectorAttributesDraft.split('\n').length || 1)}
            bind:value={inspectorAttributesDraft}
            disabled={store.isReadOnly}
            onblur={flushInspectorAttributes}
            onchange={flushInspectorAttributes}
          ></textarea>
        {/if}
      </div>

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
            placeholder="+ method(a: string): void\n- helper(): boolean"
            rows={Math.max(4, inspectorOperationsDraft.split('\n').length || 1)}
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
