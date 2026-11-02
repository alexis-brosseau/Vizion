<script lang="ts">
  import type { UmlEdge } from '../../../shared/documents/types';
  import EdgeMarker from './EdgeMarker.svelte';
  import EdgePath from './EdgePath.svelte';
  import type { EdgeRenderData } from './edge-geometry';

  let {
    data,
    selected = false,
    onselect,
    ondblclick,
    oncontextmenu
  }: {
    data: EdgeRenderData;
    selected?: boolean;
    onselect?: (event: PointerEvent, edge: UmlEdge) => void;
    ondblclick?: (event: MouseEvent, edge: UmlEdge) => void;
    oncontextmenu?: (event: MouseEvent, edge: UmlEdge) => void;
  } = $props();
</script>

<g class="vz-edge-renderer" class:selected data-edge-id={data.edge.id}>
  <EdgePath
    pathD={data.geometry.pathD}
    isDashed={data.isDashed}
    {selected}
    onselect={(event) => onselect?.(event, data.edge)}
    ondblclick={(event) => ondblclick?.(event, data.edge)}
    oncontextmenu={(event) => oncontextmenu?.(event, data.edge)}
  />
  <EdgeMarker
    decoration={data.startDecoration}
    tip={data.geometry.startTip}
    angleDeg={data.geometry.startAngleDeg}
    {selected}
  />
  <EdgeMarker
    decoration={data.endDecoration}
    tip={data.geometry.endTip}
    angleDeg={data.geometry.endAngleDeg}
    {selected}
  />
</g>
