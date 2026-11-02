import type { UmlDocument, UmlNode, UmlNodeLayout } from '../../shared/documents/types';
import { GRID_SIZE, snapToGrid, type Point2D } from '../../shared/geometry';
import {
  FRAME_PAD_BOTTOM,
  FRAME_PAD_LEFT,
  FRAME_PAD_RIGHT,
  FRAME_PAD_TOP
} from './layout-engine';

export interface FrameDragDropResult {
  layoutUpdates: Record<string, UmlNodeLayout>;
  childrenUpdates: Record<string, string[]>;
}

const EMPTY_RESULT: FrameDragDropResult = { layoutUpdates: {}, childrenUpdates: {} };

/**
 * Determines whether the pointer is over a frame's body or label.
 * Frames are checked in reverse document order so the topmost frame wins.
 */
export function findFrameAtPoint(
  doc: UmlDocument | undefined,
  layouts: Record<string, UmlNodeLayout>,
  dropPoint: Point2D
): UmlNode | undefined {
  if (!doc) return undefined;
  for (let index = doc.nodes.length - 1; index >= 0; index--) {
    const node = doc.nodes[index];
    if (node.kind !== 'frame') continue;
    const box = layouts[node.id];
    if (!box) continue;

    const labelWidth = (node.name || 'Frame').length * 7.6 + 16;
    const overLabel =
      dropPoint.x >= box.x + 16 &&
      dropPoint.x <= box.x + 16 + labelWidth &&
      dropPoint.y >= box.y - 10 &&
      dropPoint.y <= box.y + 10;
    const overBody =
      dropPoint.x >= box.x &&
      dropPoint.x <= box.x + box.width &&
      dropPoint.y >= box.y &&
      dropPoint.y <= box.y + box.height;

    if (overLabel || overBody) return node;
  }
  return undefined;
}

/**
 * Computes frame membership and auto-resize updates after a drag.
 * This is a direct behavioral port of the legacy canvas logic.
 */
export function computeFrameDragDropUpdates(
  doc: UmlDocument | undefined,
  layouts: Record<string, UmlNodeLayout>,
  clickedNodeId: string | undefined,
  updates: Record<string, UmlNodeLayout>,
  initialLayouts: Record<string, UmlNodeLayout>,
  dropPoint: Point2D,
  isShift: boolean
): FrameDragDropResult {
  if (!doc) return EMPTY_RESULT;

  const frames = doc.nodes.filter((node) => node.kind === 'frame');
  if (frames.length === 0) return EMPTY_RESULT;

  const clickedNode = doc.nodes.find((node) => node.id === clickedNodeId);
  const movedFrames = Object.keys(updates).filter((id) =>
    doc.nodes.find((node) => node.id === id && node.kind === 'frame')
  );
  if (clickedNode?.kind === 'frame' || movedFrames.length > 0) return EMPTY_RESULT;

  const movedNonFrameIds = Object.keys(updates).filter((id) =>
    doc.nodes.find((node) => node.id === id && node.kind !== 'frame')
  );
  if (movedNonFrameIds.length === 0) return EMPTY_RESULT;

  const hoveredFrame = findFrameAtPoint(doc, layouts, dropPoint);

  const frameChildrenMap = new Map<string, string[]>();
  for (const frame of frames) {
    frameChildrenMap.set(frame.id, [...(frame.children ?? [])]);
  }

  const frameLayoutUpdates: Record<string, UmlNodeLayout> = {};

  if (hoveredFrame) {
    const originalChildren = new Set(hoveredFrame.children ?? []);
    const hoveredChildren = frameChildrenMap.get(hoveredFrame.id)!;
    let anyNewElementAdded = false;
    let anyShiftExistingResized = false;

    for (const nodeId of movedNonFrameIds) {
      const initialBox = initialLayouts[nodeId];
      const frameInitialBox = initialLayouts[hoveredFrame.id] ?? layouts[hoveredFrame.id];
      const wasSpatiallyInside =
        initialBox && frameInitialBox
          ? initialBox.x >= frameInitialBox.x &&
            initialBox.y >= frameInitialBox.y &&
            initialBox.x + initialBox.width <= frameInitialBox.x + frameInitialBox.width &&
            initialBox.y + initialBox.height <= frameInitialBox.y + frameInitialBox.height
          : false;
      const wasAlreadyInside = originalChildren.has(nodeId) || wasSpatiallyInside;

      if (!hoveredChildren.includes(nodeId)) hoveredChildren.push(nodeId);
      if (!wasAlreadyInside) {
        anyNewElementAdded = true;
      } else if (isShift) {
        anyShiftExistingResized = true;
      }

      for (const frame of frames) {
        if (frame.id === hoveredFrame.id) continue;
        const otherChildren = frameChildrenMap.get(frame.id);
        if (!otherChildren) continue;
        const childIndex = otherChildren.indexOf(nodeId);
        if (childIndex !== -1) otherChildren.splice(childIndex, 1);
      }
    }

    if (anyNewElementAdded || anyShiftExistingResized) {
      const persistedFrameBox = doc.layout.nodes[hoveredFrame.id];
      let frameBox: UmlNodeLayout = {
        ...(initialLayouts[hoveredFrame.id] ??
          persistedFrameBox ?? { x: 0, y: 0, width: 260, height: 180 })
      };

      for (const childId of hoveredChildren) {
        const childBox = updates[childId] ?? layouts[childId];
        if (!childBox) continue;

        const frameX = Math.min(frameBox.x, snapToGrid(childBox.x - FRAME_PAD_LEFT, GRID_SIZE));
        const frameY = Math.min(frameBox.y, snapToGrid(childBox.y - FRAME_PAD_TOP, GRID_SIZE));
        const frameRight = Math.max(
          frameBox.x + frameBox.width,
          snapToGrid(childBox.x + childBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
        );
        const frameBottom = Math.max(
          frameBox.y + frameBox.height,
          snapToGrid(childBox.y + childBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
        );
        const width = Math.max(160, frameRight - frameX);
        const height = Math.max(120, frameBottom - frameY);

        if (
          frameX !== frameBox.x ||
          frameY !== frameBox.y ||
          width !== frameBox.width ||
          height !== frameBox.height
        ) {
          frameBox = { x: frameX, y: frameY, width, height };
        }
      }

      const documentBox = doc.layout.nodes[hoveredFrame.id];
      if (
        !documentBox ||
        frameBox.x !== documentBox.x ||
        frameBox.y !== documentBox.y ||
        frameBox.width !== documentBox.width ||
        frameBox.height !== documentBox.height
      ) {
        frameLayoutUpdates[hoveredFrame.id] = frameBox;
      }
    }
  } else {
    for (const nodeId of movedNonFrameIds) {
      for (const frame of frames) {
        const children = frameChildrenMap.get(frame.id);
        if (!children) continue;
        const childIndex = children.indexOf(nodeId);
        if (childIndex !== -1) children.splice(childIndex, 1);
      }
    }
  }

  const changedChildren: Record<string, string[]> = {};
  for (const [frameId, children] of frameChildrenMap.entries()) {
    const frame = doc.nodes.find((node) => node.id === frameId);
    if (frame && JSON.stringify(frame.children ?? []) !== JSON.stringify(children)) {
      changedChildren[frameId] = children;
    }
  }

  return { layoutUpdates: frameLayoutUpdates, childrenUpdates: changedChildren };
}
