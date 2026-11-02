import type { UmlDocument, UmlEdge, UmlNode, UmlNodeLayout } from '../../shared/documents/types';
import { GRID_SIZE, snapToGrid, type Rect2D } from '../../shared/geometry';
import type { GestureState } from '../state/gesture-machine.svelte';

export const FRAME_PAD_LEFT = 20;
export const FRAME_PAD_RIGHT = 20;
export const FRAME_PAD_TOP = 28;
export const FRAME_PAD_BOTTOM = 20;

export interface MinSize {
  minWidth: number;
  minHeight: number;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export type NodeLayoutMap = Record<string, UmlNodeLayout>;

export interface InlineDraftSnapshot {
  name?: string;
  text?: string;
  attributes?: string;
  operations?: string;
}

/**
 * Conservative estimate of how many wrapped lines a note's text will occupy.
 * Word wrapping can produce more lines than a pure character count, so the
 * usable character budget is reduced by 15% and rounded down.
 */
function estimateNoteLineCount(text: string, width: number): number {
  const usableWidth = Math.max(24, width - 22);
  const charsPerLine = Math.max(6, Math.floor((usableWidth / 6.4) * 0.85));
  let lines = 0;
  for (const rawLine of (text || '').split('\n')) {
    lines += Math.max(1, Math.ceil(rawLine.length / charsPerLine));
  }
  return Math.max(1, lines);
}

/**
 * Deterministic, DOM-free minimum size estimate.
 * Keeping this pure avoids forced synchronous layout during drag and resize.
 */
export function computeNodeMinSize(
  node: UmlNode,
  isEditing = false,
  width = 220,
  draft?: InlineDraftSnapshot
): MinSize {
  if (node.kind === 'shape') return { minWidth: 80, minHeight: 60 };
  if (node.kind === 'frame') return { minWidth: 160, minHeight: 120 };

  let contentHeight: number;
  if (isEditing) {
    if (node.kind === 'note') {
      const editedText = draft?.text ?? node.text ?? node.name ?? '';
      const editedName = draft?.name ?? node.name ?? '';
      const lineCount = Math.max(1, estimateNoteLineCount(editedText, width));
      const nameLines = estimateNoteLineCount(editedName, width);
      contentHeight = 52 + Math.max(0, nameLines - 1) * 16 + 20 + lineCount * 18 + 6;
    } else {
      const draftAttrsRows = draft?.attributes?.split('\n').length;
      const draftOpsRows = draft?.operations?.split('\n').length;
      const editAttrsRows = Math.max(1, draftAttrsRows ?? (node.attributes ?? []).length + 1);
      const editOpsRows = Math.max(1, draftOpsRows ?? (node.operations ?? []).length + 1);
      const headerHeight = 100;
      const attrsHeight = node.showAttributes !== false ? 30 + editAttrsRows * 20 : 30;
      const opsHeight = node.showOperations !== false ? 30 + editOpsRows * 20 : 30;
      contentHeight = headerHeight + attrsHeight + opsHeight + 10;
    }
  } else if (node.kind === 'note') {
    // 30px header + wrapped name rows + 16px body padding + 18px line-height + border.
    const lineCount = estimateNoteLineCount(node.text || node.name || '', width);
    const nameLines = estimateNoteLineCount(node.name || '', width);
    contentHeight = 30 + Math.max(0, nameLines - 1) * 16 + 16 + lineCount * 18 + 2;
  } else {
    const headerHeight = (node.stereotype ? 18 : 0) + 36;
    const attrsCount = node.showAttributes !== false ? (node.attributes ?? []).length : 0;
    const opsCount = node.showOperations !== false ? (node.operations ?? []).length : 0;
    const attrsHeight = attrsCount > 0 ? 12 + attrsCount * 19 : 0;
    const opsHeight = opsCount > 0 ? 12 + opsCount * 19 : 0;
    contentHeight = headerHeight + attrsHeight + opsHeight + 4;
  }

  return {
    minWidth: isEditing ? (node.kind === 'note' ? 200 : 240) : node.kind === 'note' ? 100 : 120,
    minHeight: Math.max(60, Math.ceil(contentHeight / GRID_SIZE) * GRID_SIZE)
  };
}

function defaultLayoutFor(node: UmlNode, index: number): UmlNodeLayout {
  return {
    x: 80 + (index % 3) * 260,
    y: 80 + Math.floor(index / 3) * 190,
    width: node.kind === 'frame' ? 260 : 220,
    height: node.kind === 'frame' ? 180 : 140
  };
}

export function computeEffectiveLayouts(
  doc: UmlDocument | undefined,
  optimisticLayouts: NodeLayoutMap,
  gesture: GestureState,
  editingNodeId: string | null,
  editingDraft?: InlineDraftSnapshot
): NodeLayoutMap {
  if (!doc) return {};

  const base: NodeLayoutMap = {};
  doc.nodes.forEach((node, index) => {
    const persisted = doc.layout.nodes[node.id] ?? defaultLayoutFor(node, index);
    const raw = optimisticLayouts[node.id] ?? persisted;
    const minSize = computeNodeMinSize(
      node,
      editingNodeId === node.id,
      raw.width,
      editingNodeId === node.id ? editingDraft : undefined
    );
    base[node.id] = {
      ...raw,
      width: Math.max(minSize.minWidth, snapToGrid(raw.width, GRID_SIZE)),
      height: Math.max(minSize.minHeight, snapToGrid(raw.height, GRID_SIZE))
    };
  });

  if (gesture.mode === 'moving_nodes') {
    const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
    const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
    const snappedDx = snapToGrid(rawDx, GRID_SIZE);
    const snappedDy = snapToGrid(rawDy, GRID_SIZE);

    for (const [id, initial] of Object.entries(gesture.initialLayouts)) {
      base[id] = {
        ...initial,
        x: snapToGrid(initial.x + snappedDx, GRID_SIZE),
        y: snapToGrid(initial.y + snappedDy, GRID_SIZE)
      };
    }

    if (gesture.isShift) {
      for (const node of doc.nodes) {
        if (node.kind !== 'frame' || !node.children || node.children.length === 0) continue;
        const movingChildBoxes = node.children
          .filter((childId) => childId in gesture.initialLayouts)
          .map((childId) => base[childId])
          .filter((box): box is UmlNodeLayout => Boolean(box));
        if (movingChildBoxes.length === 0) continue;

        const currentBox = base[node.id];
        if (!currentBox) continue;

        const minX = Math.min(...movingChildBoxes.map((box) => box.x));
        const minY = Math.min(...movingChildBoxes.map((box) => box.y));
        const maxX = Math.max(...movingChildBoxes.map((box) => box.x + box.width));
        const maxY = Math.max(...movingChildBoxes.map((box) => box.y + box.height));
        const frameX = Math.min(currentBox.x, snapToGrid(minX - FRAME_PAD_LEFT, GRID_SIZE));
        const frameY = Math.min(currentBox.y, snapToGrid(minY - FRAME_PAD_TOP, GRID_SIZE));
        const frameRight = Math.max(
          currentBox.x + currentBox.width,
          snapToGrid(maxX + FRAME_PAD_RIGHT, GRID_SIZE)
        );
        const frameBottom = Math.max(
          currentBox.y + currentBox.height,
          snapToGrid(maxY + FRAME_PAD_BOTTOM, GRID_SIZE)
        );

        base[node.id] = {
          x: frameX,
          y: frameY,
          width: Math.max(160, frameRight - frameX),
          height: Math.max(120, frameBottom - frameY)
        };
      }
    }
  } else if (gesture.mode === 'resizing_node') {
    const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
    const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
    const minWidth = gesture.minWidth;
    let minHeight = gesture.minHeight;
    const initial = gesture.initialBox;
    const direction = gesture.handle;
    const childBounds = gesture.childBounds;

    // A note's wrapped-text height depends on its width, so recompute the
    // minimum height while its width is being dragged.
    const resizingNode = doc.nodes.find((candidate) => candidate.id === gesture.nodeId);
    if (resizingNode?.kind === 'note') {
      const widthGuess =
        direction === 'e' || direction === 'ne' || direction === 'se'
          ? initial.width + rawDx
          : direction === 'w' || direction === 'nw' || direction === 'sw'
            ? initial.width - rawDx
            : initial.width;
      minHeight = Math.max(
        minHeight,
        computeNodeMinSize(resizingNode, false, Math.max(40, widthGuess)).minHeight
      );
    }

    base[gesture.nodeId] = resolveResizeBox(
      initial,
      direction,
      rawDx,
      rawDy,
      minWidth,
      minHeight,
      childBounds
    );
  }

  if (editingNodeId) {
    for (const node of doc.nodes) {
      if (node.kind !== 'frame' || !node.children || !node.children.includes(editingNodeId)) continue;
      const editedBox = base[editingNodeId];
      const currentBox = base[node.id];
      if (!editedBox || !currentBox) continue;

      const right = Math.max(
        currentBox.x + currentBox.width,
        snapToGrid(editedBox.x + editedBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
      );
      const bottom = Math.max(
        currentBox.y + currentBox.height,
        snapToGrid(editedBox.y + editedBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
      );
      if (right > currentBox.x + currentBox.width || bottom > currentBox.y + currentBox.height) {
        base[node.id] = {
          ...currentBox,
          width: Math.max(currentBox.width, right - currentBox.x),
          height: Math.max(currentBox.height, bottom - currentBox.y)
        };
      }
    }
  }

  return base;
}

export function resolveResizeBox(
  initial: UmlNodeLayout,
  direction: string,
  rawDx: number,
  rawDy: number,
  minWidth: number,
  minHeight: number,
  childBounds?: Bounds
): UmlNodeLayout {
  let newX = initial.x;
  let newY = initial.y;
  let newWidth = initial.width;
  let newHeight = initial.height;

  if (direction === 'e' || direction === 'ne' || direction === 'se') {
    const minRight = childBounds ? snapToGrid(childBounds.maxX + FRAME_PAD_RIGHT, GRID_SIZE) : initial.x + minWidth;
    const targetWidth = initial.width + rawDx;
    newWidth = Math.max(minWidth, minRight - initial.x, snapToGrid(targetWidth, GRID_SIZE));
  } else if (direction === 'w' || direction === 'nw' || direction === 'sw') {
    const rightEdge = initial.x + initial.width;
    const maxLeft = childBounds ? snapToGrid(childBounds.minX - FRAME_PAD_LEFT, GRID_SIZE) : rightEdge - minWidth;
    const targetX = initial.x + rawDx;
    newX = Math.min(rightEdge - minWidth, maxLeft, snapToGrid(targetX, GRID_SIZE));
    newWidth = rightEdge - newX;
  }

  if (direction === 's' || direction === 'sw' || direction === 'se') {
    const minBottom = childBounds ? snapToGrid(childBounds.maxY + FRAME_PAD_BOTTOM, GRID_SIZE) : initial.y + minHeight;
    const targetHeight = initial.height + rawDy;
    newHeight = Math.max(minHeight, minBottom - initial.y, snapToGrid(targetHeight, GRID_SIZE));
  } else if (direction === 'n' || direction === 'nw' || direction === 'ne') {
    const bottomEdge = initial.y + initial.height;
    const maxTop = childBounds ? snapToGrid(childBounds.minY - FRAME_PAD_TOP, GRID_SIZE) : bottomEdge - minHeight;
    const targetY = initial.y + rawDy;
    newY = Math.min(bottomEdge - minHeight, maxTop, snapToGrid(targetY, GRID_SIZE));
    newHeight = bottomEdge - newY;
  }

  return {
    x: newX,
    y: newY,
    width: Math.max(minWidth, newWidth),
    height: Math.max(minHeight, newHeight)
  };
}

export function computeFrameChildBounds(
  frame: UmlNode,
  layouts: NodeLayoutMap
): Bounds | undefined {
  if (!frame.children || frame.children.length === 0) return undefined;
  const boxes = frame.children
    .map((childId) => layouts[childId])
    .filter((box): box is UmlNodeLayout => Boolean(box));
  if (boxes.length === 0) return undefined;

  return {
    minX: Math.min(...boxes.map((box) => box.x)),
    minY: Math.min(...boxes.map((box) => box.y)),
    maxX: Math.max(...boxes.map((box) => box.x + box.width)),
    maxY: Math.max(...boxes.map((box) => box.y + box.height))
  };
}

/**
 * Spreads relations that connect the same node pair so they do not overlap.
 */
export function computeParallelEdgeOffsets(edges: UmlEdge[]): Record<string, number> {
  const pairGroups = new Map<string, string[]>();
  for (const edge of edges) {
    const pairKey = [edge.source.nodeId, edge.target.nodeId].sort().join('::');
    const group = pairGroups.get(pairKey) ?? [];
    group.push(edge.id);
    pairGroups.set(pairKey, group);
  }

  const offsets: Record<string, number> = {};
  for (const group of pairGroups.values()) {
    if (group.length <= 1) {
      offsets[group[0]] = 0;
    } else {
      const mid = (group.length - 1) / 2;
      group.forEach((id, index) => {
        offsets[id] = (index - mid) * 22;
      });
    }
  }
  return offsets;
}

export function computeContentBounds(layouts: NodeLayoutMap): Rect2D | null {
  const boxes = Object.values(layouts);
  if (boxes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const box of boxes) {
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
