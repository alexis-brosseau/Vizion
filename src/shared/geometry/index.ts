import { getEndpointShape } from '../registry/uml-registry';
import type {
  EndpointDecoration,
  UmlNodeLayout,
  UmlRoutingKind,
  UmlShapeGeometry
} from '../documents/types';

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

/**
 * Computes the intersection point on the boundary of a node (supporting standard rectangles as well
 * as geometric shapes: ellipse, rhombus, trapezoid, parallelogram) for a ray starting at the center
 * of `rect` and pointing toward `externalPoint`, plus the outward normal vector.
 */
export function computeShapeBoundaryIntersection(
  rect: UmlNodeLayout,
  externalPoint: Point2D,
  shape?: UmlShapeGeometry
): { point: Point2D; normal: Point2D } {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const dx = externalPoint.x - cx;
  const dy = externalPoint.y - cy;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return {
      point: { x: rect.x + rect.width, y: cy },
      normal: { x: 1, y: 0 }
    };
  }

  if (!shape || shape === 'rectangle') {
    return computeRectBoundaryIntersection(rect, externalPoint);
  }

  const pad = 2;
  const x0 = rect.x + pad;
  const y0 = rect.y + pad;
  const x1 = rect.x + Math.max(pad + 10, rect.width - pad);
  const y1 = rect.y + Math.max(pad + 10, rect.height - pad);

  if (shape === 'ellipse') {
    const rx = Math.max(5, (x1 - x0) / 2);
    const ry = Math.max(5, (y1 - y0) / 2);
    const denom = Math.hypot(dx / rx, dy / ry);
    const t = denom > 0.0001 ? 1 / denom : 1;
    const px = cx + t * dx;
    const py = cy + t * dy;

    const gX = (px - cx) / (rx * rx);
    const gY = (py - cy) / (ry * ry);
    const gLen = Math.hypot(gX, gY) || 1;
    return {
      point: { x: px, y: py },
      normal: { x: gX / gLen, y: gY / gLen }
    };
  }

  let vertices: Point2D[] = [];
  if (shape === 'rhombus') {
    vertices = [
      { x: cx, y: y0 },
      { x: x1, y: cy },
      { x: cx, y: y1 },
      { x: x0, y: cy }
    ];
  } else if (shape === 'trapezoid') {
    const inset = Math.min(36, (x1 - x0) * 0.2);
    vertices = [
      { x: x0 + inset, y: y0 },
      { x: x1 - inset, y: y0 },
      { x: x1, y: y1 },
      { x: x0, y: y1 }
    ];
  } else if (shape === 'parallelogram') {
    const skew = Math.min(32, (x1 - x0) * 0.18);
    vertices = [
      { x: x0 + skew, y: y0 },
      { x: x1, y: y0 },
      { x: x1 - skew, y: y1 },
      { x: x0, y: y1 }
    ];
  }

  let bestT = Infinity;
  let bestPt: Point2D = { x: rect.x + rect.width, y: cy };
  let bestNorm: Point2D = { x: 1, y: 0 };

  for (let i = 0; i < vertices.length; i++) {
    const A = vertices[i];
    const B = vertices[(i + 1) % vertices.length];
    const vx = B.x - A.x;
    const vy = B.y - A.y;

    const det = dy * vx - dx * vy;
    if (Math.abs(det) < 1e-9) continue;

    const diffX = A.x - cx;
    const diffY = A.y - cy;
    const t = (diffY * vx - diffX * vy) / det;
    const u = (dx * diffY - dy * diffX) / det;

    if (t > 0 && u >= -0.001 && u <= 1.001 && t < bestT) {
      bestT = t;
      bestPt = { x: cx + t * dx, y: cy + t * dy };

      const midX = (A.x + B.x) / 2;
      const midY = (A.y + B.y) / 2;
      let nx = -vy;
      let ny = vx;
      if (nx * (midX - cx) + ny * (midY - cy) < 0) {
        nx = -nx;
        ny = -ny;
      }
      const nLen = Math.hypot(nx, ny) || 1;
      bestNorm = { x: nx / nLen, y: ny / nLen };
    }
  }

  if (bestT < Infinity) {
    if (shape === 'rhombus') {
      // Rhombus corners act like a flat border for clean perpendicular connections (especially in smooth routing)
      const corners = [
        { pt: { x: cx, y: y0 }, norm: { x: 0, y: -1 } }, // top corner acts like top flat border
        { pt: { x: x1, y: cy }, norm: { x: 1, y: 0 } },  // right corner acts like right flat border
        { pt: { x: cx, y: y1 }, norm: { x: 0, y: 1 } },  // bottom corner acts like bottom flat border
        { pt: { x: x0, y: cy }, norm: { x: -1, y: 0 } }  // left corner acts like left flat border
      ];
      const sideLen = Math.hypot(x1 - cx, cy - y0);
      const cornerThreshold = Math.min(22, Math.max(14, sideLen * 0.35));

      let nearestIdx = -1;
      let minD = Infinity;
      for (let i = 0; i < corners.length; i++) {
        const d = Math.hypot(bestPt.x - corners[i].pt.x, bestPt.y - corners[i].pt.y);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }

      if (nearestIdx >= 0 && minD <= cornerThreshold) {
        bestPt = { ...corners[nearestIdx].pt };
        bestNorm = { ...corners[nearestIdx].norm };
      }
    }

    return { point: bestPt, normal: bestNorm };
  }

  return computeRectBoundaryIntersection(rect, externalPoint);
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
  sourceAnchorOverride?: { point: Point2D; normal: Point2D },
  targetAnchorOverride?: { point: Point2D; normal: Point2D },
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

  const fullHitPath = `M ${startTip.x} ${startTip.y} L ${endTip.x} ${endTip.y}`;

  if (effectiveRouting === 'bezier') {
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

  if (effectiveRouting === 'orthogonal') {
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
      if (gapRight >= 0 && (gapRight >= gapBottom && gapRight >= gapTop)) {
        startPt = { x: sRight, y: sourceCenter.y };
        startNorm = { x: 1, y: 0 };
        endPt = { x: tLeft, y: targetCenter.y };
        endNorm = { x: -1, y: 0 };
      } else if (gapLeft >= 0 && (gapLeft >= gapBottom && gapLeft >= gapTop)) {
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
          const midX = (startPt.x + endPt.x) / 2 + parallelOffset;
          pts.push({ x: midX, y: startPt.y });
          pts.push({ x: midX, y: endPt.y });
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
          const midY = (startPt.y + endPt.y) / 2 + parallelOffset;
          pts.push({ x: startPt.x, y: midY });
          pts.push({ x: endPt.x, y: midY });
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

    // Filter consecutive duplicate / collinear points
    const cleanPts: Point2D[] = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const prev = cleanPts[cleanPts.length - 1];
      const curr = pts[i];
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

    const hitPathD = `M ${cleanPts[0].x} ${cleanPts[0].y} ` + cleanPts.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
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
      y: (startTip.y + endTip.y) / 2
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

