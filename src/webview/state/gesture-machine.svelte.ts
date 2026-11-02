import type { UmlNodeLayout } from '../../shared/documents/types';
import type { Point2D } from '../../shared/geometry';

export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export type GestureState =
  | { mode: 'idle' }
  | { mode: 'panning'; startScreenX: number; startScreenY: number; initialPanX: number; initialPanY: number }
  | { mode: 'marquee'; startWorld: Point2D; currentWorld: Point2D }
  | {
      mode: 'moving_nodes';
      startWorld: Point2D;
      currentWorld: Point2D;
      initialLayouts: Record<string, UmlNodeLayout>;
      clickedNodeId?: string;
      isShift: boolean;
    }
  | {
      mode: 'resizing_node';
      nodeId: string;
      handle: ResizeHandle;
      startWorld: Point2D;
      currentWorld: Point2D;
      initialBox: UmlNodeLayout;
      minWidth: number;
      minHeight: number;
      childBounds?: Bounds;
    }
  | { mode: 'connecting_edge'; sourceNodeId: string; startPoint: Point2D; currentWorld: Point2D };

/**
 * Pure finite-state machine for pointer gestures.
 * It owns only transition state; layout derivation and document dispatch live elsewhere.
 */
export class GestureStateMachine {
  gesture = $state<GestureState>({ mode: 'idle' });

  get mode(): GestureState['mode'] {
    return this.gesture.mode;
  }

  get isIdle(): boolean {
    return this.gesture.mode === 'idle';
  }

  startPan(screenX: number, screenY: number, panX: number, panY: number): void {
    this.gesture = {
      mode: 'panning',
      startScreenX: screenX,
      startScreenY: screenY,
      initialPanX: panX,
      initialPanY: panY
    };
  }

  startMarquee(startWorld: Point2D): void {
    this.gesture = { mode: 'marquee', startWorld, currentWorld: startWorld };
  }

  startMove(
    startWorld: Point2D,
    initialLayouts: Record<string, UmlNodeLayout>,
    clickedNodeId?: string,
    isShift = false
  ): void {
    this.gesture = {
      mode: 'moving_nodes',
      startWorld,
      currentWorld: startWorld,
      initialLayouts,
      clickedNodeId,
      isShift
    };
  }

  startResize(
    nodeId: string,
    handle: ResizeHandle,
    startWorld: Point2D,
    initialBox: UmlNodeLayout,
    minWidth: number,
    minHeight: number,
    childBounds?: Bounds
  ): void {
    this.gesture = {
      mode: 'resizing_node',
      nodeId,
      handle,
      startWorld,
      currentWorld: startWorld,
      initialBox,
      minWidth,
      minHeight,
      childBounds
    };
  }

  startConnect(sourceNodeId: string, startPoint: Point2D, currentWorld: Point2D): void {
    this.gesture = { mode: 'connecting_edge', sourceNodeId, startPoint, currentWorld };
  }

  updatePoint(point: Point2D): void {
    const current = this.gesture;
    if (current.mode === 'idle' || current.mode === 'panning') return;
    this.gesture = { ...current, currentWorld: point };
  }

  setShift(isShift: boolean): void {
    if (this.gesture.mode !== 'moving_nodes') return;
    this.gesture = { ...this.gesture, isShift };
  }

  updatePan(screenX: number, screenY: number): { panX: number; panY: number } | null {
    if (this.gesture.mode !== 'panning') return null;
    return {
      panX: this.gesture.initialPanX + (screenX - this.gesture.startScreenX),
      panY: this.gesture.initialPanY + (screenY - this.gesture.startScreenY)
    };
  }

  end(): GestureState | null {
    const current = this.gesture;
    if (current.mode === 'idle') return null;
    this.gesture = { mode: 'idle' };
    return current;
  }

  cancel(): void {
    this.gesture = { mode: 'idle' };
  }
}
