import type { Point2D } from './vector';

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

/**
 * Trims an SVG path string inward along its tangent vectors at start and end points
 * so stroke lines do not visibly bleed through hollow/filled endpoint decorations.
 */
export function trimPathForEndpoints(
  pathData: string,
  trimStart: number,
  trimEnd: number
): string {
  if (trimStart <= 0 && trimEnd <= 0) {
    return pathData;
  }

  // Handle cubic bezier path: M x0 y0 C c1x c1y, c2x c2y, x1 y1
  const bezierMatch = pathData.match(
    /^M\s*(-?[\d.]+)\s+(-?[\d.]+)\s*C\s*(-?[\d.]+)\s+(-?[\d.]+)[,\s]+(-?[\d.]+)\s+(-?[\d.]+)[,\s]+(-?[\d.]+)\s+(-?[\d.]+)$/
  );
  if (bezierMatch) {
    const x0 = parseFloat(bezierMatch[1]);
    const y0 = parseFloat(bezierMatch[2]);
    const c1x = parseFloat(bezierMatch[3]);
    const c1y = parseFloat(bezierMatch[4]);
    const c2x = parseFloat(bezierMatch[5]);
    const c2y = parseFloat(bezierMatch[6]);
    const x1 = parseFloat(bezierMatch[7]);
    const y1 = parseFloat(bezierMatch[8]);

    const dist = Math.hypot(x1 - x0, y1 - y0) || 1;
    const sVx = x0 - c1x;
    const sVy = y0 - c1y;
    const sLen = Math.hypot(sVx, sVy) || 1;
    const sUnitX = sVx / sLen;
    const sUnitY = sVy / sLen;

    const eVx = x1 - c2x;
    const eVy = y1 - c2y;
    const eLen = Math.hypot(eVx, eVy) || 1;
    const eUnitX = eVx / eLen;
    const eUnitY = eVy / eLen;

    const trimmedStartX = x0 - sUnitX * Math.min(trimStart, dist * 0.4);
    const trimmedStartY = y0 - sUnitY * Math.min(trimStart, dist * 0.4);
    const trimmedEndX = x1 - eUnitX * Math.min(trimEnd, dist * 0.4);
    const trimmedEndY = y1 - eUnitY * Math.min(trimEnd, dist * 0.4);

    return `M ${trimmedStartX} ${trimmedStartY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${trimmedEndX} ${trimmedEndY}`;
  }

  // Handle polyline / straight path: M x0 y0 L x1 y1 ... L xN yN
  const pointMatches = Array.from(pathData.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g));
  if (pointMatches.length < 2) {
    return pathData;
  }

  const pts: Point2D[] = pointMatches.map((m) => ({
    x: parseFloat(m[1]),
    y: parseFloat(m[2])
  }));

  const p0 = pts[0];
  const p1 = pts[1];
  const sDx = p1.x - p0.x;
  const sDy = p1.y - p0.y;
  const sLen = Math.hypot(sDx, sDy) || 1;
  const sUnitX = sDx / sLen;
  const sUnitY = sDy / sLen;
  const effStartTrim = Math.min(trimStart, sLen * 0.45);
  const trimmedStartX = p0.x + sUnitX * effStartTrim;
  const trimmedStartY = p0.y + sUnitY * effStartTrim;

  const lastIdx = pts.length - 1;
  const pLast = pts[lastIdx];
  const pPrev = pts[lastIdx - 1];
  const eDx = pLast.x - pPrev.x;
  const eDy = pLast.y - pPrev.y;
  const eLen = Math.hypot(eDx, eDy) || 1;
  const eUnitX = eDx / eLen;
  const eUnitY = eDy / eLen;
  const effEndTrim = Math.min(trimEnd, eLen * 0.45);
  const trimmedEndX = pLast.x - eUnitX * effEndTrim;
  const trimmedEndY = pLast.y - eUnitY * effEndTrim;

  return (
    `M ${trimmedStartX} ${trimmedStartY} ` +
    pts.slice(1, -1).map((p) => `L ${p.x} ${p.y}`).join(' ') +
    (pts.length > 1 ? ` L ${trimmedEndX} ${trimmedEndY}` : '')
  );
}
