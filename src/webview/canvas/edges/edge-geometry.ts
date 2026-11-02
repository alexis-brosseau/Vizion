import type {
  EndpointDecoration,
  UmlEdge,
  UmlNode,
  UmlNodeLayout,
  UmlRoutingKind
} from '../../../shared/documents/types';
import {
  computeUmlEdgeGeometry,
  getMultiplicityLabelPoint,
  type Point2D
} from '../../../shared/geometry';
import { getEndpointShape } from '../../../shared/registry/uml-registry';

export interface EdgeRenderData {
  edge: UmlEdge;
  geometry: ReturnType<typeof computeUmlEdgeGeometry>;
  startDecoration: EndpointDecoration;
  endDecoration: EndpointDecoration;
  isDashed: boolean;
  startMarkerPath: string;
  endMarkerPath: string;
  startMarkerFill: string;
  endMarkerFill: string;
  startCenter: Point2D;
  endCenter: Point2D;
  startMultiplicityPoint: Point2D;
  endMultiplicityPoint: Point2D;
}

export function endpointMarkerPath(decoration: EndpointDecoration | undefined): {
  d: string;
  fill: 'none' | 'hollow' | 'filled';
} {
  const descriptor = getEndpointShape(decoration?.shape ?? 'none');
  if (!descriptor || descriptor.kind === 'none') return { d: '', fill: 'none' };
  const d = descriptor.buildLocalPath(decoration?.size ?? descriptor.defaultSize);
  if (!descriptor.supportsFill) return { d, fill: 'none' };
  return { d, fill: decoration?.fill ?? descriptor.defaultFill ?? 'hollow' };
}

export function endpointVisualCenter(
  tip: Point2D,
  angleDeg: number,
  decoration: EndpointDecoration | undefined
): Point2D {
  const descriptor = getEndpointShape(decoration?.shape ?? 'none');
  if (!descriptor || descriptor.kind === 'none') return tip;
  const size = decoration?.size ?? descriptor.defaultSize;
  const radians = (angleDeg * Math.PI) / 180;
  return {
    x: tip.x - Math.cos(radians) * (size / 2),
    y: tip.y - Math.sin(radians) * (size / 2)
  };
}

export function resolveEdgeRouting(
  edge: UmlEdge,
  defaultRouting: UmlRoutingKind | undefined
): UmlRoutingKind {
  const routing = edge.visual?.routing;
  if (!routing || routing === 'default') return defaultRouting ?? 'orthogonal';
  return routing;
}

export function computeEdgeRenderData(
  edge: UmlEdge,
  sourceBox: UmlNodeLayout,
  targetBox: UmlNodeLayout,
  sourceNode: UmlNode | undefined,
  targetNode: UmlNode | undefined,
  defaultRouting: UmlRoutingKind | undefined,
  parallelOffset = 0
): EdgeRenderData {
  const touchesNote = sourceNode?.kind === 'note' || targetNode?.kind === 'note';
  const isDashed = (edge.visual?.line ?? (touchesNote ? 'dashed' : 'solid')) === 'dashed';
  const startDecoration = edge.visual?.start ?? { shape: 'none', size: 10 };
  const endDecoration = edge.visual?.end ?? { shape: 'none', size: 10 };
  const geometry = computeUmlEdgeGeometry(
    sourceBox,
    targetBox,
    resolveEdgeRouting(edge, defaultRouting),
    startDecoration,
    endDecoration,
    parallelOffset,
    undefined,
    undefined,
    sourceNode?.kind === 'shape' ? sourceNode.shape : undefined,
    targetNode?.kind === 'shape' ? targetNode.shape : undefined,
    edge.label
  );
  const startMarker = endpointMarkerPath(startDecoration);
  const endMarker = endpointMarkerPath(endDecoration);

  return {
    edge,
    geometry,
    startDecoration,
    endDecoration,
    isDashed,
    startMarkerPath: startMarker.d,
    endMarkerPath: endMarker.d,
    startMarkerFill: startMarker.fill,
    endMarkerFill: endMarker.fill,
    startCenter: endpointVisualCenter(geometry.startTip, geometry.startAngleDeg, startDecoration),
    endCenter: endpointVisualCenter(geometry.endTip, geometry.endAngleDeg, endDecoration),
    startMultiplicityPoint: getMultiplicityLabelPoint(
      geometry.startTip,
      geometry.startAngleDeg,
      edge.source.multiplicity
    ),
    endMultiplicityPoint: getMultiplicityLabelPoint(
      geometry.endTip,
      geometry.endAngleDeg,
      edge.target.multiplicity
    )
  };
}
