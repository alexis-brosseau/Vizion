import { getEndpointShape } from '../registry/uml-registry';
import type { EndpointDecoration, UmlNodeLayout, UmlRoutingKind } from '../documents/types';

export interface Point2D {
  x: number;
  y: number;
}

export interface Rect2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportTransform {
  panX: number;
  panY: number;
  zoom: number;
}

export const GRID_SIZE = 20;

export function snapToGrid(value: number, gridSize = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapRectToGrid(
  rect: Rect2D,
  gridSize = GRID_SIZE,
  minWidth = 120,
  minHeight = 80
): Rect2D {
  return {
    x: snapToGrid(rect.x, gridSize),
    y: snapToGrid(rect.y, gridSize),
    width: Math.max(minWidth, snapToGrid(rect.width, gridSize)),
    height: Math.max(minHeight, snapToGrid(rect.height, gridSize))
  };
}

export function screenToWorld(
  screenX: number,
  screenY: number,
  viewport: ViewportTransform
): Point2D {
  const z = Math.max(0.05, viewport.zoom);
  return {
    x: Math.round(((screenX - viewport.panX) / z) * 100) / 100,
    y: Math.round(((screenY - viewport.panY) / z) * 100) / 100
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  viewport: ViewportTransform
): Point2D {
  return {
    x: worldX * viewport.zoom + viewport.panX,
    y: worldY * viewport.zoom + viewport.panY
  };
}

/**
 * Normalizes a drag box from two arbitrary points into non-negative top-left + width/height.
 */
export function normalizeDragRect(p1: Point2D, p2: Point2D, minSize = 0): Rect2D {
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.max(minSize, Math.abs(p2.x - p1.x));
  const height = Math.max(minSize, Math.abs(p2.y - p1.y));
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    width: Math.round(width * 10) / 10,
    height: Math.round(height * 10) / 10
  };
}

export function rectsIntersect(a: Rect2D, b: Rect2D): boolean {
  return (
    a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y
  );
}

/**
 * Computes the intersection point on the boundary of `rect` for a ray starting at the center
 * of `rect` and pointing toward `externalPoint`, plus the outward normal vector.
 */
export function computeRectBoundaryIntersection(
  rect: UmlNodeLayout,
  externalPoint: Point2D
): { point: Point2D; normal: Point2D } {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const dx = externalPoint.x - cx;
  const dy = externalPoint.y - cy;

  const halfW = Math.max(10, rect.width / 2);
  const halfH = Math.max(10, rect.height / 2);

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return {
      point: { x: rect.x + rect.width, y: cy },
      normal: { x: 1, y: 0 }
    };
  }

  const scaleX = halfW / Math.max(0.0001, Math.abs(dx));
  const scaleY = halfH / Math.max(0.0001, Math.abs(dy));

  if (scaleX < scaleY) {
    const signX = dx >= 0 ? 1 : -1;
    return {
      point: {
        x: cx + signX * halfW,
        y: cy + dy * scaleX
      },
      normal: { x: signX, y: 0 }
    };
  } else {
    const signY = dy >= 0 ? 1 : -1;
    return {
      point: {
        x: cx + dx * scaleY,
        y: cy + signY * halfH
      },
      normal: { x: 0, y: signY }
    };
  }
}

export interface ComputedUmlEdgeGeometry {
  pathD: string;
  hitPathD: string;
  startTip: Point2D;
  endTip: Point2D;
  /** Angle in degrees for orienting the start marker so its tip faces `startTip` */
  startAngleDeg: number;
  /** Angle in degrees for orienting the end marker so its tip faces `endTip` */
  endAngleDeg: number;
  labelPoint: Point2D;
}

/**
 * Computes tangent-aware path geometry and path-trimming for hollow/filled endpoint decorations
 * so strokes never bleed through hollow diamonds/triangles/circles/squares.
 */
export function computeUmlEdgeGeometry(
  sourceRect: UmlNodeLayout,
  targetRect: UmlNodeLayout,
  routing: UmlRoutingKind = 'straight',
  startDec?: EndpointDecoration,
  endDec?: EndpointDecoration,
  parallelOffset = 0,
  sourceAnchorOverride?: { point: Point2D; normal: Point2D },
  targetAnchorOverride?: { point: Point2D; normal: Point2D }
): ComputedUmlEdgeGeometry {
  // Handle self-loop gracefully if source and target are the same node and no distinct port overrides
  if (
    !sourceAnchorOverride &&
    !targetAnchorOverride &&
    sourceRect.x === targetRect.x &&
    sourceRect.y === targetRect.y &&
    sourceRect.width === targetRect.width &&
    sourceRect.height === targetRect.height
  ) {
    const startTip = { x: sourceRect.x + sourceRect.width * 0.75, y: sourceRect.y };
    const endTip = { x: sourceRect.x + sourceRect.width, y: sourceRect.y + sourceRect.height * 0.35 };
    const c1 = { x: startTip.x, y: startTip.y - 55 };
    const c2 = { x: endTip.x + 60, y: endTip.y - 55 };
    const pathD = `M ${startTip.x} ${startTip.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip.x} ${endTip.y}`;
    return {
      pathD,
      hitPathD: pathD,
      startTip,
      endTip,
      startAngleDeg: 90,
      endAngleDeg: 180,
      labelPoint: { x: endTip.x + 42, y: startTip.y - 42 }
    };
  }

  const sourceCenter = {
    x: sourceRect.x + sourceRect.width / 2,
    y: sourceRect.y + sourceRect.height / 2
  };
  const targetCenter = {
    x: targetRect.x + targetRect.width / 2,
    y: targetRect.y + targetRect.height / 2
  };

  const srcHit =
    sourceAnchorOverride ?? computeRectBoundaryIntersection(sourceRect, targetCenter);
  const tgtHit =
    targetAnchorOverride ?? computeRectBoundaryIntersection(targetRect, sourceCenter);

  let startTip = srcHit.point;
  let endTip = tgtHit.point;

  // Apply parallel edge offset if multiple edges connect the same pair
  const rawDx = endTip.x - startTip.x;
  const rawDy = endTip.y - startTip.y;
  const rawLen = Math.hypot(rawDx, rawDy) || 1;
  const perpX = -rawDy / rawLen;
  const perpY = rawDx / rawLen;

  if (parallelOffset !== 0) {
    startTip = {
      x: startTip.x + perpX * parallelOffset,
      y: startTip.y + perpY * parallelOffset
    };
    endTip = {
      x: endTip.x + perpX * parallelOffset,
      y: endTip.y + perpY * parallelOffset
    };
  }

  const startShape = getEndpointShape(startDec?.shape ?? 'none');
  const endShape = getEndpointShape(endDec?.shape ?? 'none');
  const startSize = startDec?.size ?? startShape?.defaultSize ?? 10;
  const endSize = endDec?.size ?? endShape?.defaultSize ?? 11;

  const startTrim = (startShape?.trimMultiplier ?? 0) * startSize;
  const endTrim = (endShape?.trimMultiplier ?? 0) * endSize;

  const fullHitPath = `M ${startTip.x} ${startTip.y} L ${endTip.x} ${endTip.y}`;

  if (routing === 'bezier') {
    const dist = Math.min(140, Math.max(40, rawLen * 0.38));
    const c1 = {
      x: startTip.x + srcHit.normal.x * dist,
      y: startTip.y + srcHit.normal.y * dist
    };
    const c2 = {
      x: endTip.x + tgtHit.normal.x * dist,
      y: endTip.y + tgtHit.normal.y * dist
    };

    // Tangent vector pointing INTO startTip (from c1 to startTip)
    const startVecX = startTip.x - c1.x;
    const startVecY = startTip.y - c1.y;
    const startVecLen = Math.hypot(startVecX, startVecY) || 1;
    const startUnitX = startVecX / startVecLen;
    const startUnitY = startVecY / startVecLen;

    // Tangent vector pointing INTO endTip (from c2 to endTip)
    const endVecX = endTip.x - c2.x;
    const endVecY = endTip.y - c2.y;
    const endVecLen = Math.hypot(endVecX, endVecY) || 1;
    const endUnitX = endVecX / endVecLen;
    const endUnitY = endVecY / endVecLen;

    const trimmedStart = {
      x: startTip.x - startUnitX * Math.min(startTrim, rawLen * 0.4),
      y: startTip.y - startUnitY * Math.min(startTrim, rawLen * 0.4)
    };
    const trimmedEnd = {
      x: endTip.x - endUnitX * Math.min(endTrim, rawLen * 0.4),
      y: endTip.y - endUnitY * Math.min(endTrim, rawLen * 0.4)
    };

    const pathD = `M ${trimmedStart.x} ${trimmedStart.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${trimmedEnd.x} ${trimmedEnd.y}`;
    const hitPathD = `M ${startTip.x} ${startTip.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${endTip.x} ${endTip.y}`;

    // Midpoint on cubic bezier at t=0.5
    const labelPoint = {
      x: 0.125 * startTip.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * endTip.x,
      y: 0.125 * startTip.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip.y - 10
    };

    return {
      pathD,
      hitPathD,
      startTip,
      endTip,
      startAngleDeg: (Math.atan2(startUnitY, startUnitX) * 180) / Math.PI,
      endAngleDeg: (Math.atan2(endUnitY, endUnitX) * 180) / Math.PI,
      labelPoint
    };
  }

  // Straight routing
  const unitX = rawDx / rawLen;
  const unitY = rawDy / rawLen;

  const trimmedStart = {
    x: startTip.x + unitX * Math.min(startTrim, rawLen * 0.45),
    y: startTip.y + unitY * Math.min(startTrim, rawLen * 0.45)
  };
  const trimmedEnd = {
    x: endTip.x - unitX * Math.min(endTrim, rawLen * 0.45),
    y: endTip.y - unitY * Math.min(endTrim, rawLen * 0.45)
  };

  const pathD = `M ${trimmedStart.x} ${trimmedStart.y} L ${trimmedEnd.x} ${trimmedEnd.y}`;
  const endAngleDeg = (Math.atan2(unitY, unitX) * 180) / Math.PI;
  const startAngleDeg = (Math.atan2(-unitY, -unitX) * 180) / Math.PI;

  return {
    pathD,
    hitPathD: fullHitPath,
    startTip,
    endTip,
    startAngleDeg,
    endAngleDeg,
    labelPoint: {
      x: (startTip.x + endTip.x) / 2,
      y: (startTip.y + endTip.y) / 2 - 10
    }
  };
}

/**
 * Ramer-Douglas-Peucker stroke simplification with preserved start/end points
 * and documented world-unit tolerance (default 1.2 world units).
 */
export function simplifyStrokePoints(
  points: [number, number][],
  tolerance = 1.2
): [number, number][] {
  if (points.length <= 2) {
    return points.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }

  const sqTolerance = tolerance * tolerance;

  function getSqSegDist(
    p: [number, number],
    p1: [number, number],
    p2: [number, number]
  ): number {
    let x = p1[0];
    let y = p1[1];
    let dx = p2[0] - x;
    let dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = p2[0];
        y = p2[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  }

  function simplifyDP(
    pts: [number, number][],
    first: number,
    last: number,
    out: [number, number][]
  ): void {
    let maxSqDist = sqTolerance;
    let index = -1;

    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(pts[i], pts[first], pts[last]);
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance && index !== -1) {
      if (index - first > 1) {
        simplifyDP(pts, first, index, out);
      }
      out.push([Math.round(pts[index][0] * 10) / 10, Math.round(pts[index][1] * 10) / 10]);
      if (last - index > 1) {
        simplifyDP(pts, index, last, out);
      }
    }
  }

  const last = points.length - 1;
  const simplified: [number, number][] = [
    [Math.round(points[0][0] * 10) / 10, Math.round(points[0][1] * 10) / 10]
  ];
  simplifyDP(points, 0, last, simplified);
  simplified.push([
    Math.round(points[last][0] * 10) / 10,
    Math.round(points[last][1] * 10) / 10
  ]);

  return simplified.slice(0, 5000);
}

