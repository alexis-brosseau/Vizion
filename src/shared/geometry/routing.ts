import { getEndpointShape } from '../registry/uml-registry';
import type {
  EndpointDecoration,
  UmlNodeLayout,
  UmlRoutingKind,
  UmlShapeGeometry
} from '../documents/types';
import type { Point2D } from './vector';
import { GRID_SIZE, snapToGrid } from './vector';
import { computeShapeBoundaryIntersection, type BoundaryIntersectionResult } from './intersections';

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
 * Computes a clean label position near an endpoint tip for rendering multiplicity numbers (e.g. `1`, `*`, `1..5`).
 * The label is placed at a fixed distance from its side to the relation line (not from its center) so long labels never overlap the line.
 */
export function getMultiplicityLabelPoint(
  tip: Point2D,
  angleDeg: number,
  multiplicityText?: string
): Point2D {
  const text = (multiplicityText ?? '').trim();
  const boxWidth = text.length > 0 ? text.length * 7.6 + 12 : 20;
  const halfW = boxWidth / 2;
  const halfH = 8.5; // badge height is 17

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Perpendicular unit vector pointing away from line (side offset)
  const pX = sin;
  const pY = -cos;

  // Extent of the badge bounding box in the perpendicular direction
  const perpExtent = Math.abs(pX) * halfW + Math.abs(pY) * halfH;
  const sideGap = 5; // fixed distance from the side of the label to the line
  const perpDist = perpExtent + sideGap;

  // Extent of the badge along the line direction to keep it clear of the endpoint
  const alongExtent = Math.abs(cos) * halfW + Math.abs(sin) * halfH;
  const inwardDist = Math.max(22, alongExtent + 4);

  const dx = -cos * inwardDist + pX * perpDist;
  const dy = -sin * inwardDist + pY * perpDist;
  return {
    x: tip.x + dx,
    y: tip.y + dy
  };
}

/**
 * Computes straight line routing between two tips with endpoint trimming and centered label placement.
 */
export function computeStraightRoute(
  startTip: Point2D,
  endTip: Point2D,
  startTrim = 0,
  endTrim = 0
): ComputedUmlEdgeGeometry {
  const rawDx = endTip.x - startTip.x;
  const rawDy = endTip.y - startTip.y;
  const rawLen = Math.hypot(rawDx, rawDy) || 1;
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
  const hitPathD = `M ${startTip.x} ${startTip.y} L ${endTip.x} ${endTip.y}`;
  const endAngleDeg = (Math.atan2(unitY, unitX) * 180) / Math.PI;
  const startAngleDeg = (Math.atan2(-unitY, -unitX) * 180) / Math.PI;

  return {
    pathD,
    hitPathD,
    startTip,
    endTip,
    startAngleDeg,
    endAngleDeg,
    labelPoint: {
      x: (startTip.x + endTip.x) / 2,
      y: (startTip.y + endTip.y) / 2
    }
  };
}

/**
 * Computes cubic bezier routing between two endpoints directed along surface outward normals.
 */
export function computeBezierRoute(
  startTip: Point2D,
  endTip: Point2D,
  srcNormal: Point2D,
  tgtNormal: Point2D,
  startTrim = 0,
  endTrim = 0
): ComputedUmlEdgeGeometry {
  const rawDx = endTip.x - startTip.x;
  const rawDy = endTip.y - startTip.y;
  const rawLen = Math.hypot(rawDx, rawDy) || 1;

  const dist = Math.min(140, Math.max(40, rawLen * 0.38));
  const c1 = {
    x: startTip.x + srcNormal.x * dist,
    y: startTip.y + srcNormal.y * dist
  };
  const c2 = {
    x: endTip.x + tgtNormal.x * dist,
    y: endTip.y + tgtNormal.y * dist
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
    y: 0.125 * startTip.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip.y
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

/**
 * Computes orthogonal 90° right-angle routing between two nodes.
 */
function clampToRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Keeps an orthogonal endpoint on the node border while moving it onto a grid line.
 * This is what allows a relation to land on a node side even when the node's center
 * is not on the grid.
 */
function snapAnchorToRect(point: Point2D, rect: UmlNodeLayout): Point2D {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  const onVerticalEdge =
    Math.min(Math.abs(point.x - rect.x), Math.abs(point.x - right)) <=
    Math.min(Math.abs(point.y - rect.y), Math.abs(point.y - bottom));

  if (onVerticalEdge) {
    return {
      x: point.x,
      y: clampToRange(snapToGrid(point.y, GRID_SIZE), rect.y, bottom)
    };
  }
  return {
    x: clampToRange(snapToGrid(point.x, GRID_SIZE), rect.x, right),
    y: point.y
  };
}

function shapeVertices(rect: UmlNodeLayout, shape: UmlShapeGeometry): Point2D[] {
  const pad = 2;
  const x0 = rect.x + pad;
  const y0 = rect.y + pad;
  const x1 = rect.x + Math.max(pad + 10, rect.width - pad);
  const y1 = rect.y + Math.max(pad + 10, rect.height - pad);
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;

  if (shape === 'rhombus') {
    return [
      { x: cx, y: y0 },
      { x: x1, y: cy },
      { x: cx, y: y1 },
      { x: x0, y: cy }
    ];
  }
  if (shape === 'trapezoid') {
    const inset = Math.min(36, (x1 - x0) * 0.2);
    return [
      { x: x0 + inset, y: y0 },
      { x: x1 - inset, y: y0 },
      { x: x1, y: y1 },
      { x: x0, y: y1 }
    ];
  }
  const skew = Math.min(32, (x1 - x0) * 0.18);
  return [
    { x: x0 + skew, y: y0 },
    { x: x1, y: y0 },
    { x: x1 - skew, y: y1 },
    { x: x0, y: y1 }
  ];
}

function polygonBoundaryAtY(vertices: Point2D[], y: number, side: 'min' | 'max'): number | null {
  const candidates: number[] = [];
  for (let index = 0; index < vertices.length; index++) {
    const a = vertices[index];
    const b = vertices[(index + 1) % vertices.length];
    if (a.y === b.y) continue;
    if (y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) continue;
    const t = (y - a.y) / (b.y - a.y);
    candidates.push(a.x + t * (b.x - a.x));
  }
  if (candidates.length === 0) return null;
  return side === 'min' ? Math.min(...candidates) : Math.max(...candidates);
}

function polygonBoundaryAtX(vertices: Point2D[], x: number, side: 'min' | 'max'): number | null {
  const candidates: number[] = [];
  for (let index = 0; index < vertices.length; index++) {
    const a = vertices[index];
    const b = vertices[(index + 1) % vertices.length];
    if (a.x === b.x) continue;
    if (x < Math.min(a.x, b.x) || x > Math.max(a.x, b.x)) continue;
    const t = (x - a.x) / (b.x - a.x);
    candidates.push(a.y + t * (b.y - a.y));
  }
  if (candidates.length === 0) return null;
  return side === 'min' ? Math.min(...candidates) : Math.max(...candidates);
}

function shapeBoundaryAtSnappedAnchor(
  point: Point2D,
  rect: UmlNodeLayout,
  shape: UmlShapeGeometry,
  normal: Point2D
): Point2D {
  if (shape === 'rectangle') return snapAnchorToRect(point, rect);
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;

  if (normal.x !== 0) {
    const y = snapToGrid(cy, GRID_SIZE);
    if (shape === 'ellipse') {
      const rx = Math.max(5, (rect.width - 4) / 2);
      const ry = Math.max(5, (rect.height - 4) / 2);
      const normalizedY = clampToRange(y, cy - ry + 0.5, cy + ry - 0.5);
      const offset = (normalizedY - cy) / ry;
      const halfWidth = rx * Math.sqrt(Math.max(0, 1 - offset * offset));
      return { x: cx + (normal.x > 0 ? halfWidth : -halfWidth), y: normalizedY };
    }
    if (shape === 'rhombus') {
      const rx = Math.max(5, (rect.width - 4) / 2);
      const ry = Math.max(5, (rect.height - 4) / 2);
      const normalizedY = clampToRange(y, cy - ry + 0.5, cy + ry - 0.5);
      const halfWidth = rx * Math.max(0, 1 - Math.abs(normalizedY - cy) / ry);
      return { x: cx + (normal.x > 0 ? halfWidth : -halfWidth), y: normalizedY };
    }
    const boundaryX = polygonBoundaryAtY(
      shapeVertices(rect, shape),
      y,
      normal.x > 0 ? 'max' : 'min'
    );
    return { x: boundaryX ?? (normal.x > 0 ? rect.x + rect.width : rect.x), y };
  }

  const x = snapToGrid(cx, GRID_SIZE);
  if (shape === 'ellipse') {
    const rx = Math.max(5, (rect.width - 4) / 2);
    const ry = Math.max(5, (rect.height - 4) / 2);
    const normalizedX = clampToRange(x, cx - rx + 0.5, cx + rx - 0.5);
    const offset = (normalizedX - cx) / rx;
    const halfHeight = ry * Math.sqrt(Math.max(0, 1 - offset * offset));
    return { x: normalizedX, y: cy + (normal.y > 0 ? halfHeight : -halfHeight) };
  }
  if (shape === 'rhombus') {
    const rx = Math.max(5, (rect.width - 4) / 2);
    const ry = Math.max(5, (rect.height - 4) / 2);
    const normalizedX = clampToRange(x, cx - rx + 0.5, cx + rx - 0.5);
    const halfHeight = ry * Math.max(0, 1 - Math.abs(normalizedX - cx) / rx);
    return { x: normalizedX, y: cy + (normal.y > 0 ? halfHeight : -halfHeight) };
  }
  const boundaryY = polygonBoundaryAtX(
    shapeVertices(rect, shape),
    x,
    normal.y > 0 ? 'max' : 'min'
  );
  return { x, y: boundaryY ?? (normal.y > 0 ? rect.y + rect.height : rect.y) };
}

/**
 * Snaps orthogonal routes to the 20px grid and guarantees axis-aligned segments.
 * Endpoints stay pinned to the node border; intermediate elbows land on grid lines.
 */
function gridifyOrthogonalRoute(
  points: Point2D[],
  sourceRect: UmlNodeLayout,
  targetRect: UmlNodeLayout,
  sourceShape: UmlShapeGeometry | undefined,
  targetShape: UmlShapeGeometry | undefined,
  sourceNormal: Point2D,
  targetNormal: Point2D
): Point2D[] {
  if (points.length === 0) return points;

  const snapped: Point2D[] = [];
  snapped.push(
    sourceShape
      ? shapeBoundaryAtSnappedAnchor(points[0], sourceRect, sourceShape, sourceNormal)
      : snapAnchorToRect(points[0], sourceRect)
  );
  for (let index = 1; index < points.length - 1; index++) {
    snapped.push({
      x: snapToGrid(points[index].x, GRID_SIZE),
      y: snapToGrid(points[index].y, GRID_SIZE)
    });
  }
  snapped.push(
    targetShape
      ? shapeBoundaryAtSnappedAnchor(
          points[points.length - 1],
          targetRect,
          targetShape,
          targetNormal
        )
      : snapAnchorToRect(points[points.length - 1], targetRect)
  );

  const orthogonal: Point2D[] = [snapped[0]];
  for (let index = 1; index < snapped.length; index++) {
    const previous = orthogonal[orthogonal.length - 1];
    const current = snapped[index];
    if (previous.x !== current.x && previous.y !== current.y) {
      // Insert a grid-aligned elbow before the point that changed both axes.
      orthogonal.push({ x: current.x, y: previous.y });
    }
    if (previous.x === current.x && previous.y === current.y) continue;
    orthogonal.push(current);
  }
  return orthogonal;
}

export function computeOrthogonalRoute(
  sourceRect: UmlNodeLayout,
  targetRect: UmlNodeLayout,
  srcHit: BoundaryIntersectionResult,
  tgtHit: BoundaryIntersectionResult,
  startTrim = 0,
  endTrim = 0,
  parallelOffset = 0,
  sourceAnchorOverride?: BoundaryIntersectionResult,
  targetAnchorOverride?: BoundaryIntersectionResult,
  sourceShape?: UmlShapeGeometry,
  targetShape?: UmlShapeGeometry,
  labelText?: string
): ComputedUmlEdgeGeometry {
  const sourceCenter = {
    x: sourceRect.x + sourceRect.width / 2,
    y: sourceRect.y + sourceRect.height / 2
  };
  const targetCenter = {
    x: targetRect.x + targetRect.width / 2,
    y: targetRect.y + targetRect.height / 2
  };

  const sRight = sourceRect.x + sourceRect.width;
  const sLeft = sourceRect.x;
  const sBottom = sourceRect.y + sourceRect.height;
  const sTop = sourceRect.y;

  const tRight = targetRect.x + targetRect.width;
  const tLeft = targetRect.x;
  const tBottom = targetRect.y + targetRect.height;
  const tTop = targetRect.y;

  const gapRight = tLeft - sRight;
  const gapLeft = sLeft - tRight;
  const gapBottom = tTop - sBottom;
  const gapTop = sTop - tBottom;

  let startPt: Point2D = srcHit.point;
  let startNorm: Point2D = srcHit.normal;
  let endPt: Point2D = tgtHit.point;
  let endNorm: Point2D = tgtHit.normal;

  if (!sourceAnchorOverride && !targetAnchorOverride) {
    if (gapRight >= 0 && gapRight >= gapBottom && gapRight >= gapTop) {
      startPt = { x: sRight, y: sourceCenter.y };
      startNorm = { x: 1, y: 0 };
      endPt = { x: tLeft, y: targetCenter.y };
      endNorm = { x: -1, y: 0 };
    } else if (gapLeft >= 0 && gapLeft >= gapBottom && gapLeft >= gapTop) {
      startPt = { x: sLeft, y: sourceCenter.y };
      startNorm = { x: -1, y: 0 };
      endPt = { x: tRight, y: targetCenter.y };
      endNorm = { x: 1, y: 0 };
    } else if (gapBottom >= 0) {
      startPt = { x: sourceCenter.x, y: sBottom };
      startNorm = { x: 0, y: 1 };
      endPt = { x: targetCenter.x, y: tTop };
      endNorm = { x: 0, y: -1 };
    } else if (gapTop >= 0) {
      startPt = { x: sourceCenter.x, y: sTop };
      startNorm = { x: 0, y: -1 };
      endPt = { x: targetCenter.x, y: tBottom };
      endNorm = { x: 0, y: 1 };
    }
  }

  if (sourceShape && !sourceAnchorOverride) {
    const hit = computeShapeBoundaryIntersection(
      sourceRect,
      { x: sourceCenter.x + startNorm.x * 10000, y: sourceCenter.y + startNorm.y * 10000 },
      sourceShape
    );
    startPt = hit.point;
  }
  if (targetShape && !targetAnchorOverride) {
    const hit = computeShapeBoundaryIntersection(
      targetRect,
      { x: targetCenter.x + endNorm.x * 10000, y: targetCenter.y + endNorm.y * 10000 },
      targetShape
    );
    endPt = hit.point;
  }

  const pts: Point2D[] = [startPt];

  if (startNorm.x !== 0) {
    // Exiting horizontally
    if (endNorm.x !== 0) {
      if (startNorm.x !== endNorm.x && (endPt.x - startPt.x) * startNorm.x > 0) {
        if (Math.abs(startPt.y - endPt.y) < 1 && parallelOffset !== 0) {
          const jogY = startPt.y + parallelOffset;
          const midX = (startPt.x + endPt.x) / 2;
          const halfSpan = Math.min(20, Math.abs(endPt.x - startPt.x) / 4);
          const dirX = endPt.x >= startPt.x ? 1 : -1;
          const midX1 = midX - dirX * halfSpan;
          const midX2 = midX + dirX * halfSpan;
          pts.push({ x: midX1, y: startPt.y });
          pts.push({ x: midX1, y: jogY });
          pts.push({ x: midX2, y: jogY });
          pts.push({ x: midX2, y: endPt.y });
        } else {
          const midX = (startPt.x + endPt.x) / 2 + parallelOffset;
          pts.push({ x: midX, y: startPt.y });
          pts.push({ x: midX, y: endPt.y });
        }
      } else {
        const cX1 = startPt.x + startNorm.x * 24;
        const cX2 = endPt.x + endNorm.x * 24;
        const midY = (startPt.y + endPt.y) / 2 + parallelOffset;
        pts.push({ x: cX1, y: startPt.y });
        pts.push({ x: cX1, y: midY });
        pts.push({ x: cX2, y: midY });
        pts.push({ x: cX2, y: endPt.y });
      }
    } else {
      if (startNorm.x * (endPt.x - startPt.x) > 0 && endNorm.y * (startPt.y - endPt.y) > 0) {
        pts.push({ x: endPt.x, y: startPt.y });
      } else {
        const cX = startPt.x + startNorm.x * 24;
        const cY = endPt.y + endNorm.y * 24;
        pts.push({ x: cX, y: startPt.y });
        pts.push({ x: cX, y: cY });
        pts.push({ x: endPt.x, y: cY });
      }
    }
  } else {
    // Exiting vertically
    if (endNorm.y !== 0) {
      if (startNorm.y !== endNorm.y && (endPt.y - startPt.y) * startNorm.y > 0) {
        if (Math.abs(startPt.x - endPt.x) < 1 && parallelOffset !== 0) {
          const jogX = startPt.x + parallelOffset;
          const midY = (startPt.y + endPt.y) / 2;
          const halfSpan = Math.min(20, Math.abs(endPt.y - startPt.y) / 4);
          const dirY = endPt.y >= startPt.y ? 1 : -1;
          const midY1 = midY - dirY * halfSpan;
          const midY2 = midY + dirY * halfSpan;
          pts.push({ x: startPt.x, y: midY1 });
          pts.push({ x: jogX, y: midY1 });
          pts.push({ x: jogX, y: midY2 });
          pts.push({ x: endPt.x, y: midY2 });
        } else {
          const midY = (startPt.y + endPt.y) / 2 + parallelOffset;
          pts.push({ x: startPt.x, y: midY });
          pts.push({ x: endPt.x, y: midY });
        }
      } else {
        const cY1 = startPt.y + startNorm.y * 24;
        const cY2 = endPt.y + endNorm.y * 24;
        const midX = (startPt.x + endPt.x) / 2 + parallelOffset;
        pts.push({ x: startPt.x, y: cY1 });
        pts.push({ x: midX, y: cY1 });
        pts.push({ x: midX, y: cY2 });
        pts.push({ x: endPt.x, y: cY2 });
      }
    } else {
      if (startNorm.y * (endPt.y - startPt.y) > 0 && endNorm.x * (startPt.x - endPt.x) > 0) {
        pts.push({ x: startPt.x, y: endPt.y });
      } else {
        const cY = startPt.y + startNorm.y * 24;
        const cX = endPt.x + endNorm.x * 24;
        pts.push({ x: startPt.x, y: cY });
        pts.push({ x: cX, y: cY });
        pts.push({ x: cX, y: endPt.y });
      }
    }
  }

  pts.push(endPt);

  const routedPts = gridifyOrthogonalRoute(
    pts,
    sourceRect,
    targetRect,
    sourceShape,
    targetShape,
    startNorm,
    endNorm
  );

  // Filter consecutive duplicate / collinear points
  const cleanPts: Point2D[] = [routedPts[0]];
  for (let i = 1; i < routedPts.length; i++) {
    const prev = cleanPts[cleanPts.length - 1];
    const curr = routedPts[i];
    if (Math.abs(prev.x - curr.x) < 0.5 && Math.abs(prev.y - curr.y) < 0.5) {
      continue;
    }
    if (cleanPts.length >= 2) {
      const before = cleanPts[cleanPts.length - 2];
      if (
        (Math.abs(before.x - prev.x) < 0.5 && Math.abs(prev.x - curr.x) < 0.5) ||
        (Math.abs(before.y - prev.y) < 0.5 && Math.abs(prev.y - curr.y) < 0.5)
      ) {
        cleanPts[cleanPts.length - 1] = curr;
        continue;
      }
    }
    cleanPts.push(curr);
  }

  const firstP = cleanPts[0];
  const secondP = cleanPts[1] ?? firstP;
  const seg0Dx = secondP.x - firstP.x;
  const seg0Dy = secondP.y - firstP.y;
  const seg0Len = Math.hypot(seg0Dx, seg0Dy) || 1;
  const startUnitX = seg0Dx / seg0Len;
  const startUnitY = seg0Dy / seg0Len;
  const effectiveStartTrim = Math.min(startTrim, seg0Len * 0.45);
  const trimmedStart = {
    x: firstP.x + startUnitX * effectiveStartTrim,
    y: firstP.y + startUnitY * effectiveStartTrim
  };
  const startAngleDeg = (Math.atan2(-startUnitY, -startUnitX) * 180) / Math.PI;

  const lastP = cleanPts[cleanPts.length - 1];
  const secondLastP = cleanPts[cleanPts.length - 2] ?? lastP;
  const segNDx = lastP.x - secondLastP.x;
  const segNDy = lastP.y - secondLastP.y;
  const segNLen = Math.hypot(segNDx, segNDy) || 1;
  const endUnitX = segNDx / segNLen;
  const endUnitY = segNDy / segNLen;
  const effectiveEndTrim = Math.min(endTrim, segNLen * 0.45);
  const trimmedEnd = {
    x: lastP.x - endUnitX * effectiveEndTrim,
    y: lastP.y - endUnitY * effectiveEndTrim
  };
  const endAngleDeg = (Math.atan2(endUnitY, endUnitX) * 180) / Math.PI;

  const hitPathD =
    `M ${cleanPts[0].x} ${cleanPts[0].y} ` + cleanPts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
  const pathD =
    `M ${trimmedStart.x} ${trimmedStart.y} ` +
    cleanPts.slice(1, -1).map((p) => `L ${p.x} ${p.y}`).join(' ') +
    (cleanPts.length > 1 ? ` L ${trimmedEnd.x} ${trimmedEnd.y}` : '');

  // Place label along the longest segment by default, or on the middle segment if there is enough space
  let maxSegLen = -1;
  let maxSegIdx = 0;
  for (let i = 0; i < cleanPts.length - 1; i++) {
    const len = Math.hypot(cleanPts[i + 1].x - cleanPts[i].x, cleanPts[i + 1].y - cleanPts[i].y);
    if (len > maxSegLen) {
      maxSegLen = len;
      maxSegIdx = i;
    }
  }

  const numSegments = cleanPts.length - 1;
  let selectedSegIdx = maxSegIdx;

  if (numSegments >= 3) {
    const midSegIdx = Math.floor(numSegments / 2);
    const pMidA = cleanPts[midSegIdx];
    const pMidB = cleanPts[midSegIdx + 1];
    const midLen = Math.hypot(pMidB.x - pMidA.x, pMidB.y - pMidA.y);
    const isMidHoriz = Math.abs(pMidA.y - pMidB.y) < 1;

    // Label dimensions: along horizontal segment need label width; along vertical segment need label height
    const text = (labelText ?? '').trim();
    const labelWidth = text.length > 0 ? text.length * 7.6 + 16 : 48;
    const labelHeight = 20;
    const padding = 8;
    const requiredSpace = isMidHoriz ? labelWidth + padding : labelHeight + padding;

    if (midLen >= requiredSpace) {
      selectedSegIdx = midSegIdx;
    }
  }

  const pA = cleanPts[selectedSegIdx];
  const pB = cleanPts[selectedSegIdx + 1] ?? pA;
  const mX = (pA.x + pB.x) / 2;
  const mY = (pA.y + pB.y) / 2;
  const labelPoint = { x: mX, y: mY };

  return {
    pathD,
    hitPathD,
    startTip: firstP,
    endTip: lastP,
    startAngleDeg,
    endAngleDeg,
    labelPoint
  };
}

/**
 * Computes tangent-aware path geometry and path-trimming for hollow/filled endpoint decorations
 * so strokes never bleed through hollow diamonds/triangles/circles/squares.
 */
export function computeUmlEdgeGeometry(
  sourceRect: UmlNodeLayout,
  targetRect: UmlNodeLayout,
  routing: UmlRoutingKind | 'default' = 'orthogonal',
  startDec?: EndpointDecoration,
  endDec?: EndpointDecoration,
  parallelOffset = 0,
  sourceAnchorOverride?: BoundaryIntersectionResult,
  targetAnchorOverride?: BoundaryIntersectionResult,
  sourceShape?: UmlShapeGeometry,
  targetShape?: UmlShapeGeometry,
  labelText?: string
): ComputedUmlEdgeGeometry {
  const effectiveRouting: UmlRoutingKind = routing === 'default' ? 'orthogonal' : routing;

  // Handle self-loop gracefully if source and target are the same node and no distinct port overrides
  if (
    !sourceAnchorOverride &&
    !targetAnchorOverride &&
    sourceRect.x === targetRect.x &&
    sourceRect.y === targetRect.y &&
    sourceRect.width === targetRect.width &&
    sourceRect.height === targetRect.height
  ) {
    const startShape = getEndpointShape(startDec?.shape ?? 'none');
    const endShape = getEndpointShape(endDec?.shape ?? 'none');
    const startSize = startDec?.size ?? startShape?.defaultSize ?? 10;
    const endSize = endDec?.size ?? endShape?.defaultSize ?? 11;
    const startTrim = (startShape?.trimMultiplier ?? 0) * startSize;
    const endTrim = (endShape?.trimMultiplier ?? 0) * endSize;

    if (effectiveRouting === 'orthogonal') {
      const startTip = { x: sourceRect.x + sourceRect.width * 0.75, y: sourceRect.y };
      const endTip = { x: sourceRect.x + sourceRect.width, y: sourceRect.y + sourceRect.height * 0.35 };
      const p1 = { x: startTip.x, y: sourceRect.y - 30 };
      const p2 = { x: sourceRect.x + sourceRect.width + 30, y: sourceRect.y - 30 };
      const p3 = { x: sourceRect.x + sourceRect.width + 30, y: endTip.y };
      const trimmedStart = { x: startTip.x, y: startTip.y - startTrim };
      const trimmedEnd = { x: endTip.x + endTrim, y: endTip.y };
      const pathD = `M ${trimmedStart.x} ${trimmedStart.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${trimmedEnd.x} ${trimmedEnd.y}`;
      const hitPathD = `M ${startTip.x} ${startTip.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${endTip.x} ${endTip.y}`;
      return {
        pathD,
        hitPathD,
        startTip,
        endTip,
        startAngleDeg: 90,
        endAngleDeg: 180,
        labelPoint: { x: (p1.x + p2.x) / 2, y: p1.y }
      };
    }

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
      labelPoint: {
        x: 0.125 * startTip.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * endTip.x,
        y: 0.125 * startTip.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * endTip.y
      }
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
    sourceAnchorOverride ?? computeShapeBoundaryIntersection(sourceRect, targetCenter, sourceShape);
  const tgtHit =
    targetAnchorOverride ?? computeShapeBoundaryIntersection(targetRect, sourceCenter, targetShape);

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

  if (effectiveRouting === 'bezier') {
    return computeBezierRoute(startTip, endTip, srcHit.normal, tgtHit.normal, startTrim, endTrim);
  }

  if (effectiveRouting === 'orthogonal') {
    return computeOrthogonalRoute(
      sourceRect,
      targetRect,
      srcHit,
      tgtHit,
      startTrim,
      endTrim,
      parallelOffset,
      sourceAnchorOverride,
      targetAnchorOverride,
      sourceShape,
      targetShape,
      labelText
    );
  }

  // Straight routing
  return computeStraightRoute(startTip, endTip, startTrim, endTrim);
}
