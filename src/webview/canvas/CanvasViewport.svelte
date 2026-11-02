<script lang="ts">
  import type {
    EndpointDecoration,
    UmlAttribute,
    UmlDocument,
    UmlEdge,
    UmlNode,
    UmlNodeLayout,
    UmlOperation,
    UmlParameter,
    UmlRelationKind,
    UmlRoutingKind,
    UmlShapeGeometry,
    UmlVisibility
  } from '../../shared/documents/types';
  import {
    buildShapeSvgPath,
    computeShapeBoundaryIntersection,
    computeUmlEdgeGeometry,
    getMultiplicityLabelPoint,
    GRID_SIZE,
    normalizeDragRect,
    rectsIntersect,
    screenToWorld,
    snapToGrid,
    type Point2D,
    type Rect2D
  } from '../../shared/geometry';
  import {
    buildOperationSignature,
    extractOperationParameters,
    formatAttributesToText,
    formatOperationsToText,
    formatVisibilitySign
  } from '../../shared/operations';
  import {
    getEndpointShape,
    getUmlNodeKind,
    listUmlRelationPresets,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import { postToHost } from '../bridge';
  import {
    computeContentBounds,
    computeEffectiveLayouts,
    computeNodeMinSize,
    computeParallelEdgeOffsets
  } from '../services/layout-engine';
  import { computeFrameDragDropUpdates } from '../services/frame-containment';
  import { canvasToPngBase64, canvasToPngBlob, renderDiagramToCanvas } from '../services/diagram-exporter';
  import type { VizionWebviewStore } from '../state.svelte';
  import type { GestureState } from '../state/gesture-machine.svelte';
  import ClassNode from './nodes/ClassNode.svelte';
  import FrameNode from './nodes/FrameNode.svelte';
  import NoteNode from './nodes/NoteNode.svelte';
  import ShapeNode from './nodes/ShapeNode.svelte';
  import UmlEdgeRenderer from './edges/UmlEdgeRenderer.svelte';
  import EdgeLabel from './edges/EdgeLabel.svelte';
  import MultiplicityTag from './edges/MultiplicityTag.svelte';
  import { computeEdgeRenderData } from './edges/edge-geometry';

  let { store }: { store: VizionWebviewStore } = $props();

  let viewportEl = $state<HTMLDivElement | undefined>(undefined);

  // Explicit Gesture State Machine (Section 8)
  type UmlGestureState =
    | { mode: 'idle' }
    | {
        mode: 'panning';
        startScreenX: number;
        startScreenY: number;
        initialPanX: number;
        initialPanY: number;
      }
    | {
        mode: 'marquee';
        startWorld: Point2D;
        currentWorld: Point2D;
      }
    | {
        mode: 'moving';
        startWorld: Point2D;
        currentWorld: Point2D;
        initialLayouts: Record<string, UmlNodeLayout>;
        clickedNodeId?: string;
        isShift?: boolean;
      }
    | {
        mode: 'resizing';
        nodeId: string;
        handleDirection?: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';
        handleOffset?: number;
        startWorld: Point2D;
        currentWorld: Point2D;
        initialBox: UmlNodeLayout;
        minWidth?: number;
        minHeight?: number;
        childBounds?: { minX: number; minY: number; maxX: number; maxY: number };
      }
    | {
        mode: 'connecting';
        sourceNodeId: string;
        startPoint: Point2D;
        currentWorld: Point2D;
      };

  type FrameResizeSide = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

  let gesture = $state<UmlGestureState>({ mode: 'idle' });
  let spacePressed = $state<boolean>(false);
  let inlineEditingNodeId = $state<string | null>(null);
  let inlineEditingEdgeId = $state<string | null>(null);
  let inlineEdgeLabelDraft = $state<string>('');
  let lastPointerWorldPos = $state<Point2D | null>(null);

  // Inline node drafts are owned by store.inlineEdit. This effect only clears
  // the local layout flag when the edited node no longer exists.
  $effect(() => {
    if (inlineEditingNodeId && doc && !doc.nodes.some((node) => node.id === inlineEditingNodeId)) {
      store.inlineEdit.cancelAll();
      inlineEditingNodeId = null;
    }
  });

  function focusInput(el: HTMLElement) {
    requestAnimationFrame(() => {
      el.focus();
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.select();
      }
    });
  }
  let inlineEditingMultiplicity = $state<{
    edgeId: string;
    end: 'start' | 'end';
    draft: string;
  } | null>(null);
  let endpointPickerPopup = $state<{
    x: number;
    y: number;
    edgeId: string;
    end: 'start' | 'end';
    current: EndpointDecoration;
    multiplicityDraft: string;
  } | null>(null);

  const relationPresets = listUmlRelationPresets();

  const endpointIconChoices: {
    label: string;
    decoration: EndpointDecoration;
  }[] = [
    { label: 'None', decoration: { shape: 'none', size: 10 } },
    { label: 'Open Arrow', decoration: { shape: 'open-arrow', size: 11 } },
    { label: 'Hollow Triangle', decoration: { shape: 'triangle', fill: 'hollow', size: 12 } },
    { label: 'Filled Triangle', decoration: { shape: 'triangle', fill: 'filled', size: 12 } },
    { label: 'Hollow Diamond', decoration: { shape: 'diamond', fill: 'hollow', size: 13 } },
    { label: 'Filled Diamond', decoration: { shape: 'diamond', fill: 'filled', size: 13 } },
    { label: 'Hollow Circle', decoration: { shape: 'circle', fill: 'hollow', size: 10 } },
    { label: 'Filled Circle', decoration: { shape: 'circle', fill: 'filled', size: 10 } },
    { label: 'Hollow Square', decoration: { shape: 'square', fill: 'hollow', size: 10 } },
    { label: 'Filled Square', decoration: { shape: 'square', fill: 'filled', size: 10 } }
  ];

  const doc = $derived<UmlDocument | undefined>(store.umlDoc);

  // Dynamic background grid that scales with zoom and translates with pan
  const gridSpacing = $derived(GRID_SIZE * store.viewport.zoom);
  const gridDotRadius = $derived(
    Math.max(0.8, Math.min(2.5, 1.2 * store.viewport.zoom)).toFixed(2)
  );
  const gridOpacity = $derived(
    (store.viewport.zoom < 0.45
      ? Math.max(0.08, 0.24 * (store.viewport.zoom / 0.45))
      : 0.24
    ).toFixed(2)
  );
  const gridPosX = $derived(store.viewport.panX - gridSpacing / 2);
  const gridPosY = $derived(store.viewport.panY - gridSpacing / 2);

  const nodeElements = new Map<string, HTMLElement>();

  function registerNodeElement(el: HTMLElement, id: string) {
    nodeElements.set(id, el);
    return {
      update(newId: string) {
        if (newId !== id) {
          nodeElements.delete(id);
          id = newId;
          nodeElements.set(id, el);
        }
      },
      destroy() {
        nodeElements.delete(id);
      }
    };
  }

  const FRAME_PAD_LEFT = 20;
  const FRAME_PAD_RIGHT = 20;
  const FRAME_PAD_TOP = 28;
  const FRAME_PAD_BOTTOM = 20;

  function getNodeMinContentSize(nodeId: string): { minWidth: number; minHeight: number } {
    const node = doc?.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return { minWidth: 100, minHeight: 60 };
    const box = effectiveNodeLayouts[nodeId];
    return computeNodeMinSize(node, inlineEditingNodeId === nodeId, box?.width, inlineDraft);
  }

  const inlineDraft = $derived.by(() => {
    const state = store.inlineEdit.state;
    if (state.mode !== 'node') return undefined;
    return {
      name: state.name,
      text: state.text,
      attributes: state.attributes,
      operations: state.operations
    };
  });

  // Compute live layout boxes including optimistic layouts and grid-snapped gesture preview
  const effectiveNodeLayouts = $derived.by(() => {
    if (!doc) return {};
    const current = gesture;
    let adapted: GestureState;
    if (current.mode === 'moving') {
      adapted = {
        mode: 'moving_nodes',
        startWorld: current.startWorld,
        currentWorld: current.currentWorld,
        initialLayouts: current.initialLayouts,
        clickedNodeId: current.clickedNodeId,
        isShift: Boolean(current.isShift)
      };
    } else if (current.mode === 'resizing') {
      adapted = {
        mode: 'resizing_node',
        nodeId: current.nodeId,
        handle: current.handleDirection ?? 'se',
        startWorld: current.startWorld,
        currentWorld: current.currentWorld,
        initialBox: current.initialBox,
        minWidth: current.minWidth ?? 120,
        minHeight: current.minHeight ?? 60,
        childBounds: current.childBounds
      };
    } else if (current.mode === 'marquee') {
      adapted = current;
    } else {
      adapted = { mode: 'idle' };
    }
    return computeEffectiveLayouts(
      doc,
      store.optimisticUmlLayouts,
      adapted,
      inlineEditingNodeId,
      inlineDraft
    );
  });

  // Compute parallel edge offsets when multiple relations connect the same node pair
  const edgeParallelOffsets = $derived.by<Record<string, number>>(() => {
    if (!doc) return {};
    return computeParallelEdgeOffsets(doc.edges);
  });

  const marqueeRect = $derived<Rect2D | null>(
    gesture.mode === 'marquee'
      ? normalizeDragRect(gesture.startWorld, gesture.currentWorld)
      : null
  );

  const resizeCursor = $derived.by(() => {
    if (gesture.mode !== 'resizing') return null;
    switch (gesture.handleDirection ?? 'se') {
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'nw':
      case 'se':
        return 'nwse-resize';
      default:
        return 'nesw-resize';
    }
  });

  $effect(() => {
    store.registerCanvasCallbacks({
      onFitContent: fitContent,
      onResetZoom: () => store.setViewport({ panX: 40, panY: 40, zoom: 1 }),
      onRestoreFocus: () => viewportEl?.focus()
    });
  });

  $effect(() => {
    if (inlineEditingNodeId && !store.selectedIds.includes(inlineEditingNodeId)) {
      commitInlineNodeEdit();
    }
  });

  function getRelativeWorldPoint(e: PointerEvent | MouseEvent): Point2D {
    const rect = viewportEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return screenToWorld(e.clientX - rect.left, e.clientY - rect.top, store.viewport);
  }

  function cancelGesture(): void {
    gesture = { mode: 'idle' };
  }

  function fitContent(): void {
    if (!doc || doc.nodes.length === 0 || !viewportEl) {
      store.setViewport({ panX: 40, panY: 40, zoom: 1 });
      return;
    }
    const bounds = computeContentBounds(effectiveNodeLayouts);
    if (!bounds) {
      store.setViewport({ panX: 40, panY: 40, zoom: 1 });
      return;
    }
    store.viewportController.fitContent(bounds, viewportEl.clientWidth, viewportEl.clientHeight);
  }

  function handleWheel(e: WheelEvent): void {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      if (e.shiftKey) {
        // Ctrl + Shift + Scroll scrolls horizontally
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        store.setViewport({
          ...store.viewport,
          panX: store.viewport.panX - delta,
          panY: store.viewport.panY
        });
      } else {
        // Ctrl + Scroll scrolls vertically (and horizontally if trackpad provides deltaX)
        store.setViewport({
          ...store.viewport,
          panX: store.viewport.panX - e.deltaX,
          panY: store.viewport.panY - e.deltaY
        });
      }
    } else {
      // Plain Scroll zooms in/out centered on the cursor
      if (e.deltaY === 0) return;
      const rect = viewportEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const nextZoom = Math.min(3.0, Math.max(0.2, store.viewport.zoom * factor));
      const scaleChange = nextZoom / store.viewport.zoom;

      store.setViewport({
        zoom: nextZoom,
        panX: cursorX - (cursorX - store.viewport.panX) * scaleChange,
        panY: cursorY - (cursorY - store.viewport.panY) * scaleChange
      });
    }
  }

  function handleZoomPillWheel(e: WheelEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY === 0) return;
    const currentPercent = Math.round(store.viewport.zoom * 100);
    const step = e.deltaY < 0 ? 1 : -1;
    const nextZoom = Math.min(3.0, Math.max(0.2, (currentPercent + step) / 100));
    store.setViewport({
      ...store.viewport,
      zoom: nextZoom
    });
  }

  function handleCanvasPointerDown(e: PointerEvent): void {
    if (e.button === 2) return; // Right-click is handled by contextmenu

    if (inlineEditingNodeId) commitInlineNodeEdit();
    if (inlineEditingEdgeId) commitInlineEdgeLabel();
    if (inlineEditingMultiplicity) commitInlineMultiplicity();
    closeEndpointPickerPopup();
    viewportEl?.focus();

    if (e.button === 1 || (e.button === 0 && (e.altKey || spacePressed))) {
      gesture = {
        mode: 'panning',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        initialPanX: store.viewport.panX,
        initialPanY: store.viewport.panY
      };
      try {
        viewportEl?.setPointerCapture(e.pointerId);
      } catch {
        // Ignored if capture cannot be acquired
      }
      return;
    }

    if (e.target !== viewportEl && !(e.target as HTMLElement)?.classList.contains('vz-canvas-bg')) {
      return;
    }

    if (e.button === 0) {
      if (!e.shiftKey) {
        store.clearSelection();
      }
      const pt = getRelativeWorldPoint(e);
      gesture = {
        mode: 'marquee',
        startWorld: pt,
        currentWorld: pt
      };
      try {
        viewportEl?.setPointerCapture(e.pointerId);
      } catch {
        // Ignored if capture cannot be acquired
      }
    }
  }

  function handleNodePointerDown(e: PointerEvent, node: UmlNode): void {
    if (e.button === 2) return;
    if (spacePressed || e.button === 1) {
      gesture = {
        mode: 'panning',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        initialPanX: store.viewport.panX,
        initialPanY: store.viewport.panY
      };
      return;
    }

    const targetEl = e.target as HTMLElement | null;
    const targetTag = targetEl?.tagName;
    if (
      inlineEditingNodeId === node.id ||
      targetTag === 'INPUT' ||
      targetTag === 'TEXTAREA' ||
      targetTag === 'SELECT' ||
      targetTag === 'BUTTON' ||
      targetEl?.closest('.vz-eye-toggle-btn')
    ) {
      e.stopPropagation();
      return;
    }

    if (inlineEditingNodeId && inlineEditingNodeId !== node.id) commitInlineNodeEdit();
    if (inlineEditingEdgeId) commitInlineEdgeLabel();
    if (inlineEditingMultiplicity) commitInlineMultiplicity();
    closeEndpointPickerPopup();
    e.stopPropagation();
    viewportEl?.focus();

    const additive = e.metaKey || e.ctrlKey;
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, additive || e.shiftKey);
    } else if (additive) {
      store.selectSingle(node.id, true);
      return;
    }

    if (store.isReadOnly) return;

    const pt = getRelativeWorldPoint(e);
    const initialLayouts: Record<string, UmlNodeLayout> = {};

    // When dragging a frame, include its contained elements so they move together with the frame
    const nodesToMove = new Set<string>(store.selectedIds);
    for (const id of store.selectedIds) {
      const n = doc?.nodes.find((item) => item.id === id);
      if (n?.kind === 'frame') {
        for (const cid of n.children ?? []) {
          nodesToMove.add(cid);
        }
      }
    }

    for (const id of nodesToMove) {
      if (effectiveNodeLayouts[id]) {
        initialLayouts[id] = { ...effectiveNodeLayouts[id] };
      }
    }
    gesture = {
      mode: 'moving',
      startWorld: pt,
      currentWorld: pt,
      initialLayouts,
      clickedNodeId: node.id,
      isShift: e.shiftKey
    };
  }

  function handleResizeHandlePointerDown(
    e: PointerEvent,
    node: UmlNode,
    dir: FrameResizeSide = 'se'
  ): void {
    if (e.button === 2) return;
    e.stopPropagation();
    if (store.isReadOnly) return;
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, e.shiftKey || e.metaKey || e.ctrlKey);
    }
    const pt = getRelativeWorldPoint(e);
    const box = effectiveNodeLayouts[node.id];
    if (!box) return;
    const minSize = getNodeMinContentSize(node.id);
    let minW = minSize.minWidth;
    let minH = minSize.minHeight;
    let childBounds: { minX: number; minY: number; maxX: number; maxY: number } | undefined;

    if (node.kind === 'frame' && node.children && node.children.length > 0) {
      const childBoxes = node.children
        .map((cid) => effectiveNodeLayouts[cid])
        .filter((b): b is UmlNodeLayout => Boolean(b));
      if (childBoxes.length > 0) {
        childBounds = {
          minX: Math.min(...childBoxes.map((b) => b.x)),
          minY: Math.min(...childBoxes.map((b) => b.y)),
          maxX: Math.max(...childBoxes.map((b) => b.x + b.width)),
          maxY: Math.max(...childBoxes.map((b) => b.y + b.height))
        };
        minW = Math.max(160, snapToGrid(childBounds.maxX + FRAME_PAD_RIGHT - box.x, GRID_SIZE));
        minH = Math.max(120, snapToGrid(childBounds.maxY + FRAME_PAD_BOTTOM - box.y, GRID_SIZE));
      }
    }

    const localX = pt.x - box.x;
    const localY = pt.y - box.y;
    const offset = dir === 'n' || dir === 's' ? localX : localY;

    gesture = {
      mode: 'resizing',
      nodeId: node.id,
      handleDirection: dir,
      handleOffset: offset,
      startWorld: pt,
      currentWorld: pt,
      initialBox: {
        ...box,
        width: Math.max(minW, snapToGrid(box.width, GRID_SIZE)),
        height: Math.max(minH, snapToGrid(box.height, GRID_SIZE))
      },
      minWidth: minW,
      minHeight: minH,
      childBounds
    };

    try {
      viewportEl?.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  }

  function handleConnectPortPointerDown(e: PointerEvent, node: UmlNode): void {
    if (e.button === 2) return;
    e.stopPropagation();
    if (store.isReadOnly) return;
    const pt = getRelativeWorldPoint(e);
    const box = effectiveNodeLayouts[node.id];
    let startPoint = {
      x: (box?.x ?? pt.x) + (box?.width ?? 0),
      y: (box?.y ?? pt.y) + (box?.height ?? 0) / 2
    };
    if (box && node.kind === 'shape' && node.shape) {
      const hit = computeShapeBoundaryIntersection(
        box,
        { x: box.x + box.width + 1000, y: box.y + box.height / 2 },
        node.shape
      );
      startPoint = hit.point;
    }
    gesture = {
      mode: 'connecting',
      sourceNodeId: node.id,
      startPoint,
      currentWorld: pt
    };
  }

  function handleWindowPointerMove(e: PointerEvent): void {
    lastPointerWorldPos = getRelativeWorldPoint(e);
    if (gesture.mode === 'idle') return;

    if (gesture.mode === 'panning') {
      const dx = e.clientX - gesture.startScreenX;
      const dy = e.clientY - gesture.startScreenY;
      store.setViewport({
        ...store.viewport,
        panX: gesture.initialPanX + dx,
        panY: gesture.initialPanY + dy
      });
      return;
    }

    const pt = getRelativeWorldPoint(e);
    if (
      gesture.mode === 'marquee' ||
      gesture.mode === 'moving' ||
      gesture.mode === 'resizing' ||
      gesture.mode === 'connecting'
    ) {
      gesture = {
        ...gesture,
        currentWorld: pt,
        ...(gesture.mode === 'moving' ? { isShift: Boolean(e.shiftKey) } : {})
      };
    }
  }

  function findHoveredTargetAt(worldPt: Point2D): UmlNode | undefined {
    if (!doc) return undefined;
    for (let i = doc.nodes.length - 1; i >= 0; i--) {
      const n = doc.nodes[i];
      if (n.kind === 'frame') continue;
      const box = effectiveNodeLayouts[n.id];
      if (!box) continue;
      if (
        worldPt.x >= box.x &&
        worldPt.x <= box.x + box.width &&
        worldPt.y >= box.y &&
        worldPt.y <= box.y + box.height
      ) {
        return n;
      }
    }
    return undefined;
  }

  function handleWindowPointerUp(e: PointerEvent): void {
    if (gesture.mode === 'idle') return;
    const current = gesture;

    if (current.mode === 'marquee' && doc) {
      gesture = { mode: 'idle' };
      const box = normalizeDragRect(current.startWorld, current.currentWorld);
      if (box.width > 4 || box.height > 4) {
        const hitIds: string[] = [];
        for (const n of doc.nodes) {
          const nBox = effectiveNodeLayouts[n.id];
          if (nBox && rectsIntersect(box, nBox)) {
            hitIds.push(n.id);
          }
        }
        store.setSelectedIds(hitIds);
      }
      return;
    }

    if (current.mode === 'moving') {
      const rawDx = current.currentWorld.x - current.startWorld.x;
      const rawDy = current.currentWorld.y - current.startWorld.y;
      const snappedDx = snapToGrid(rawDx, GRID_SIZE);
      const snappedDy = snapToGrid(rawDy, GRID_SIZE);

      if (snappedDx === 0 && snappedDy === 0) {
        gesture = { mode: 'idle' };
        if (
          !e.shiftKey &&
          !e.metaKey &&
          !e.ctrlKey &&
          current.clickedNodeId &&
          store.selectedIds.length > 1
        ) {
          store.selectSingle(current.clickedNodeId, false);
        }
        return;
      }

      const updates: Record<string, UmlNodeLayout> = {};
      for (const [id, init] of Object.entries(current.initialLayouts)) {
        updates[id] = {
          ...init,
          x: snapToGrid(init.x + snappedDx, GRID_SIZE),
          y: snapToGrid(init.y + snappedDy, GRID_SIZE)
        };
      }

      const isShift = Boolean(current.isShift || e.shiftKey);
      const dropPt = getRelativeWorldPoint(e);
      const { layoutUpdates, childrenUpdates } = getFrameDragDropUpdates(
        current.clickedNodeId,
        updates,
        current.initialLayouts,
        dropPt,
        isShift
      );
      const allUpdates = { ...updates, ...layoutUpdates };
      store.optimisticUmlLayouts = { ...store.optimisticUmlLayouts, ...allUpdates };
      gesture = { mode: 'idle' };

      store.dispatchOperation({
        type: 'uml.moveResizeNodes',
        updates: allUpdates,
        frameChildrenUpdates: Object.keys(childrenUpdates).length > 0 ? childrenUpdates : undefined
      });
      return;
    }

    if (current.mode === 'resizing') {
      const rawDx = current.currentWorld.x - current.startWorld.x;
      const rawDy = current.currentWorld.y - current.startWorld.y;
      const minW = current.minWidth ?? 120;
      const minH = current.minHeight ?? 60;
      const init = current.initialBox;
      const dir = current.handleDirection ?? 'se';
      const cb = current.childBounds;

      let newX = init.x;
      let newY = init.y;
      let newW = init.width;
      let newH = init.height;

      if (dir === 'e' || dir === 'ne' || dir === 'se') {
        const minRight = cb ? snapToGrid(cb.maxX + FRAME_PAD_RIGHT, GRID_SIZE) : init.x + minW;
        const targetW = init.width + rawDx;
        newW = Math.max(minW, minRight - init.x, snapToGrid(targetW, GRID_SIZE));
      } else if (dir === 'w' || dir === 'nw' || dir === 'sw') {
        const rightEdge = init.x + init.width;
        const maxLeft = cb ? snapToGrid(cb.minX - FRAME_PAD_LEFT, GRID_SIZE) : rightEdge - minW;
        const targetX = init.x + rawDx;
        newX = Math.min(rightEdge - minW, maxLeft, snapToGrid(targetX, GRID_SIZE));
        newW = rightEdge - newX;
      }

      if (dir === 's' || dir === 'sw' || dir === 'se') {
        const minBottom = cb ? snapToGrid(cb.maxY + FRAME_PAD_BOTTOM, GRID_SIZE) : init.y + minH;
        const targetH = init.height + rawDy;
        newH = Math.max(minH, minBottom - init.y, snapToGrid(targetH, GRID_SIZE));
      } else if (dir === 'n' || dir === 'nw' || dir === 'ne') {
        const bottomEdge = init.y + init.height;
        const maxTop = cb ? snapToGrid(cb.minY - FRAME_PAD_TOP, GRID_SIZE) : bottomEdge - minH;
        const targetY = init.y + rawDy;
        newY = Math.min(bottomEdge - minH, maxTop, snapToGrid(targetY, GRID_SIZE));
        newH = bottomEdge - newY;
      }

      if (
        newX === init.x &&
        newY === init.y &&
        newW === init.width &&
        newH === init.height
      ) {
        gesture = { mode: 'idle' };
        return;
      }

      const nextBox: UmlNodeLayout = {
        x: newX,
        y: newY,
        width: newW,
        height: newH
      };

      const initialUpdates = { [current.nodeId]: nextBox };

      store.optimisticUmlLayouts = {
        ...store.optimisticUmlLayouts,
        ...initialUpdates
      };
      gesture = { mode: 'idle' };

      store.dispatchOperation({
        type: 'uml.moveResizeNodes',
        updates: initialUpdates
      });
      return;
    }

    if (current.mode === 'connecting') {
      gesture = { mode: 'idle' };
      const pt = getRelativeWorldPoint(e);
      const targetNode = findHoveredTargetAt(pt);
      if (targetNode && targetNode.id !== current.sourceNodeId) {
        const sourceNode = doc?.nodes.find((n) => n.id === current.sourceNodeId);
        const touchesNote = sourceNode?.kind === 'note' || targetNode.kind === 'note';
        const defaultKind: UmlRelationKind = touchesNote ? 'other' : 'association';
        const edgeId = `edge-${current.sourceNodeId}-${targetNode.id}-${Date.now().toString(36).slice(-4)}`;
        store.dispatchOperation({
          type: 'uml.addEdge',
          id: edgeId,
          kind: defaultKind,
          sourceNodeId: current.sourceNodeId,
          targetNodeId: targetNode.id
        });
      }
      return;
    }

    gesture = { mode: 'idle' };
  }

  function getFrameDragDropUpdates(
    clickedNodeId: string | undefined,
    updates: Record<string, UmlNodeLayout>,
    initialLayouts: Record<string, UmlNodeLayout>,
    dropPt: Point2D,
    isShift: boolean
  ): {
    layoutUpdates: Record<string, UmlNodeLayout>;
    childrenUpdates: Record<string, string[]>;
  } {
    return computeFrameDragDropUpdates(
      doc,
      effectiveNodeLayouts,
      clickedNodeId,
      updates,
      initialLayouts,
      dropPt,
      isShift
    );
  }

  function deleteSelected(): void {
    if (store.isReadOnly || !doc || store.selectedIds.length === 0) return;
    if (inlineEditingNodeId && store.selectedIds.includes(inlineEditingNodeId)) {
      inlineEditingNodeId = null;
    }
    const nodeIds = doc.nodes
      .filter((n) => store.selectedIds.includes(n.id))
      .map((n) => n.id);
    const edgeIds = doc.edges
      .filter((e) => store.selectedIds.includes(e.id))
      .map((e) => e.id);

    if (nodeIds.length === 0 && edgeIds.length === 0) return;
    store.dispatchOperation({
      type: 'uml.deleteEntities',
      nodeIds,
      edgeIds
    });
    store.clearSelection();
  }

  function duplicateSelected(): void {
    if (store.isReadOnly || !doc || store.selectedIds.length === 0) return;
    const nodeIds = doc.nodes
      .filter((n) => store.selectedIds.includes(n.id))
      .map((n) => n.id);
    const edgeIds = doc.edges
      .filter((e) => store.selectedIds.includes(e.id))
      .map((e) => e.id);

    if (nodeIds.length === 0 && edgeIds.length === 0) return;
    store.dispatchOperation({
      type: 'uml.duplicateSelection',
      nodeIds,
      edgeIds
    });
  }

  function handleKeyDown(e: KeyboardEvent): void {
    const isMod = e.ctrlKey || e.metaKey;
    const keyLower = e.key.toLowerCase();
    const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
    const isEditingText =
      activeTag === 'INPUT' ||
      activeTag === 'TEXTAREA' ||
      activeTag === 'SELECT' ||
      inlineEditingNodeId !== null ||
      inlineEditingEdgeId !== null ||
      inlineEditingMultiplicity !== null;

    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement).blur();
        return;
      }
      // When inside an input/textarea, prevent document-level undo/redo from running
      // and stop propagation so browser native text undo operates inside the field.
      if (isMod && (keyLower === 'z' || keyLower === 'y')) {
        e.stopPropagation();
        return;
      }
      return;
    }

    // If an inline editing session is active on a node/edge, suppress host document undo/redo
    if (isEditingText && isMod && (keyLower === 'z' || keyLower === 'y')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (e.key === 'Shift' && gesture.mode === 'moving') {
      gesture = { ...gesture, isShift: true };
    }

    if (e.code === 'Space' && !isMod && !e.altKey) {
      e.preventDefault();
      spacePressed = true;
      return;
    }

    if (e.key === 'Escape') {
      store.closeContextMenu();
      inlineEditingNodeId = null;
      inlineEditingEdgeId = null;
      inlineEditingMultiplicity = null;
      endpointPickerPopup = null;
      if (gesture.mode !== 'idle') {
        cancelGesture();
      } else {
        store.clearSelection();
      }
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      deleteSelected();
      return;
    }

    // Undo: Ctrl+Z
    if (isMod && !e.shiftKey && keyLower === 'z') {
      e.preventDefault();
      store.triggerUndo();
      return;
    }

    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if ((isMod && keyLower === 'y') || (isMod && e.shiftKey && keyLower === 'z')) {
      e.preventDefault();
      store.triggerRedo();
      return;
    }

    // Copy: Ctrl+C
    if (isMod && !e.shiftKey && keyLower === 'c') {
      e.preventDefault();
      store.copySelection();
      return;
    }

    // Paste: Ctrl+V
    if (isMod && !e.shiftKey && keyLower === 'v') {
      e.preventDefault();
      store.pasteClipboard(false);
      return;
    }

    // Paste with default state (strip custom data): Ctrl+Shift+V
    if (isMod && e.shiftKey && keyLower === 'v') {
      e.preventDefault();
      store.pasteClipboard(true);
      return;
    }

    // Duplicate: Ctrl+D
    if (isMod && keyLower === 'd') {
      e.preventDefault();
      duplicateSelected();
      return;
    }

    // Quick Node Creation Shortcuts: Alt+C (Class), Alt+N (Note), Alt+S (Shape)
    if (e.altKey && !isMod) {
      const spawnX = lastPointerWorldPos ? snapToGrid(lastPointerWorldPos.x, GRID_SIZE) : undefined;
      const spawnY = lastPointerWorldPos ? snapToGrid(lastPointerWorldPos.y, GRID_SIZE) : undefined;
      if (keyLower === 'c') {
        e.preventDefault();
        store.createQuickUmlNode('class', spawnX, spawnY);
        return;
      }
      if (keyLower === 'n') {
        e.preventDefault();
        store.createQuickUmlNode('note', spawnX, spawnY);
        return;
      }
      if (keyLower === 's') {
        e.preventDefault();
        store.createQuickUmlNode('shape', spawnX, spawnY, 'rectangle');
        return;
      }
      if (keyLower === 'f') {
        e.preventDefault();
        store.createQuickUmlNode('frame', spawnX, spawnY);
        return;
      }
    }

    if (e.key === '0' && isMod) {
      e.preventDefault();
      store.setViewport({ panX: 40, panY: 40, zoom: 1 });
    }
  }

  function handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      spacePressed = false;
    }
    if (e.key === 'Shift' && gesture.mode === 'moving') {
      gesture = { ...gesture, isShift: false };
    }
  }

  function handleCanvasContextMenu(e: MouseEvent): void {
    e.preventDefault();
    const worldPt = getRelativeWorldPoint(e);
    store.openContextMenu(
      e.clientX,
      e.clientY,
      [
        {
          label: 'Add New',
          submenu: [
            {
              label: 'Class',
              shortcut: 'Alt+C',
              action: () => store.createQuickUmlNode('class', worldPt.x, worldPt.y)
            },
            {
              label: 'Note',
              shortcut: 'Alt+N',
              action: () => store.createQuickUmlNode('note', worldPt.x, worldPt.y)
            },
            {
              label: 'Frame',
              shortcut: 'Alt+F',
              action: () => store.createQuickUmlNode('frame', worldPt.x, worldPt.y)
            },
            {
              label: 'Shape',
              dividerBefore: true,
              submenu: UML_SHAPE_GEOMETRIES.map((sh) => ({
                label: sh.label,
                action: () =>
                  store.createQuickUmlNode('shape', worldPt.x, worldPt.y, sh.kind)
              }))
            }
          ]
        },
        {
          label: 'Paste',
          shortcut: 'Ctrl+V',
          dividerBefore: true,
          action: () => store.pasteClipboard(false)
        },
        {
          label: 'Paste as new',
          shortcut: 'Ctrl+Shift+V',
          action: () => store.pasteClipboard(true)
        },
        {
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          dividerBefore: true,
          action: () => store.triggerUndo()
        },
        {
          label: 'Redo',
          shortcut: 'Ctrl+Y',
          action: () => store.triggerRedo()
        },
        {
          label: 'Fit Content',
          dividerBefore: true,
          action: () => fitContent()
        },
        {
          label: 'Export',
          dividerBefore: true,
          submenu: [
            {
              label: 'to Clipboard',
              action: () => exportToClipboard()
            },
            {
              label: 'as PNG',
              action: () => exportAsPng()
            }
          ]
        }
      ],
      'Canvas'
    );
  }

  function addNodeAttributeInline(node: UmlNode): void {
    const existing = node.attributes ?? [];
    const newAttr = {
      id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
      visibility: '+' as const,
      name: `field${existing.length + 1}`,
      type: 'string'
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      showAttributes: true,
      attributes: [...existing, newAttr]
    });
    if (inlineEditingNodeId === node.id) {
      store.inlineEdit.updateNodeDraft({
        attributes: formatAttributesToText([...existing, newAttr])
      });
    }
  }

  function addNodeOperationInline(node: UmlNode): void {
    const existing = node.operations ?? [];
    const newOp = {
      id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
      visibility: '+' as const,
      name: `method${existing.length + 1}`,
      signature: '()',
      returnType: 'void',
      parameters: []
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      showOperations: true,
      operations: [...existing, newOp]
    });
    if (inlineEditingNodeId === node.id) {
      store.inlineEdit.updateNodeDraft({
        operations: formatOperationsToText([...existing, newOp])
      });
    }
  }

  function handleNodeContextMenu(e: MouseEvent, node: UmlNode): void {
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, false);
    }

    const kindDesc = getUmlNodeKind(node.kind);
    const editMenuLabel =
      node.kind === 'frame' || node.kind === 'shape' ? 'Edit Label' : 'Edit';
    const items = [
      {
        label: editMenuLabel,
        action: () => {
          startInlineNodeEdit(node);
        }
      },
      ...(node.kind === 'shape'
        ? [
            {
              label: 'Change Shape',
              submenu: UML_SHAPE_GEOMETRIES.map((sh) => ({
                label: sh.label,
                action: () =>
                  store.dispatchOperation({
                    type: 'uml.updateNode',
                    nodeId: node.id,
                    shape: sh.kind
                  })
              }))
            }
          ]
        : []),
      ...(kindDesc?.hasCompartments
        ? [
            {
              label: 'Add Attribute',
              action: () => addNodeAttributeInline(node)
            },
            {
              label: 'Add Operation',
              action: () => addNodeOperationInline(node)
            }
          ]
        : []),
      {
        label: 'Copy',
        shortcut: 'Ctrl+C',
        dividerBefore: true,
        action: () => store.copySelection()
      },
      {
        label: 'Duplicate',
        shortcut: 'Ctrl+D',
        action: () => duplicateSelected()
      },
      {
        label: 'Paste as new',
        shortcut: 'Ctrl+Shift+V',
        action: () => {
          store.copySelection();
          store.pasteClipboard(true);
        }
      },
      {
        label: 'Delete Node',
        shortcut: 'Del',
        danger: true,
        dividerBefore: true,
        action: () => deleteSelected()
      }
    ];

    store.openContextMenu(e.clientX, e.clientY, items, `${kindDesc?.label ?? node.kind}: ${node.name}`);
  }

  function startInlineNodeEdit(node: UmlNode): void {
    if (inlineEditingNodeId && inlineEditingNodeId !== node.id) {
      commitInlineNodeEdit();
    }
    if (inlineEditingEdgeId) commitInlineEdgeLabel();
    if (inlineEditingMultiplicity) commitInlineMultiplicity();
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, false);
    }
    store.inlineEdit.beginNode(node);
    inlineEditingNodeId = node.id;
  }


  function commitInlineNodeEdit(node?: UmlNode): void {
    if (store.inlineEdit.state.mode === 'node') {
      store.inlineEdit.commitNode(node);
    }
    inlineEditingNodeId = null;
  }

  $effect(() => {
    if (inlineEditingNodeId && store.inlineEdit.state.mode !== 'node') {
      inlineEditingNodeId = null;
    }
  });

  function startInlineEdgeLabelEdit(edge: UmlEdge): void {
    if (inlineEditingNodeId) commitInlineNodeEdit();
    if (inlineEditingEdgeId && inlineEditingEdgeId !== edge.id) commitInlineEdgeLabel();
    if (inlineEditingMultiplicity) commitInlineMultiplicity();
    inlineEditingEdgeId = edge.id;
    inlineEdgeLabelDraft = edge.label ?? '';
  }

  function commitInlineEdgeLabel(edge?: UmlEdge): void {
    const edgeId = inlineEditingEdgeId;
    if (!edgeId) return;
    const targetEdge = edge ?? doc?.edges.find((e) => e.id === edgeId);
    inlineEditingEdgeId = null;
    if (!targetEdge) return;
    const nextLabel = inlineEdgeLabelDraft.trim();
    if (nextLabel !== (targetEdge.label ?? '')) {
      store.dispatchOperation({
        type: 'uml.updateEdge',
        edgeId: targetEdge.id,
        label: nextLabel
      });
    }
  }

  function startInlineMultiplicityEdit(edge: UmlEdge, end: 'start' | 'end'): void {
    if (inlineEditingNodeId) commitInlineNodeEdit();
    if (inlineEditingEdgeId) commitInlineEdgeLabel();
    if (inlineEditingMultiplicity) commitInlineMultiplicity();
    inlineEditingMultiplicity = {
      edgeId: edge.id,
      end,
      draft: end === 'start' ? (edge.source.multiplicity ?? '') : (edge.target.multiplicity ?? '')
    };
  }

  function commitInlineMultiplicity(edge?: UmlEdge): void {
    if (!inlineEditingMultiplicity) return;
    const { edgeId, end, draft } = inlineEditingMultiplicity;
    const targetEdge = edge ?? doc?.edges.find((e) => e.id === edgeId);
    inlineEditingMultiplicity = null;
    if (!targetEdge) return;
    const cleaned = draft.trim();
    const prev = end === 'start' ? (targetEdge.source.multiplicity ?? '') : (targetEdge.target.multiplicity ?? '');
    if (cleaned !== prev) {
      store.dispatchOperation({
        type: 'uml.updateEdge',
        edgeId: targetEdge.id,
        ...(end === 'start'
          ? { sourceMultiplicity: cleaned }
          : { targetMultiplicity: cleaned })
      });
    }
  }

  function commitEndpointMultiplicity(): void {
    if (!endpointPickerPopup) return;
    const { edgeId, end, multiplicityDraft } = endpointPickerPopup;
    const targetEdge = doc?.edges.find((e) => e.id === edgeId);
    if (targetEdge) {
      const cleaned = (multiplicityDraft ?? '').trim();
      const prev = end === 'start' ? (targetEdge.source.multiplicity ?? '') : (targetEdge.target.multiplicity ?? '');
      if (cleaned !== prev) {
        store.dispatchOperation({
          type: 'uml.updateEdge',
          edgeId: targetEdge.id,
          ...(end === 'start'
            ? { sourceMultiplicity: cleaned }
            : { targetMultiplicity: cleaned })
        });
      }
    }
  }

  function closeEndpointPickerPopup(): void {
    if (!endpointPickerPopup) return;
    commitEndpointMultiplicity();
    endpointPickerPopup = null;
  }

  function openEndpointPickerPopup(
    clientX: number,
    clientY: number,
    edge: UmlEdge,
    end: 'start' | 'end',
    current: EndpointDecoration
  ): void {
    store.closeContextMenu();
    if (endpointPickerPopup) closeEndpointPickerPopup();
    endpointPickerPopup = {
      x: Math.max(12, Math.min(clientX, window.innerWidth - 260)),
      y: Math.max(12, Math.min(clientY, window.innerHeight - 360)),
      edgeId: edge.id,
      end,
      current,
      multiplicityDraft:
        end === 'start' ? (edge.source.multiplicity ?? '') : (edge.target.multiplicity ?? '')
    };
  }

  function handleEdgeContextMenu(e: MouseEvent, edge: UmlEdge): void {
    e.preventDefault();
    e.stopPropagation();
    store.selectSingle(edge.id, false);
    const clickX = e.clientX;
    const clickY = e.clientY;

    store.openContextMenu(
      clickX,
      clickY,
      [
        {
          label: 'Edit Label',
          action: () => startInlineEdgeLabelEdit(edge)
        },
        {
          label: 'Switch Direction',
          action: () =>
            store.dispatchOperation({
              type: 'uml.updateEdge',
              edgeId: edge.id,
              reverseDirection: true
            })
        },
        {
          label: 'Change Relation Type',
          dividerBefore: true,
          submenu: relationPresets.map((preset) => ({
            label: preset.label,
            action: () =>
              store.dispatchOperation({
                type: 'uml.updateEdge',
                edgeId: edge.id,
                kind: preset.kind
              })
          }))
        },
        {
          label: 'Customize Start Endpoint…',
          dividerBefore: true,
          action: () =>
            openEndpointPickerPopup(
              clickX,
              clickY,
              edge,
              'start',
              edge.visual?.start ?? { shape: 'none', size: 10 }
            )
        },
        {
          label: 'Customize End Endpoint…',
          action: () =>
            openEndpointPickerPopup(
              clickX,
              clickY,
              edge,
              'end',
              edge.visual?.end ?? { shape: 'none', size: 10 }
            )
        },
        {
          label: 'Routing',
          dividerBefore: true,
          submenu: [
            {
              label: `${(edge.visual?.routing ?? 'default') === 'default' ? '✓ ' : ''}Default`,
              action: () =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: edge.id,
                  routing: 'default'
                })
            },
            {
              label: `${edge.visual?.routing === 'orthogonal' ? '✓ ' : ''}Orthogonal`,
              action: () =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: edge.id,
                  routing: 'orthogonal'
                })
            },
            {
              label: `${edge.visual?.routing === 'straight' ? '✓ ' : ''}Straight`,
              action: () =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: edge.id,
                  routing: 'straight'
                })
            },
            {
              label: `${edge.visual?.routing === 'bezier' ? '✓ ' : ''}Smooth`,
              action: () =>
                store.dispatchOperation({
                  type: 'uml.updateEdge',
                  edgeId: edge.id,
                  routing: 'bezier'
                })
            }
          ]
        },
        {
          label: 'Delete Relation',
          shortcut: 'Del',
          danger: true,
          dividerBefore: true,
          action: () => deleteSelected()
        }
      ],
      `Relation: ${edge.source.nodeId} → ${edge.target.nodeId}`
    );
  }

  function getEdgeRouting(edge: UmlEdge): UmlRoutingKind {
    const r = edge.visual?.routing;
    if (!r || r === 'default') {
      return doc?.defaultRouting ?? 'orthogonal';
    }
    return r;
  }

  function renderEndpointPath(dec: EndpointDecoration | undefined): {
    d: string;
    fill: string;
  } {
    const shapeDesc = getEndpointShape(dec?.shape ?? 'none');
    if (!shapeDesc || shapeDesc.kind === 'none') {
      return { d: '', fill: 'none' };
    }
    const size = dec?.size ?? shapeDesc.defaultSize;
    const d = shapeDesc.buildLocalPath(size);
    if (!shapeDesc.supportsFill) {
      return { d, fill: 'none' };
    }
    const fillMode = dec?.fill ?? shapeDesc.defaultFill ?? 'hollow';
    return {
      d,
      fill:
        fillMode === 'filled'
          ? 'var(--vscode-editor-foreground)'
          : 'var(--vscode-editor-background)'
    };
  }

  /**
   * Computes the geometric center of an endpoint marker (`circle`, `diamond`, `triangle`, `square`, `open-arrow`)
   * so the round selection target is centered directly over the marker shape rather than offset at its tip.
   */
  function getEndpointVisualCenter(
    tip: Point2D,
    angleDeg: number,
    dec: EndpointDecoration | undefined
  ): Point2D {
    const shapeDesc = getEndpointShape(dec?.shape ?? 'none');
    if (!shapeDesc || shapeDesc.kind === 'none') {
      return tip;
    }
    const size = dec?.size ?? shapeDesc.defaultSize;
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: tip.x - Math.cos(rad) * (size / 2),
      y: tip.y - Math.sin(rad) * (size / 2)
    };
  }

  function isSameEndpointChoice(a: EndpointDecoration, b: EndpointDecoration): boolean {
    if (a.shape !== b.shape) return false;
    const desc = getEndpointShape(a.shape);
    if (!desc?.supportsFill) return true;
    return (a.fill ?? desc.defaultFill ?? 'hollow') === (b.fill ?? desc.defaultFill ?? 'hollow');
  }


  function renderCurrentDiagram(): { canvas: HTMLCanvasElement; width: number; height: number } | null {
    if (!doc) return null;
    return renderDiagramToCanvas({
      doc,
      layouts: effectiveNodeLayouts,
      parallelOffsets: edgeParallelOffsets,
      defaultRouting: doc.defaultRouting,
      viewportElement: viewportEl
    });
  }

  async function exportToClipboard(): Promise<void> {
    try {
      const render = renderCurrentDiagram();
      if (!render) {
        store.setStatusMessage('No diagram content to export.');
        return;
      }
      const { canvas } = render;

      const blob = await canvasToPngBlob(canvas);
      if (!blob) throw new Error('Canvas snapshot generation failed');

      const base64 = canvasToPngBase64(canvas);

      let copied = false;
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          copied = true;
          store.setStatusMessage('Diagram image snapshot copied to clipboard.');
        } catch (clipErr) {
          console.warn('Direct webview clipboard.write failed, falling back to host clipboard:', clipErr);
        }
      }

      if (!copied) {
        postToHost({
          type: 'webview.copyImageToClipboard',
          base64Data: base64
        });
        store.setStatusMessage('Diagram image snapshot copied to clipboard.');
      }
    } catch (err) {
      console.error('Failed to copy diagram image to clipboard', err);
      store.setStatusMessage('Failed to copy diagram snapshot to clipboard.');
    }
  }

  async function exportAsPng(): Promise<void> {
    try {
      const render = renderCurrentDiagram();
      if (!render) {
        store.setStatusMessage('No diagram content to export.');
        return;
      }
      const { canvas } = render;

      const base64 = canvasToPngBase64(canvas);
      postToHost({
        type: 'webview.exportFile',
        format: 'png',
        base64Data: base64
      });
    } catch (err) {
      console.error('Failed to export as PNG', err);
      store.setStatusMessage('Failed to export as PNG.');
    }
  }
</script>

{#snippet eyeIcon(visible: boolean)}
  {#if visible}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  {:else}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  {/if}
{/snippet}

<svelte:window
  onpointermove={handleWindowPointerMove}
  onpointerup={handleWindowPointerUp}
  onpointercancel={cancelGesture}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
/>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={viewportEl}
  class="vz-viewport vz-canvas-bg"
  class:space-grab={spacePressed}
  class:space-grabbing={gesture.mode === 'panning' || gesture.mode === 'moving'}
  class:is-resizing={gesture.mode === 'resizing'}
  style="background-size: {gridSpacing}px {gridSpacing}px; background-position: {gridPosX}px {gridPosY}px; background-image: radial-gradient(rgba(128, 128, 128, {gridOpacity}) {gridDotRadius}px, transparent {gridDotRadius}px); --vz-resize-cursor: {resizeCursor ?? 'default'};"
  tabindex="0"
  role="application"
  aria-label="Vizion UML Canvas"
  onwheel={handleWheel}
  onpointermove={(e) => {
    lastPointerWorldPos = getRelativeWorldPoint(e);
  }}
  onpointerdown={handleCanvasPointerDown}
  oncontextmenu={handleCanvasContextMenu}
>
      <!-- Floating Zoom Pill on Top-Left of Canvas (Scroll on pill to adjust zoom by ±1%) -->
      <div class="vz-floating-zoom" onwheel={handleZoomPillWheel}>
        <button
          type="button"
          class="vz-zoom-pill-btn"
          title="Zoom Out"
          onclick={() =>
            store.setViewport({
              ...store.viewport,
              zoom: (Math.round(store.viewport.zoom * 100) - 10) / 100
            })}
        >
          －
        </button>
        <button
          type="button"
          class="vz-zoom-pill-label"
          title="Scroll wheel here to adjust by ±1%, or click to Fit Content"
          onclick={fitContent}
          onwheel={handleZoomPillWheel}
        >
          {Math.round(store.viewport.zoom * 100)}%
        </button>
        <button
          type="button"
          class="vz-zoom-pill-btn"
          title="Zoom In"
          onclick={() =>
            store.setViewport({
              ...store.viewport,
              zoom: (Math.round(store.viewport.zoom * 100) + 10) / 100
            })}
        >
          ＋
        </button>
      </div>

      {#if doc}
        <!-- HTML Layer for Frame Nodes (Rendered in background BEHIND relations) -->
        <div
          class="vz-html-frames"
          style="transform: translate({store.viewport.panX}px, {store.viewport.panY}px) scale({store.viewport.zoom});"
        >
          {#each doc.nodes.filter((n) => n.kind === 'frame') as node (node.id)}
            {@const box = effectiveNodeLayouts[node.id]}
            {#if box}
              <FrameNode
                {store}
                {node}
                {box}
                selected={store.selectedIds.includes(node.id)}
                onpointerdown={handleNodePointerDown}
                oncontextmenu={handleNodeContextMenu}
                ondblclick={(e, n) => {
                  e.stopPropagation();
                  if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                  startInlineNodeEdit(n);
                }}
                onresizestart={handleResizeHandlePointerDown}
              />
            {/if}
          {/each}
        </div>

        <!-- SVG Layer for Edges, Tangent-Oriented Endpoint Markers, Multiplicities (Rendered OVER frames, but BEHIND element nodes) -->
        <svg class="vz-svg-layer vz-svg-relations vz-svg-overlay" aria-label="UML Relationships">
          <g
            transform="translate({store.viewport.panX}, {store.viewport.panY}) scale({store.viewport.zoom})"
          >

          {#each doc.edges as edge (edge.id)}
              {@const srcBox = effectiveNodeLayouts[edge.source.nodeId]}
              {@const tgtBox = effectiveNodeLayouts[edge.target.nodeId]}
              {@const srcNode = doc.nodes.find((n) => n.id === edge.source.nodeId)}
              {@const tgtNode = doc.nodes.find((n) => n.id === edge.target.nodeId)}
              {#if srcBox && tgtBox}
                {@const edgeData = computeEdgeRenderData(
                  edge,
                  srcBox,
                  tgtBox,
                  srcNode,
                  tgtNode,
                  doc.defaultRouting,
                  edgeParallelOffsets[edge.id] ?? 0
                )}
                {@const isEdgeSelected =
                  store.selectedIds.includes(edge.id) ||
                  (store.selectedIds.includes(edge.source.nodeId) &&
                    store.selectedIds.includes(edge.target.nodeId))}
                <UmlEdgeRenderer
                  data={edgeData}
                  selected={isEdgeSelected}
                  onselect={(e) => {
                    e.stopPropagation();
                    store.selectSingle(edge.id, e.shiftKey || e.metaKey || e.ctrlKey);
                  }}
                  oncontextmenu={(e) => handleEdgeContextMenu(e, edge)}
                  ondblclick={(e) => {
                    e.stopPropagation();
                    if (store.isReadOnly) return;
                    startInlineEdgeLabelEdit(edge);
                  }}
                />
              {/if}
            {/each}

          </g>
        </svg>

        <!-- HTML/Svelte Layer for Custom Extensible UML Nodes (Rendered in front of SVG relation lines) -->
        <div
          class="vz-html-world"
          style="transform: translate({store.viewport.panX}px, {store.viewport.panY}px) scale({store.viewport.zoom});"
        >
          {#each doc.nodes.filter((n) => n.kind !== 'frame') as node (node.id)}
            {@const box = effectiveNodeLayouts[node.id]}
            {#if box}
              {#if node.kind === 'note'}
                <NoteNode
                  {store}
                  {node}
                  {box}
                  selected={store.selectedIds.includes(node.id)}
                  onpointerdown={handleNodePointerDown}
                  oncontextmenu={handleNodeContextMenu}
                  ondblclick={(e, n) => {
                    e.stopPropagation();
                    if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineNodeEdit(n);
                  }}
                  onresizestart={handleResizeHandlePointerDown}
                  onconnectstart={handleConnectPortPointerDown}
                />
              {:else if node.kind === 'shape'}
                <ShapeNode
                  {store}
                  {node}
                  {box}
                  selected={store.selectedIds.includes(node.id)}
                  onpointerdown={handleNodePointerDown}
                  oncontextmenu={handleNodeContextMenu}
                  ondblclick={(e, n) => {
                    e.stopPropagation();
                    if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineNodeEdit(n);
                  }}
                  onresizestart={handleResizeHandlePointerDown}
                  onconnectstart={handleConnectPortPointerDown}
                  oneditlabel={startInlineNodeEdit}
                />
              {:else}
                <ClassNode
                  {store}
                  {node}
                  {box}
                  selected={store.selectedIds.includes(node.id)}
                  onpointerdown={handleNodePointerDown}
                  oncontextmenu={handleNodeContextMenu}
                  ondblclick={(e, n) => {
                    e.stopPropagation();
                    if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                    startInlineNodeEdit(n);
                  }}
                  onresizestart={handleResizeHandlePointerDown}
                  onconnectstart={handleConnectPortPointerDown}
                />
              {/if}
            {/if}
          {/each}
        </div>

        <!-- Foreground SVG Layer (Rendered OVER nodes, but under popups: endpoint circle selectors, connection preview, marquee) -->
        <svg class="vz-svg-layer vz-svg-foreground" aria-label="UML Canvas Interactions">
          <g
            transform="translate({store.viewport.panX}, {store.viewport.panY}) scale({store.viewport.zoom})"
          >

            {#if gesture.mode === 'connecting'}
              <line
                x1={gesture.startPoint.x}
                y1={gesture.startPoint.y}
                x2={gesture.currentWorld.x}
                y2={gesture.currentWorld.y}
                class="vz-gesture-line"
              />
            {/if}

            {#each doc.edges as edge (edge.id)}
              {@const isEdgeSelected =
                store.selectedIds.includes(edge.id) ||
                (store.selectedIds.includes(edge.source.nodeId) &&
                  store.selectedIds.includes(edge.target.nodeId))}
              {@const srcBox = effectiveNodeLayouts[edge.source.nodeId]}
              {@const tgtBox = effectiveNodeLayouts[edge.target.nodeId]}
              {#if isEdgeSelected && srcBox && tgtBox && !store.isReadOnly}
                {@const handleData = computeEdgeRenderData(
                  edge,
                  srcBox,
                  tgtBox,
                  doc.nodes.find((n) => n.id === edge.source.nodeId),
                  doc.nodes.find((n) => n.id === edge.target.nodeId),
                  doc.defaultRouting,
                  edgeParallelOffsets[edge.id] ?? 0
                )}
                <circle
                  class="vz-endpoint-handle"
                  cx={handleData.startCenter.x}
                  cy={handleData.startCenter.y}
                  r="9"
                  role="presentation"
                  onpointerdown={(event) => event.stopPropagation()}
                  onclick={(event) => {
                    event.stopPropagation();
                    openEndpointPickerPopup(
                      event.clientX,
                      event.clientY,
                      edge,
                      'start',
                      handleData.startDecoration
                    );
                  }}
                />
                <circle
                  class="vz-endpoint-handle"
                  cx={handleData.endCenter.x}
                  cy={handleData.endCenter.y}
                  r="9"
                  role="presentation"
                  onpointerdown={(event) => event.stopPropagation()}
                  onclick={(event) => {
                    event.stopPropagation();
                    openEndpointPickerPopup(
                      event.clientX,
                      event.clientY,
                      edge,
                      'end',
                      handleData.endDecoration
                    );
                  }}
                />
              {/if}
            {/each}
          </g>
        </svg>

        <!-- HTML Labels and Multiplicity Tags -->
        <div
          class="vz-html-frames vz-html-edge-labels"
          style="transform: translate({store.viewport.panX}px, {store.viewport.panY}px) scale({store.viewport.zoom});"
        >
          {#each doc.nodes.filter((n) => n.kind === 'frame') as frame (frame.id)}
            {@const frameBox = effectiveNodeLayouts[frame.id]}
            {#if frameBox}
              {@const frameEditing =
                store.inlineEdit.state.mode === 'node' && store.inlineEdit.state.nodeId === frame.id
                  ? store.inlineEdit.state
                  : null}
              <EdgeLabel
                point={{ x: frameBox.x + 16, y: frameBox.y + 1.5 }}
                label={frame.name || 'Frame'}
                selected={store.selectedIds.includes(frame.id)}
                editing={Boolean(frameEditing)}
                draft={frameEditing?.name ?? ''}
                align="above-left"
                frameLabel
                onselect={() => {
                  if (store.isReadOnly) return;
                  if (store.selectedIds.includes(frame.id)) startInlineNodeEdit(frame);
                  else store.selectSingle(frame.id, false);
                }}
                ondblclick={(event) => {
                  event.stopPropagation();
                  if (!store.isReadOnly) startInlineNodeEdit(frame);
                }}
                onDraftChange={(value) => {
                  if (frameEditing) store.inlineEdit.updateNodeDraft({ name: value });
                }}
                onCommit={() => store.inlineEdit.commitNode(frame)}
                onCancel={() => store.inlineEdit.cancelAll()}
              />
            {/if}
          {/each}

          {#each doc.edges as edge (edge.id)}
            {@const srcBox = effectiveNodeLayouts[edge.source.nodeId]}
            {@const tgtBox = effectiveNodeLayouts[edge.target.nodeId]}
            {#if srcBox && tgtBox}
              {@const srcNode = doc.nodes.find((n) => n.id === edge.source.nodeId)}
              {@const tgtNode = doc.nodes.find((n) => n.id === edge.target.nodeId)}
              {@const isEdgeSelected =
                store.selectedIds.includes(edge.id) ||
                (store.selectedIds.includes(edge.source.nodeId) &&
                  store.selectedIds.includes(edge.target.nodeId))}
              {@const labelData = computeEdgeRenderData(
                edge,
                srcBox,
                tgtBox,
                srcNode,
                tgtNode,
                doc.defaultRouting,
                edgeParallelOffsets[edge.id] ?? 0
              )}
              <EdgeLabel
                point={labelData.geometry.labelPoint}
                label={edge.label}
                selected={isEdgeSelected}
                editing={inlineEditingEdgeId === edge.id}
                draft={inlineEdgeLabelDraft}
                onselect={(event) => {
                  if (store.isReadOnly) return;
                  if (isEdgeSelected) startInlineEdgeLabelEdit(edge);
                  else store.selectSingle(edge.id, event.shiftKey || event.metaKey || event.ctrlKey);
                }}
                ondblclick={(event) => {
                  event.stopPropagation();
                  if (!store.isReadOnly) startInlineEdgeLabelEdit(edge);
                }}
                onDraftChange={(value) => (inlineEdgeLabelDraft = value)}
                onCommit={() => commitInlineEdgeLabel(edge)}
                onCancel={() => (inlineEditingEdgeId = null)}
              />
              <MultiplicityTag
                point={labelData.startMultiplicityPoint}
                text={edge.source.multiplicity}
                selected={isEdgeSelected}
                editing={inlineEditingMultiplicity?.edgeId === edge.id && inlineEditingMultiplicity.end === 'start'}
                draft={inlineEditingMultiplicity?.draft ?? ''}
                onclick={(event) => {
                  event.stopPropagation();
                  if (store.isReadOnly) return;
                  if (isEdgeSelected) startInlineMultiplicityEdit(edge, 'start');
                  else store.selectSingle(edge.id, event.shiftKey || event.metaKey || event.ctrlKey);
                }}
                ondblclick={(event) => {
                  event.stopPropagation();
                  if (!store.isReadOnly) startInlineMultiplicityEdit(edge, 'start');
                }}
                onDraftChange={(value) => {
                  if (inlineEditingMultiplicity) inlineEditingMultiplicity.draft = value;
                }}
                onCommit={() => commitInlineMultiplicity(edge)}
                onCancel={() => (inlineEditingMultiplicity = null)}
              />
              <MultiplicityTag
                point={labelData.endMultiplicityPoint}
                text={edge.target.multiplicity}
                selected={isEdgeSelected}
                editing={inlineEditingMultiplicity?.edgeId === edge.id && inlineEditingMultiplicity.end === 'end'}
                draft={inlineEditingMultiplicity?.draft ?? ''}
                onclick={(event) => {
                  event.stopPropagation();
                  if (store.isReadOnly) return;
                  if (isEdgeSelected) startInlineMultiplicityEdit(edge, 'end');
                  else store.selectSingle(edge.id, event.shiftKey || event.metaKey || event.ctrlKey);
                }}
                ondblclick={(event) => {
                  event.stopPropagation();
                  if (!store.isReadOnly) startInlineMultiplicityEdit(edge, 'end');
                }}
                onDraftChange={(value) => {
                  if (inlineEditingMultiplicity) inlineEditingMultiplicity.draft = value;
                }}
                onCommit={() => commitInlineMultiplicity(edge)}
                onCancel={() => (inlineEditingMultiplicity = null)}
              />
            {/if}
          {/each}
        </div>

        <svg class="vz-svg-layer vz-svg-marquee" aria-label="Marquee Selection">
          <g
            transform="translate({store.viewport.panX}, {store.viewport.panY}) scale({store.viewport.zoom})"
          >
            {#if marqueeRect}
              <rect
                x={marqueeRect.x}
                y={marqueeRect.y}
                width={marqueeRect.width}
                height={marqueeRect.height}
                class="vz-marquee-box"
              />
            {/if}
          </g>
        </svg>

        <!-- Visual Endpoint Shape & Multiplicity Picker Popup -->
        {#if endpointPickerPopup}
          {@const popup = endpointPickerPopup}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="vz-endpoint-popup"
            style="left: {popup.x}px; top: {popup.y}px;"
            onpointerdown={(e) => e.stopPropagation()}
          >
            <div class="vz-endpoint-mult-row">
              <span class="vz-field-label">Multiplicity</span>
              <input
                type="text"
                class="vz-input-mini"
                placeholder="e.g. 1, *, 1..5, 2..*"
                value={popup.multiplicityDraft}
                oninput={(ev) => {
                  if (endpointPickerPopup) {
                    endpointPickerPopup.multiplicityDraft = ev.currentTarget.value;
                  }
                }}
                onchange={() => {
                  commitEndpointMultiplicity();
                }}
                onkeydown={(ke) => {
                  if (ke.key === 'Enter') {
                    closeEndpointPickerPopup();
                  } else if (ke.key === 'Escape') {
                    endpointPickerPopup = null;
                  }
                }}
              />
            </div>

            <div class="vz-endpoint-icon-grid">
              {#each endpointIconChoices as choice}
                {@const preview = renderEndpointPath(choice.decoration)}
                {@const isActive = isSameEndpointChoice(popup.current, choice.decoration)}
                <button
                  type="button"
                  class="vz-endpoint-icon-btn"
                  class:active={isActive}
                  title={choice.label}
                  onclick={() => {
                    commitEndpointMultiplicity();
                    store.dispatchOperation({
                      type: 'uml.updateEndpoint',
                      edgeId: popup.edgeId,
                      end: popup.end,
                      decoration: choice.decoration
                    });
                    endpointPickerPopup = null;
                  }}
                >
                  <svg
                    width="34"
                    height="18"
                    viewBox="-24 -9 26 18"
                    class="vz-endpoint-preview-svg"
                    aria-hidden="true"
                  >
                    <line
                      x1="-22"
                      y1="0"
                      x2={choice.decoration.shape === 'none' || choice.decoration.shape === 'open-arrow'
                        ? '0'
                        : String(-(choice.decoration.size ?? 11))}
                      y2="0"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    {#if preview.d}
                      <path
                        d={preview.d}
                        fill={choice.decoration.fill === 'filled'
                          ? 'currentColor'
                          : 'var(--vscode-editor-background)'}
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"
                      />
                    {/if}
                  </svg>
                  <span>{choice.label}</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      {/if}
</div>
