<script lang="ts">
  import type { EndpointDecoration } from '../../../shared/documents/types';
  import type { Point2D } from '../../../shared/geometry';
  import { getEndpointShape } from '../../../shared/registry/uml-registry';

  let {
    decoration,
    tip,
    angleDeg,
    selected = false
  }: {
    decoration: EndpointDecoration;
    tip: Point2D;
    angleDeg: number;
    selected?: boolean;
  } = $props();

  const descriptor = $derived(getEndpointShape(decoration.shape));
  const pathD = $derived(descriptor?.buildLocalPath(decoration.size ?? descriptor.defaultSize) ?? '');
  const stroke = $derived(selected ? 'var(--vz-accent)' : 'var(--vscode-editor-foreground)');
  const fill = $derived.by(() => {
    if (!descriptor?.supportsFill) return 'none';
    if ((decoration.fill ?? descriptor.defaultFill ?? 'hollow') !== 'filled') {
      return 'var(--vscode-editor-background)';
    }
    return selected ? 'var(--vz-accent)' : 'var(--vscode-editor-foreground)';
  });
</script>

{#if pathD}
  <g class="vz-edge-marker" class:selected>
    <g transform="translate({tip.x}, {tip.y}) rotate({angleDeg})">
      <path
        d={pathD}
        fill={fill}
        {stroke}
        stroke-width={selected ? 2.2 : 1.6}
        stroke-linejoin="round"
      ></path>
    </g>
  </g>
{/if}
