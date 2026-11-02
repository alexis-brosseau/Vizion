import type { UmlNodeLayout, UmlShapeGeometry } from '../documents/types';
import type { Point2D } from './vector';

export interface BoundaryIntersectionResult {
  point: Point2D;
  normal: Point2D;
}

/**
 * Computes the intersection point on the boundary of `rect` for a ray starting at the center
 * of `rect` and pointing toward `externalPoint`, plus the outward normal vector.
 */
export function computeRectBoundaryIntersection(
  rect: UmlNodeLayout,
  externalPoint: Point2D
): BoundaryIntersectionResult {
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
): BoundaryIntersectionResult {
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
