import type { UmlShapeGeometry } from '../documents/types';

/**
 * Returns SVG path data for a shape node inside a `width x height` box.
 * Kept in shared geometry so node rendering and PNG export stay identical.
 */
export function buildShapeSvgPath(
  shape: UmlShapeGeometry | undefined,
  width: number,
  height: number
): string {
  const pad = 2;
  const x0 = pad;
  const y0 = pad;
  const x1 = Math.max(pad + 10, width - pad);
  const y1 = Math.max(pad + 10, height - pad);
  const centerX = width / 2;
  const centerY = height / 2;

  switch (shape ?? 'rectangle') {
    case 'ellipse': {
      const rx = (x1 - x0) / 2;
      const ry = (y1 - y0) / 2;
      return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX + rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX - rx} ${centerY} Z`;
    }
    case 'rhombus':
      return `M ${centerX} ${y0} L ${x1} ${centerY} L ${centerX} ${y1} L ${x0} ${centerY} Z`;
    case 'trapezoid': {
      const inset = Math.min(36, (x1 - x0) * 0.2);
      return `M ${x0 + inset} ${y0} L ${x1 - inset} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
    }
    case 'parallelogram': {
      const skew = Math.min(32, (x1 - x0) * 0.18);
      return `M ${x0 + skew} ${y0} L ${x1} ${y0} L ${x1 - skew} ${y1} L ${x0} ${y1} Z`;
    }
    case 'rectangle':
    default:
      return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
  }
}
