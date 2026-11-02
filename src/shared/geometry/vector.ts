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

export function screenToWorld(point: Point2D, viewport: ViewportTransform): Point2D;
export function screenToWorld(
  screenX: number,
  screenY: number,
  viewport: ViewportTransform
): Point2D;
export function screenToWorld(
  xOrPoint: number | Point2D,
  yOrViewport: number | ViewportTransform,
  maybeViewport?: ViewportTransform
): Point2D {
  let screenX: number;
  let screenY: number;
  let viewport: ViewportTransform;

  if (typeof xOrPoint === 'object' && xOrPoint !== null) {
    screenX = xOrPoint.x;
    screenY = xOrPoint.y;
    viewport = yOrViewport as ViewportTransform;
  } else {
    screenX = xOrPoint;
    screenY = yOrViewport as number;
    viewport = maybeViewport!;
  }

  const zoom = Number.isFinite(viewport?.zoom) && viewport.zoom > 0 ? viewport.zoom : 1;
  const panX = Number.isFinite(viewport?.panX) ? viewport.panX : 0;
  const panY = Number.isFinite(viewport?.panY) ? viewport.panY : 0;

  return {
    x: (screenX - panX) / zoom,
    y: (screenY - panY) / zoom
  };
}

export function worldToScreen(point: Point2D, viewport: ViewportTransform): Point2D;
export function worldToScreen(
  worldX: number,
  worldY: number,
  viewport: ViewportTransform
): Point2D;
export function worldToScreen(
  xOrPoint: number | Point2D,
  yOrViewport: number | ViewportTransform,
  maybeViewport?: ViewportTransform
): Point2D {
  let worldX: number;
  let worldY: number;
  let viewport: ViewportTransform;

  if (typeof xOrPoint === 'object' && xOrPoint !== null) {
    worldX = xOrPoint.x;
    worldY = xOrPoint.y;
    viewport = yOrViewport as ViewportTransform;
  } else {
    worldX = xOrPoint;
    worldY = yOrViewport as number;
    viewport = maybeViewport!;
  }

  const zoom = Number.isFinite(viewport?.zoom) && viewport.zoom > 0 ? viewport.zoom : 1;
  const panX = Number.isFinite(viewport?.panX) ? viewport.panX : 0;
  const panY = Number.isFinite(viewport?.panY) ? viewport.panY : 0;

  return {
    x: worldX * zoom + panX,
    y: worldY * zoom + panY
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
 * Returns true when `inner` lies entirely within `outer`; boundary contact counts as inside.
 */
export function rectContainsRect(outer: Rect2D, inner: Rect2D): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}
