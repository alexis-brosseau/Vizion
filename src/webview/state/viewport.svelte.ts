import type { Rect2D } from '../../shared/geometry';

export interface ViewportTransform {
  panX: number;
  panY: number;
  zoom: number;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;
const DEFAULT_VIEWPORT: ViewportTransform = { panX: 40, panY: 40, zoom: 1 };

/**
 * Owns camera state for the active custom editor tab.
 * Pan/zoom are intentionally rounded to keep serialized view preferences stable.
 */
export class ViewportController {
  panX = $state(DEFAULT_VIEWPORT.panX);
  panY = $state(DEFAULT_VIEWPORT.panY);
  zoom = $state(DEFAULT_VIEWPORT.zoom);

  get transform(): ViewportTransform {
    return { panX: this.panX, panY: this.panY, zoom: this.zoom };
  }

  setViewport(next: ViewportTransform): void {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next.zoom));
    this.panX = Math.round(next.panX * 10) / 10;
    this.panY = Math.round(next.panY * 10) / 10;
    this.zoom = Math.round(clampedZoom * 1000) / 1000;
  }

  resetZoom(): void {
    this.setViewport(DEFAULT_VIEWPORT);
  }

  panBy(dx: number, dy: number): void {
    this.setViewport({ panX: this.panX + dx, panY: this.panY + dy, zoom: this.zoom });
  }

  /**
   * Zooms around a cursor position expressed in viewport-local pixels.
   * Keeps the world point under the cursor stationary.
   */
  zoomAt(cursorX: number, cursorY: number, factor: number): void {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));
    const scaleChange = nextZoom / this.zoom;
    this.setViewport({
      zoom: nextZoom,
      panX: cursorX - (cursorX - this.panX) * scaleChange,
      panY: cursorY - (cursorY - this.panY) * scaleChange
    });
  }

  /**
   * Fits the supplied world-space content bounds into the viewport.
   * Measurement of the viewport element is the caller's responsibility and
   * should happen only on explicit fit commands, never during a gesture.
   */
  fitContent(bounds: Rect2D, viewportWidth: number, viewportHeight: number, padding = 60): void {
    const contentWidth = Math.max(200, bounds.width + padding * 2);
    const contentHeight = Math.max(200, bounds.height + padding * 2);
    const viewWidth = Math.max(300, viewportWidth);
    const viewHeight = Math.max(300, viewportHeight);
    const zoom = Math.min(1.5, Math.max(MIN_ZOOM, Math.min(viewWidth / contentWidth, viewHeight / contentHeight)));

    this.setViewport({
      zoom,
      panX: (viewWidth - bounds.width * zoom) / 2 - bounds.x * zoom,
      panY: (viewHeight - bounds.height * zoom) / 2 - bounds.y * zoom
    });
  }
}
