<script lang="ts">
  import type { UmlEdge, UmlEdgeRouting } from '../../../shared/documents/types';
  import { listEndpointShapes, listUmlRelationPresets } from '../../../shared/registry/uml-registry';
  import Select from '../../ui/input/Select.svelte';
  import type { VizionWebviewStore } from '../../state.svelte';

  let {
    store,
    selectedEdge,
    touchesNote = false
  }: {
    store: VizionWebviewStore;
    selectedEdge: UmlEdge;
    touchesNote?: boolean;
  } = $props();

  const relationPresets = listUmlRelationPresets();
  const endpointShapes = listEndpointShapes();
  const relationOptions = relationPresets.map((preset) => ({
    value: preset.kind,
    label: preset.label
  }));
  const endpointShapeOptions = endpointShapes.map((shape) => ({
    value: shape.kind,
    label: shape.label
  }));
  const lineOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' }
  ];
  const routingOptions = [
    { value: 'default', label: 'Default' },
    { value: 'orthogonal', label: 'Orthogonal' },
    { value: 'straight', label: 'Straight' },
    { value: 'bezier', label: 'Smooth' }
  ];
  const fillOptions = [
    { value: 'hollow', label: 'Hollow' },
    { value: 'filled', label: 'Filled' }
  ];
</script>

<div class="vz-sidebar-header">
  <span class="vz-sidebar-title">Relation: {selectedEdge.id}</span>
</div>

<div class="vz-inspector-body">
  <div class="vz-field">
    <span class="vz-field-label">Semantic Relation</span>
    <Select
      ariaLabel="Relation kind"
      value={selectedEdge.kind}
      options={relationOptions}
      disabled={store.isReadOnly}
      onchange={(value) =>
        store.dispatchOperation({
          type: 'uml.updateEdge',
          edgeId: selectedEdge.id,
          kind: value as UmlEdge['kind']
        })}
    />
  </div>

  <label class="vz-field">
    <span class="vz-field-label">Label</span>
    <input
      type="text"
      class="vz-input"
      placeholder="e.g. belongs to, uses"
      value={selectedEdge.label ?? ''}
      disabled={store.isReadOnly}
      onchange={(event) =>
        store.dispatchOperation({
          type: 'uml.updateEdge',
          edgeId: selectedEdge.id,
          label: event.currentTarget.value
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
    <div class="vz-field">
      <span class="vz-field-label">Line Style</span>
      <Select
        value={selectedEdge.visual?.line ?? (touchesNote ? 'dashed' : 'solid')}
        options={lineOptions}
        disabled={store.isReadOnly}
        onchange={(value) =>
          store.dispatchOperation({
            type: 'uml.updateEdge',
            edgeId: selectedEdge.id,
            line: value as 'solid' | 'dashed'
          })}
      />
    </div>

    <div class="vz-field">
      <span class="vz-field-label">Routing</span>
      <Select
        value={selectedEdge.visual?.routing ?? 'default'}
        options={routingOptions}
        disabled={store.isReadOnly}
        onchange={(value) =>
          store.dispatchOperation({
            type: 'uml.updateEdge',
            edgeId: selectedEdge.id,
            routing: value as UmlEdgeRouting
          })}
      />
    </div>
  </div>

  {#each ['start', 'end'] as const as endKey}
    {@const currentDecoration = selectedEdge.visual?.[endKey] ?? { shape: 'none' }}
    {@const shapeDescriptor = endpointShapes.find((shape) => shape.kind === currentDecoration.shape)}
    {@const currentMultiplicity =
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
          value={currentMultiplicity}
          disabled={store.isReadOnly}
          onchange={(event) =>
            store.dispatchOperation({
              type: 'uml.updateEdge',
              edgeId: selectedEdge.id,
              ...(endKey === 'start'
                ? { sourceMultiplicity: event.currentTarget.value.trim() }
                : { targetMultiplicity: event.currentTarget.value.trim() })
            })}
        />
      </label>

      <div class="vz-field-grid">
        <div class="vz-field">
          <span class="vz-field-label">Shape</span>
          <Select
            ariaLabel="{endKey} endpoint shape"
            value={currentDecoration.shape}
            options={endpointShapeOptions}
            disabled={store.isReadOnly}
            onchange={(value) =>
              store.dispatchOperation({
                type: 'uml.updateEndpoint',
                edgeId: selectedEdge.id,
                end: endKey,
                decoration: { ...currentDecoration, shape: value }
              })}
          />
        </div>

        {#if shapeDescriptor?.supportsFill}
          <div class="vz-field">
            <span class="vz-field-label">Fill</span>
            <Select
              ariaLabel="{endKey} endpoint fill"
              value={currentDecoration.fill ?? shapeDescriptor.defaultFill ?? 'hollow'}
              options={fillOptions}
              disabled={store.isReadOnly}
              onchange={(value) =>
                store.dispatchOperation({
                  type: 'uml.updateEndpoint',
                  edgeId: selectedEdge.id,
                  end: endKey,
                  decoration: {
                    ...currentDecoration,
                    fill: value as 'hollow' | 'filled'
                  }
                })}
            />
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
