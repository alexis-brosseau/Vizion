<script lang="ts">
  import type { EndpointDecoration } from '../../../shared/documents/types';
  import { getEndpointShape } from '../../../shared/registry/uml-registry';

  export interface EndpointChoice {
    label: string;
    decoration: EndpointDecoration;
  }

  let {
    x,
    y,
    current,
    multiplicityDraft = '',
    choices,
    onselect,
    onmultiplicitychange,
    onmultiplicitycommit,
    onclose
  }: {
    x: number;
    y: number;
    current: EndpointDecoration;
    multiplicityDraft?: string;
    choices: EndpointChoice[];
    onselect: (decoration: EndpointDecoration) => void;
    onmultiplicitychange?: (value: string) => void;
    onmultiplicitycommit?: () => void;
    onclose: () => void;
  } = $props();

  function preview(decoration: EndpointDecoration): { d: string; fill: string } {
    const descriptor = getEndpointShape(decoration.shape);
    if (!descriptor || descriptor.kind === 'none') return { d: '', fill: 'none' };
    return {
      d: descriptor.buildLocalPath(decoration.size ?? descriptor.defaultSize),
      fill: decoration.fill ?? descriptor.defaultFill ?? 'hollow'
    };
  }

  function isActive(choice: EndpointDecoration): boolean {
    if (choice.shape !== current.shape) return false;
    const descriptor = getEndpointShape(choice.shape);
    if (!descriptor?.supportsFill) return true;
    return (
      (choice.fill ?? descriptor.defaultFill ?? 'hollow') ===
      (current.fill ?? descriptor.defaultFill ?? 'hollow')
    );
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="vz-endpoint-popup"
  style="left: {x}px; top: {y}px;"
  role="dialog"
  tabindex="-1"
  aria-label="Customize relation endpoint"
  onpointerdown={(event) => event.stopPropagation()}
>
  <div class="vz-endpoint-mult-row">
    <span class="vz-field-label">Multiplicity</span>
    <input
      type="text"
      class="vz-input-mini"
      placeholder="e.g. 1, *, 1..5, 2..*"
      value={multiplicityDraft}
      oninput={(event) => onmultiplicitychange?.(event.currentTarget.value)}
      onchange={() => onmultiplicitycommit?.()}
      onkeydown={(event) => {
        if (event.key === 'Enter') onclose();
        else if (event.key === 'Escape') onclose();
      }}
    />
  </div>

  <div class="vz-endpoint-icon-grid">
    {#each choices as choice}
      {@const rendered = preview(choice.decoration)}
      <button
        type="button"
        class="vz-endpoint-icon-btn"
        class:active={isActive(choice.decoration)}
        title={choice.label}
        aria-pressed={isActive(choice.decoration)}
        onclick={() => onselect(choice.decoration)}
      >
        <svg
          width="34"
          height="18"
          viewBox="-24 -9 26 18"
          class="vz-endpoint-preview-svg"
          aria-hidden="true"
        >
          <line
            x1="-22"
            y1="0"
            x2={choice.decoration.shape === 'none' || choice.decoration.shape === 'open-arrow'
              ? '0'
              : String(-(choice.decoration.size ?? 11))}
            y2="0"
            stroke="currentColor"
            stroke-width="1.8"
          />
          {#if rendered.d}
            <path
              d={rendered.d}
              fill={choice.decoration.fill === 'filled'
                ? 'currentColor'
                : 'var(--vscode-editor-background)'}
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
          {/if}
        </svg>
        <span>{choice.label}</span>
      </button>
    {/each}
  </div>
</div>
