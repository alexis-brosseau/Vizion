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
    UmlShapeGeometry,
    UmlVisibility
  } from '../../shared/documents/types';
  import {
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
    formatVisibilitySign,
    parseAttributesFromText,
    parseOperationsFromText
  } from '../../shared/operations';
  import {
    getEndpointShape,
    getUmlNodeKind,
    listUmlRelationPresets,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import { postToHost } from '../bridge';
  import type { VizionWebviewStore } from '../state.svelte';
  import UmlInspector from './UmlInspector.svelte';

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
  let inlineNodeNameDraft = $state<string>('');
  let inlineNodeStereotypeDraft = $state<string>('');
  let inlineNodeTextDraft = $state<string>('');
  let inlineNodeAttributesDraft = $state<string>('');
  let inlineNodeOperationsDraft = $state<string>('');
  let inlineEditingEdgeId = $state<string | null>(null);
  let inlineEdgeLabelDraft = $state<string>('');
  let lastPointerWorldPos = $state<Point2D | null>(null);
  let lastSyncedNodeJson = $state<string>('');

  $effect(() => {
    if (inlineEditingNodeId && doc) {
      const target = doc.nodes.find((n) => n.id === inlineEditingNodeId);
      if (target) {
        const json = JSON.stringify({
          name: target.name,
          stereotype: target.stereotype,
          attributes: target.attributes,
          operations: target.operations,
          text: target.text
        });
        if (json !== lastSyncedNodeJson) {
          lastSyncedNodeJson = json;
          inlineNodeNameDraft = target.name ?? '';
          inlineNodeStereotypeDraft =
            target.kind === 'note' || target.kind === 'shape' ? '' : (target.stereotype ?? '');
          inlineNodeTextDraft = target.text ?? '';
          inlineNodeAttributesDraft = formatAttributesToText(target.attributes ?? []);
          inlineNodeOperationsDraft = formatOperationsToText(target.operations ?? []);
        }
      } else {
        inlineEditingNodeId = null;
        lastSyncedNodeJson = '';
      }
    } else {
      lastSyncedNodeJson = '';
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
    const el = nodeElements.get(nodeId);
    const node = doc?.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return { minWidth: 100, minHeight: 60 };
    }

    if (node.kind === 'shape') {
      return { minWidth: 80, minHeight: 60 };
    }

    if (node.kind === 'frame') {
      return { minWidth: 160, minHeight: 120 };
    }

    let contentHeight = 0;
    if (el) {
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i] as HTMLElement;
        if (
          child.classList.contains('vz-connect-port') ||
          child.classList.contains('vz-resize-handle')
        ) {
          continue;
        }
        contentHeight += child.offsetHeight;
      }
      contentHeight += 4;
    }

    const isEditing = inlineEditingNodeId === nodeId;

    if (isEditing) {
      if (node.kind === 'note') {
        const lineCount = Math.max(4, (inlineNodeTextDraft || node.text || '').split('\n').length);
        const editingH = 55 + 24 + lineCount * 18 + 20;
        contentHeight = Math.max(contentHeight, editingH);
      } else {
        const editAttrsRows = Math.max(3, (node.attributes ?? []).length + 1);
        const editOpsRows = Math.max(3, (node.operations ?? []).length + 1);
        const headerH = 100;
        const attrsH = node.showAttributes !== false ? 30 + editAttrsRows * 20 : 30;
        const opsH = node.showOperations !== false ? 30 + editOpsRows * 20 : 30;
        contentHeight = Math.max(contentHeight, headerH + attrsH + opsH + 10);
      }
    } else if (contentHeight <= 4) {
      if (node.kind === 'note') {
        const lineCount = (node.text || node.name || '').split('\n').length;
        contentHeight = 36 + 16 + Math.max(1, lineCount) * 18 + 4;
      } else {
        const headerH = (node.stereotype ? 18 : 0) + 36;
        const attrsCount = (node.attributes ?? []).length;
        const opsCount = (node.operations ?? []).length;
        const attrsH = node.showAttributes !== false && attrsCount > 0 ? 12 + attrsCount * 19 : 0;
        const opsH = node.showOperations !== false && opsCount > 0 ? 12 + opsCount * 19 : 0;
        contentHeight = headerH + attrsH + opsH + 4;
      }
    }

    // A node cannot shrink smaller if it cannot fit into the next grid point.
    // Snap UP to the next grid point that completely contains the content.
    const minGridHeight = Math.max(60, Math.ceil(contentHeight / GRID_SIZE) * GRID_SIZE);
    let minGridWidth = node.kind === 'note' ? 100 : 120;
    if (isEditing) {
      minGridWidth = node.kind === 'note' ? 200 : 240;
    }

    return { minWidth: minGridWidth, minHeight: minGridHeight };
  }

  // Compute live layout boxes including optimistic layouts and grid-snapped gesture preview
  const effectiveNodeLayouts = $derived.by(() => {
    if (!doc) return {};
    const base: Record<string, UmlNodeLayout> = {};
    doc.nodes.forEach((n, idx) => {
      const persisted = doc.layout.nodes[n.id] ?? {
        x: 80 + (idx % 3) * 260,
        y: 80 + Math.floor(idx / 3) * 190,
        width: n.kind === 'frame' ? 260 : 220,
        height: n.kind === 'frame' ? 180 : 140
      };
      // Use optimistic layout while waiting for the host snapshot so nodes never snap back
      const raw = store.optimisticUmlLayouts[n.id] ?? persisted;
      const minSize = getNodeMinContentSize(n.id);
      base[n.id] = {
        ...raw,
        width: Math.max(minSize.minWidth, snapToGrid(raw.width, GRID_SIZE)),
        height: Math.max(minSize.minHeight, snapToGrid(raw.height, GRID_SIZE))
      };
    });

    if (gesture.mode === 'moving') {
      const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
      const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
      const snappedDx = snapToGrid(rawDx, GRID_SIZE);
      const snappedDy = snapToGrid(rawDy, GRID_SIZE);
      for (const [id, init] of Object.entries(gesture.initialLayouts)) {
        base[id] = {
          ...init,
          x: snapToGrid(init.x + snappedDx, GRID_SIZE),
          y: snapToGrid(init.y + snappedDy, GRID_SIZE)
        };
      }

      // If Shift+dragging elements inside a frame, show live expansion preview
      if (gesture.isShift) {
        for (const n of doc.nodes) {
          if (n.kind === 'frame' && n.children && n.children.length > 0) {
            const movingChildBoxes = n.children
              .filter((cid) => cid in gesture.initialLayouts)
              .map((cid) => base[cid])
              .filter((b): b is UmlNodeLayout => Boolean(b));
            if (movingChildBoxes.length > 0) {
              const curBox = base[n.id];
              if (curBox) {
                const cMinX = Math.min(...movingChildBoxes.map((b) => b.x));
                const cMinY = Math.min(...movingChildBoxes.map((b) => b.y));
                const cMaxX = Math.max(...movingChildBoxes.map((b) => b.x + b.width));
                const cMaxY = Math.max(...movingChildBoxes.map((b) => b.y + b.height));
                const fx = Math.min(curBox.x, snapToGrid(cMinX - FRAME_PAD_LEFT, GRID_SIZE));
                const fy = Math.min(curBox.y, snapToGrid(cMinY - FRAME_PAD_TOP, GRID_SIZE));
                const fRight = Math.max(curBox.x + curBox.width, snapToGrid(cMaxX + FRAME_PAD_RIGHT, GRID_SIZE));
                const fBottom = Math.max(curBox.y + curBox.height, snapToGrid(cMaxY + FRAME_PAD_BOTTOM, GRID_SIZE));
                base[n.id] = {
                  x: fx,
                  y: fy,
                  width: Math.max(160, fRight - fx),
                  height: Math.max(120, fBottom - fy)
                };
              }
            }
          }
        }
      }
    } else if (gesture.mode === 'resizing') {
      const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
      const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
      const minW = gesture.minWidth ?? 120;
      const minH = gesture.minHeight ?? 60;
      const init = gesture.initialBox;
      const dir = gesture.handleDirection ?? 'se';
      const cb = gesture.childBounds;

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

      base[gesture.nodeId] = {
        x: newX,
        y: newY,
        width: newW,
        height: newH
      };
    }

    // If a node inside a frame is doubleclicked to edit and grows, temporarily grow the frame so UI fits
    if (inlineEditingNodeId) {
      for (const n of doc.nodes) {
        if (n.kind === 'frame' && n.children && n.children.includes(inlineEditingNodeId)) {
          const editedBox = base[inlineEditingNodeId];
          const curBox = base[n.id];
          if (editedBox && curBox) {
            const fRight = Math.max(
              curBox.x + curBox.width,
              snapToGrid(editedBox.x + editedBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
            );
            const fBottom = Math.max(
              curBox.y + curBox.height,
              snapToGrid(editedBox.y + editedBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
            );
            if (fRight > curBox.x + curBox.width || fBottom > curBox.y + curBox.height) {
              base[n.id] = {
                ...curBox,
                width: Math.max(curBox.width, fRight - curBox.x),
                height: Math.max(curBox.height, fBottom - curBox.y)
              };
            }
          }
        }
      }
    }

    return base;
  });

  // Compute parallel edge offsets when multiple relations connect the same node pair
  const edgeParallelOffsets = $derived.by<Record<string, number>>(() => {
    if (!doc) return {};
    const pairGroups = new Map<string, string[]>();
    for (const edge of doc.edges) {
      const pairKey = [edge.source.nodeId, edge.target.nodeId].sort().join('::');
      const list = pairGroups.get(pairKey) ?? [];
      list.push(edge.id);
      pairGroups.set(pairKey, list);
    }

    const offsets: Record<string, number> = {};
    for (const group of pairGroups.values()) {
      if (group.length <= 1) {
        offsets[group[0]] = 0;
      } else {
        const mid = (group.length - 1) / 2;
        group.forEach((id, i) => {
          offsets[id] = (i - mid) * 22;
        });
      }
    }
    return offsets;
  });

  const marqueeRect = $derived<Rect2D | null>(
    gesture.mode === 'marquee'
      ? normalizeDragRect(gesture.startWorld, gesture.currentWorld)
      : null
  );

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
    const layouts = Object.values(effectiveNodeLayouts);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const box of layouts) {
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    }

    const pad = 60;
    const contentW = Math.max(200, maxX - minX + pad * 2);
    const contentH = Math.max(200, maxY - minY + pad * 2);
    const viewW = Math.max(300, viewportEl.clientWidth);
    const viewH = Math.max(300, viewportEl.clientHeight);

    const zoom = Math.min(1.5, Math.max(0.25, Math.min(viewW / contentW, viewH / contentH)));
    const panX = (viewW - (maxX - minX) * zoom) / 2 - minX * zoom;
    const panY = (viewH - (maxY - minY) * zoom) / 2 - minY * zoom;

    store.setViewport({ panX, panY, zoom });
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
    if (!doc) return { layoutUpdates: {}, childrenUpdates: {} };
    const frames = doc.nodes.filter((n) => n.kind === 'frame');
    if (frames.length === 0) return { layoutUpdates: {}, childrenUpdates: {} };

    // If the user was moving a frame, do not auto-adopt or auto-resize
    const clickedNode = doc.nodes.find((n) => n.id === clickedNodeId);
    const movedFrames = Object.keys(updates).filter((id) =>
      doc?.nodes.find((n) => n.id === id && n.kind === 'frame')
    );
    if (clickedNode?.kind === 'frame' || movedFrames.length > 0) {
      return { layoutUpdates: {}, childrenUpdates: {} };
    }

    const movedNonFrameIds = Object.keys(updates).filter(
      (id) => doc?.nodes.find((n) => n.id === id && n.kind !== 'frame')
    );
    if (movedNonFrameIds.length === 0) {
      return { layoutUpdates: {}, childrenUpdates: {} };
    }

    // Check if the cursor is hovering over any frame
    let hoveredFrame: UmlNode | undefined;
    for (let i = doc.nodes.length - 1; i >= 0; i--) {
      const n = doc.nodes[i];
      if (n.kind !== 'frame') continue;
      const fbox = effectiveNodeLayouts[n.id];
      if (!fbox) continue;

      const labelW = (n.name || 'Frame').length * 7.6 + 16;
      const isOverLabel =
        dropPt.x >= fbox.x + 16 &&
        dropPt.x <= fbox.x + 16 + labelW &&
        dropPt.y >= fbox.y - 10 &&
        dropPt.y <= fbox.y + 10;

      const isOverBody =
        dropPt.x >= fbox.x &&
        dropPt.x <= fbox.x + fbox.width &&
        dropPt.y >= fbox.y &&
        dropPt.y <= fbox.y + fbox.height;

      if (isOverLabel || isOverBody) {
        hoveredFrame = n;
        break;
      }
    }

    const frameChildrenMap = new Map<string, string[]>();
    for (const fr of frames) {
      frameChildrenMap.set(fr.id, [...(fr.children ?? [])]);
    }

    const frameLayoutUpdates: Record<string, UmlNodeLayout> = {};

    if (hoveredFrame) {
      // Check which elements were ALREADY in hoveredFrame before this drag
      const origChildren = new Set(hoveredFrame.children ?? []);
      const hChildren = frameChildrenMap.get(hoveredFrame.id)!;

      let anyNewElementAdded = false;
      let anyShiftExistingResized = false;

      for (const nodeId of movedNonFrameIds) {
        const initBox = initialLayouts[nodeId];
        const frInitBox = initialLayouts[hoveredFrame.id] ?? effectiveNodeLayouts[hoveredFrame.id];
        const wasSpatiallyInside =
          initBox && frInitBox
            ? initBox.x >= frInitBox.x &&
              initBox.y >= frInitBox.y &&
              initBox.x + initBox.width <= frInitBox.x + frInitBox.width &&
              initBox.y + initBox.height <= frInitBox.y + frInitBox.height
            : false;
        const wasAlreadyInside = origChildren.has(nodeId) || wasSpatiallyInside;

        if (!hChildren.includes(nodeId)) {
          hChildren.push(nodeId);
        }
        if (!wasAlreadyInside) {
          anyNewElementAdded = true;
        } else if (isShift) {
          anyShiftExistingResized = true;
        }

        // Remove from any other frames
        for (const fr of frames) {
          if (fr.id === hoveredFrame.id) continue;
          const otherList = frameChildrenMap.get(fr.id);
          if (otherList) {
            const idx = otherList.indexOf(nodeId);
            if (idx !== -1) otherList.splice(idx, 1);
          }
        }
      }

      // The frame auto-resizes ONLY when an element is dragged into it from outside,
      // or when an existing element inside is Shift+dragged.
      const shouldResize = anyNewElementAdded || anyShiftExistingResized;

      if (shouldResize) {
        const baseFrBox = initialLayouts[hoveredFrame.id] ?? doc.layout.nodes[hoveredFrame.id] ?? { x: 0, y: 0, width: 260, height: 180 };
        let frBox = { ...baseFrBox };
        for (const cid of hChildren) {
          const nBox = updates[cid] ?? effectiveNodeLayouts[cid];
          if (!nBox) continue;

          const fx = Math.min(frBox.x, snapToGrid(nBox.x - FRAME_PAD_LEFT, GRID_SIZE));
          const fy = Math.min(frBox.y, snapToGrid(nBox.y - FRAME_PAD_TOP, GRID_SIZE));
          const fRight = Math.max(
            frBox.x + frBox.width,
            snapToGrid(nBox.x + nBox.width + FRAME_PAD_RIGHT, GRID_SIZE)
          );
          const fBottom = Math.max(
            frBox.y + frBox.height,
            snapToGrid(nBox.y + nBox.height + FRAME_PAD_BOTTOM, GRID_SIZE)
          );

          const fw = Math.max(160, fRight - fx);
          const fh = Math.max(120, fBottom - fy);

          if (fx !== frBox.x || fy !== frBox.y || fw !== frBox.width || fh !== frBox.height) {
            frBox = { x: fx, y: fy, width: fw, height: fh };
          }
        }

        const docBox = doc.layout.nodes[hoveredFrame.id];
        if (
          !docBox ||
          frBox.x !== docBox.x ||
          frBox.y !== docBox.y ||
          frBox.width !== docBox.width ||
          frBox.height !== docBox.height
        ) {
          frameLayoutUpdates[hoveredFrame.id] = frBox;
        }
      }
    } else {
      // Cursor is NOT over any frame: node is not into the frame and should overlap it.
      // Remove moved nodes from any frames that previously contained them.
      for (const nodeId of movedNonFrameIds) {
        for (const fr of frames) {
          const cList = frameChildrenMap.get(fr.id);
          if (cList) {
            const idx = cList.indexOf(nodeId);
            if (idx !== -1) {
              cList.splice(idx, 1);
            }
          }
        }
      }
    }

    const changedChildren: Record<string, string[]> = {};
    for (const [fId, children] of frameChildrenMap.entries()) {
      const fr = doc.nodes.find((n) => n.id === fId);
      if (fr && JSON.stringify(fr.children ?? []) !== JSON.stringify(children)) {
        changedChildren[fId] = children;
      }
    }

    return {
      layoutUpdates: frameLayoutUpdates,
      childrenUpdates: changedChildren
    };
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
      inlineNodeAttributesDraft = formatAttributesToText([...existing, newAttr]);
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
      inlineNodeOperationsDraft = formatOperationsToText([...existing, newOp]);
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
            },
            {
              label: 'Add Interface Endpoint',
              action: () => addNodeInterfaceInline(node)
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
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, false);
    }
    inlineEditingNodeId = node.id;
    lastSyncedNodeJson = JSON.stringify({
      name: node.name,
      stereotype: node.stereotype,
      attributes: node.attributes,
      operations: node.operations,
      text: node.text
    });
    inlineNodeNameDraft = node.name ?? '';
    inlineNodeStereotypeDraft =
      node.kind === 'note' || node.kind === 'shape' || node.kind === 'frame' ? '' : (node.stereotype ?? '');
    inlineNodeTextDraft = node.text ?? '';
    inlineNodeAttributesDraft = formatAttributesToText(node.attributes ?? []);
    inlineNodeOperationsDraft = formatOperationsToText(node.operations ?? []);
  }

  function flushInlineNodeHeader(node?: UmlNode): void {
    const nodeId = inlineEditingNodeId;
    if (!nodeId) return;
    const targetNode = node ?? doc?.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const nextName = inlineNodeNameDraft.trim();
    const nextStereo = inlineNodeStereotypeDraft.replace(/^[«<]+|[»>]+$/g, '').trim();

    const updates: { name?: string; stereotype?: string } = {};
    if (nextName !== targetNode.name) {
      updates.name = nextName;
    }
    if (
      targetNode.kind !== 'note' &&
      targetNode.kind !== 'shape' &&
      targetNode.kind !== 'frame' &&
      nextStereo !== (targetNode.stereotype ?? '')
    ) {
      updates.stereotype = nextStereo; // An empty string triggers property deletion on the host
    }

    if (Object.keys(updates).length > 0) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: targetNode.id,
        ...updates
      });
    }
  }

  function flushInlineNodeMembers(node?: UmlNode): void {
    const nodeId = inlineEditingNodeId;
    if (!nodeId) return;
    const targetNode = node ?? doc?.nodes.find((n) => n.id === nodeId);
    if (!targetNode || targetNode.kind === 'note' || targetNode.kind === 'shape' || targetNode.kind === 'frame') return;

    const nextAttrs = parseAttributesFromText(
      inlineNodeAttributesDraft,
      targetNode.id,
      targetNode.attributes ?? []
    );
    const nextOps = parseOperationsFromText(
      inlineNodeOperationsDraft,
      targetNode.id,
      targetNode.operations ?? []
    );

    const updates: { attributes?: UmlAttribute[]; operations?: UmlOperation[] } = {};

    const currAttrs = targetNode.attributes ?? [];
    const attrsChanged =
      nextAttrs.length !== currAttrs.length ||
      nextAttrs.some((a, i) => {
        const c = currAttrs[i];
        return (
          !c ||
          a.name !== c.name ||
          (a.type ?? '') !== (c.type ?? '') ||
          (a.visibility ?? '+') !== (c.visibility ?? '+')
        );
      });
    if (attrsChanged) {
      updates.attributes = nextAttrs;
    }

    const currOps = targetNode.operations ?? [];
    const opsChanged =
      nextOps.length !== currOps.length ||
      nextOps.some((o, i) => {
        const c = currOps[i];
        return (
          !c ||
          o.name !== c.name ||
          (o.returnType ?? '') !== (c.returnType ?? '') ||
          (o.visibility ?? '+') !== (c.visibility ?? '+') ||
          (o.signature ?? '()') !== (c.signature ?? '()')
        );
      });
    if (opsChanged) {
      updates.operations = nextOps;
    }

    if (Object.keys(updates).length > 0) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: targetNode.id,
        ...updates
      });
    }
  }

  function flushInlineNodeText(node?: UmlNode): void {
    const nodeId = inlineEditingNodeId;
    if (!nodeId) return;
    const targetNode = node ?? doc?.nodes.find((n) => n.id === nodeId);
    if (!targetNode || targetNode.kind !== 'note') return;

    if (inlineNodeTextDraft !== (targetNode.text ?? '')) {
      store.dispatchOperation({
        type: 'uml.updateNode',
        nodeId: targetNode.id,
        text: inlineNodeTextDraft
      });
    }
  }

  function commitInlineNodeEdit(node?: UmlNode): void {
    flushInlineNodeHeader(node);
    flushInlineNodeMembers(node);
    flushInlineNodeText(node);
    inlineEditingNodeId = null;
  }

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

  /**
   * Returns SVG path data for a `shape` node (`ellipse`, `rectangle`, `rhombus`, `trapezoid`, `parallelogram`).
   */
  function buildShapeSvgPath(
    shape: UmlShapeGeometry | undefined,
    w: number,
    h: number
  ): string {
    const pad = 2;
    const x0 = pad;
    const y0 = pad;
    const x1 = Math.max(pad + 10, w - pad);
    const y1 = Math.max(pad + 10, h - pad);
    const cx = w / 2;
    const cy = h / 2;

    switch (shape ?? 'rectangle') {
      case 'ellipse': {
        const rx = (x1 - x0) / 2;
        const ry = (y1 - y0) / 2;
        return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
      }
      case 'rhombus': {
        return `M ${cx} ${y0} L ${x1} ${cy} L ${cx} ${y1} L ${x0} ${cy} Z`;
      }
      case 'trapezoid': {
        const inset = Math.min(36, (x1 - x0) * 0.2);
        return `M ${x0 + inset} ${y0} L ${x1 - inset} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
      }
      case 'parallelogram': {
        const skew = Math.min(32, (x1 - x0) * 0.18);
        return `M ${x0 + skew} ${y0} L ${x1} ${y0} L ${x1 - skew} ${y1} L ${x0} ${y1} Z`;
      }
      case 'rectangle':
      default: {
        return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
      }
    }
  }

  /**
   * Renders the diagram elements directly onto an off-screen HTML5 <canvas>
   * with a transparent background, matching the active VS Code theme and canvas DOM styles.
   */
  function renderDiagramToCanvas(): { canvas: HTMLCanvasElement; width: number; height: number } | null {
    if (!doc || doc.nodes.length === 0) return null;

    const layouts = Object.values(effectiveNodeLayouts);
    if (layouts.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const b of layouts) {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    }

    type EdgeGeomItem = {
      edge: UmlEdge;
      geom: ReturnType<typeof computeUmlEdgeGeometry>;
      startDec: EndpointDecoration;
      endDec: EndpointDecoration;
      isDashed: boolean;
      startMarker: { d: string; fill: string };
      endMarker: { d: string; fill: string };
      startMultPt: Point2D;
      endMultPt: Point2D;
    };

    const edgeItems: EdgeGeomItem[] = [];

    for (const edge of doc.edges) {
      const srcBox = effectiveNodeLayouts[edge.source.nodeId];
      const tgtBox = effectiveNodeLayouts[edge.target.nodeId];
      if (!srcBox || !tgtBox) continue;

      const srcNode = doc.nodes.find((n) => n.id === edge.source.nodeId);
      const tgtNode = doc.nodes.find((n) => n.id === edge.target.nodeId);
      const touchesNote = srcNode?.kind === 'note' || tgtNode?.kind === 'note';
      const isDashed = (edge.visual?.line ?? (touchesNote ? 'dashed' : 'solid')) === 'dashed';
      const startDec = edge.visual?.start ?? { shape: 'none', size: 10 };
      const endDec = edge.visual?.end ?? { shape: 'none', size: 10 };

      const geom = computeUmlEdgeGeometry(
        srcBox,
        tgtBox,
        getEdgeRouting(edge),
        startDec,
        endDec,
        edgeParallelOffsets[edge.id] ?? 0,
        undefined,
        undefined,
        srcNode?.kind === 'shape' ? srcNode.shape : undefined,
        tgtNode?.kind === 'shape' ? tgtNode.shape : undefined,
        edge.label
      );

      const startMarker = renderEndpointPath(startDec);
      const endMarker = renderEndpointPath(endDec);
      const startMultPt = getMultiplicityLabelPoint(geom.startTip, geom.startAngleDeg, edge.source.multiplicity);
      const endMultPt = getMultiplicityLabelPoint(geom.endTip, geom.endAngleDeg, edge.target.multiplicity);

      edgeItems.push({
        edge,
        geom,
        startDec,
        endDec,
        isDashed,
        startMarker,
        endMarker,
        startMultPt,
        endMultPt
      });

      if (edge.label) {
        minX = Math.min(minX, geom.labelPoint.x - 50);
        minY = Math.min(minY, geom.labelPoint.y - 20);
        maxX = Math.max(maxX, geom.labelPoint.x + 50);
        maxY = Math.max(maxY, geom.labelPoint.y + 20);
      }
      if (edge.source.multiplicity) {
        minX = Math.min(minX, startMultPt.x - 30);
        minY = Math.min(minY, startMultPt.y - 15);
        maxX = Math.max(maxX, startMultPt.x + 30);
        maxY = Math.max(maxY, startMultPt.y + 15);
      }
      if (edge.target.multiplicity) {
        minX = Math.min(minX, endMultPt.x - 30);
        minY = Math.min(minY, endMultPt.y - 15);
        maxX = Math.max(maxX, endMultPt.x + 30);
        maxY = Math.max(maxY, endMultPt.y + 15);
      }
    }

    const PADDING = 40;
    minX -= PADDING;
    minY -= PADDING;
    maxX += PADDING;
    maxY += PADDING;

    const width = Math.max(200, Math.ceil(maxX - minX));
    const height = Math.max(200, Math.ceil(maxY - minY));

    // Read active theme CSS variables
    const compStyles = viewportEl ? window.getComputedStyle(viewportEl) : null;
    const bodyStyles = typeof document !== 'undefined' ? window.getComputedStyle(document.body) : null;

    function getCssVar(varName: string, fallback: string): string {
      const v = compStyles?.getPropertyValue(varName)?.trim() ||
        bodyStyles?.getPropertyValue(varName)?.trim();
      return v || fallback;
    }

    const widgetBg = getCssVar('--vscode-editorWidget-background', '#252526');
    const editorFg = getCssVar('--vscode-editor-foreground', '#cccccc');
    const panelBorder = getCssVar('--vscode-panel-border', 'rgba(128, 128, 128, 0.35)');
    const descFg = getCssVar('--vscode-descriptionForeground', '#999999');
    const noteBg = getCssVar('--vscode-textBlockQuote-background', widgetBg);
    const editorBg = getCssVar('--vscode-editor-background', '#1e1e1e');
    const fontFamily = getCssVar(
      '--vscode-font-family',
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    );
    const monoFamily = getCssVar(
      '--vscode-editor-font-family',
      'Consolas, "Courier New", monospace'
    );
    const nodeBorder = panelBorder || editorFg;

    const canvas = document.createElement('canvas');
    const scale = 2; // High-resolution retina snapshot
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background remains 100% transparent (no fillRect on background)
    ctx.scale(scale, scale);
    ctx.translate(-minX, -minY);

    function drawRoundRectPath(x: number, y: number, w: number, h: number, r: number): void {
      ctx!.beginPath();
      if (typeof ctx!.roundRect === 'function') {
        ctx!.roundRect(x, y, w, h, r);
      } else {
        ctx!.moveTo(x + r, y);
        ctx!.lineTo(x + w - r, y);
        ctx!.arcTo(x + w, y, x + w, y + r, r);
        ctx!.lineTo(x + w, y + h - r);
        ctx!.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx!.lineTo(x + r, y + h);
        ctx!.arcTo(x, y + h, x, y + h - r, r);
        ctx!.lineTo(x, y + r);
        ctx!.arcTo(x, y, x + r, y, r);
        ctx!.closePath();
      }
    }

    // 1. Render Frames Layer (Rendered in background BEHIND relationships & other nodes)
    for (const node of doc.nodes) {
      if (node.kind !== 'frame') continue;
      const box = effectiveNodeLayouts[node.id];
      if (!box) continue;

      ctx.save();
      ctx.translate(box.x, box.y);

      // Frame outer border (background is completely transparent, double thickness = 3)
      drawRoundRectPath(0, 0, box.width, box.height, 6);
      ctx.strokeStyle = nodeBorder;
      ctx.lineWidth = 3;
      if (node.line === 'dashed') {
        ctx.setLineDash([8, 6]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Frame floating label badge above top-left corner (almost identical to relation label)
      ctx.font = `11px ${fontFamily}`;
      const labelText = node.name || 'Frame';
      const labelMetrics = ctx.measureText(labelText);
      const badgeW = Math.max(labelText.length * 7.6 + 16, labelMetrics.width + 16);
      const badgeH = 20;
      const badgeLeft = 16;
      const badgeTop = -10;

      drawRoundRectPath(badgeLeft, badgeTop, badgeW, badgeH, 4);
      ctx.fillStyle = widgetBg;
      ctx.fill();
      ctx.strokeStyle = panelBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = editorFg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, badgeLeft + badgeW / 2, badgeTop + badgeH / 2);

      ctx.restore();
    }

    // 2. Render Relationships Layer (Rendered OVER frames, but BEHIND element nodes)
    for (const item of edgeItems) {
      const { edge, geom, isDashed, startMarker, endMarker, startDec, endDec, startMultPt, endMultPt } = item;

      // Stroke line
      ctx.save();
      ctx.strokeStyle = editorFg;
      ctx.lineWidth = 1.75;
      if (isDashed) {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }
      const linePath = new Path2D(geom.pathD);
      ctx.stroke(linePath);
      ctx.restore();

      // Start endpoint marker
      if (startMarker.d) {
        ctx.save();
        ctx.translate(geom.startTip.x, geom.startTip.y);
        ctx.rotate((geom.startAngleDeg * Math.PI) / 180);
        const mPath = new Path2D(startMarker.d);
        if (startMarker.fill !== 'none') {
          ctx.fillStyle = startDec.fill === 'filled' ? editorFg : editorBg;
          ctx.fill(mPath);
        }
        ctx.strokeStyle = editorFg;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = 'round';
        ctx.stroke(mPath);
        ctx.restore();
      }

      // End endpoint marker
      if (endMarker.d) {
        ctx.save();
        ctx.translate(geom.endTip.x, geom.endTip.y);
        ctx.rotate((geom.endAngleDeg * Math.PI) / 180);
        const mPath = new Path2D(endMarker.d);
        if (endMarker.fill !== 'none') {
          ctx.fillStyle = endDec.fill === 'filled' ? editorFg : editorBg;
          ctx.fill(mPath);
        }
        ctx.strokeStyle = editorFg;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = 'round';
        ctx.stroke(mPath);
        ctx.restore();
      }

      // Multiplicity Badges
      const drawMult = (pt: Point2D, text: string) => {
        ctx.save();
        ctx.font = `600 10.5px ${monoFamily}`;
        const metrics = ctx.measureText(text);
        const w = Math.max(text.length * 7.6 + 12, metrics.width + 12);
        const h = 17;
        const left = pt.x - w / 2;
        const top = pt.y - 9;
        drawRoundRectPath(left, top, w, h, 3);
        ctx.fillStyle = editorBg;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = panelBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = editorFg;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, pt.x, pt.y - 0.5);
        ctx.restore();
      };

      if (edge.source.multiplicity) {
        drawMult(startMultPt, edge.source.multiplicity);
      }
      if (edge.target.multiplicity) {
        drawMult(endMultPt, edge.target.multiplicity);
      }

      // Edge Label
      if (edge.label) {
        ctx.save();
        ctx.font = `11px ${fontFamily}`;
        const metrics = ctx.measureText(edge.label);
        const w = Math.max(edge.label.length * 7.6 + 16, metrics.width + 16);
        const h = 20;
        const left = geom.labelPoint.x - w / 2;
        const top = geom.labelPoint.y - 10;
        drawRoundRectPath(left, top, w, h, 4);
        ctx.fillStyle = widgetBg;
        ctx.fill();
        ctx.strokeStyle = panelBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = editorFg;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.label, geom.labelPoint.x, geom.labelPoint.y);
        ctx.restore();
      }
    }

    // 3. Render Non-Frame Nodes Layer (Rendered in FRONT of frames & relationships)
    for (const node of doc.nodes) {
      if (node.kind === 'frame') continue;
      const box = effectiveNodeLayouts[node.id];
      if (!box) continue;

      const domEl = nodeElements.get(node.id);

      if (node.kind === 'shape') {
        ctx.save();
        ctx.translate(box.x, box.y);
        const shapePathD = buildShapeSvgPath(node.shape, box.width, box.height);
        const p = new Path2D(shapePathD);

        // Subtle drop shadow matching CSS filter
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = widgetBg;
        ctx.fill(p);
        ctx.restore();

        // Border stroke
        ctx.strokeStyle = nodeBorder;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = 'round';
        ctx.stroke(p);

        // Centered title text
        ctx.fillStyle = editorFg;
        ctx.font = `600 13px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name || '', box.width / 2, box.height / 2);
        ctx.restore();
        continue;
      }

      if (node.kind === 'note') {
        ctx.save();
        ctx.translate(box.x, box.y);

        // Drop shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        drawRoundRectPath(0, 0, box.width, box.height, 5);
        ctx.fillStyle = noteBg;
        ctx.fill();
        ctx.restore();

        // Dashed border
        drawRoundRectPath(0, 0, box.width, box.height, 5);
        ctx.strokeStyle = nodeBorder;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Clip to rounded bounds
        ctx.save();
        drawRoundRectPath(0, 0, box.width, box.height, 5);
        ctx.clip();

        // Note Header (Title)
        const domHeader = domEl?.querySelector('.vz-uml-node-header') as HTMLElement | null;
        const headerH = domHeader ? domHeader.offsetHeight : 30;

        ctx.fillStyle = editorFg;
        ctx.font = `600 13px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name || '', box.width / 2, (headerH - 16) / 2);

        // Divider below header
        ctx.strokeStyle = panelBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, headerH);
        ctx.lineTo(box.width, headerH);
        ctx.stroke();

        // Note content
        const noteContent = node.text || '';
        ctx.fillStyle = editorFg;
        ctx.font = `12px ${fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const padX = 10;
        const padY = headerH + 8;
        const maxW = box.width - padX * 2;
        const lineH = 16.8;

        const lines = noteContent.split('\n');
        let curY = padY;
        for (const line of lines) {
          if (curY + lineH > box.height) break;
          if (!line) {
            curY += lineH;
            continue;
          }
          const words = line.split(' ');
          let currentLine = '';
          for (let i = 0; i < words.length; i++) {
            const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
            if (ctx.measureText(testLine).width > maxW && currentLine) {
              ctx.fillText(currentLine, padX, curY);
              curY += lineH;
              if (curY + lineH > box.height) break;
              currentLine = words[i];
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine && curY + lineH <= box.height + 4) {
            ctx.fillText(currentLine, padX, curY);
            curY += lineH;
          }
        }

        ctx.restore(); // unclip
        ctx.restore(); // untranslate
        continue;
      }

      // Class / Interface / Entity / Other UML Nodes
      ctx.save();
      ctx.translate(box.x, box.y);

      // Card drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      drawRoundRectPath(0, 0, box.width, box.height, 5);
      ctx.fillStyle = widgetBg;
      ctx.fill();
      ctx.restore();

      // Card border
      drawRoundRectPath(0, 0, box.width, box.height, 5);
      ctx.strokeStyle = nodeBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Clip content to rounded rect
      ctx.save();
      drawRoundRectPath(0, 0, box.width, box.height, 5);
      ctx.clip();

      const kindDesc = getUmlNodeKind(node.kind);
      const stereotypeText = node.stereotype || kindDesc?.defaultStereotype || (!kindDesc ? `unsupported: ${node.kind}` : '');
      const hasStereotype = !!stereotypeText;

      const domHeader = domEl?.querySelector('.vz-uml-node-header') as HTMLElement | null;
      const headerH = domHeader ? domHeader.offsetHeight : (hasStereotype ? 42 : 30);

      let titleY: number;
      if (hasStereotype) {
        ctx.fillStyle = descFg;
        ctx.font = `11px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`«${stereotypeText}»`, box.width / 2, 7);

        titleY = 22;
      } else {
        titleY = (headerH - 16) / 2;
      }

      ctx.fillStyle = editorFg;
      ctx.font = `600 13px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.name || '', box.width / 2, titleY);

      // Divider below header
      ctx.strokeStyle = panelBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, headerH);
      ctx.lineTo(box.width, headerH);
      ctx.stroke();

      let curY = headerH;

      // Attributes Compartment
      const attrsVisible = node.showAttributes !== false;
      const attrs = node.attributes ?? [];
      if (attrsVisible && attrs.length > 0) {
        const compPadY = 5;
        const compPadX = 8;
        const memberLineH = 16.7;
        const domComp0 = domEl?.querySelectorAll('.vz-uml-compartment')[0] as HTMLElement | null;
        const comp0H = domComp0 ? domComp0.offsetHeight : (compPadY * 2 + attrs.length * memberLineH);

        let lineY = curY + compPadY;
        for (const attr of attrs) {
          const visSign = formatVisibilitySign(attr.visibility);
          ctx.font = `bold 11.5px ${monoFamily}`;
          ctx.fillStyle = editorFg;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(visSign, compPadX, lineY);

          const nameX = compPadX + 16;
          ctx.font = `11.5px ${monoFamily}`;
          ctx.fillText(attr.name || '', nameX, lineY);

          if (attr.type) {
            const nameW = ctx.measureText(attr.name || '').width;
            ctx.fillStyle = descFg;
            ctx.fillText(`: ${attr.type}`, nameX + nameW, lineY);
          }

          lineY += memberLineH;
        }

        curY += comp0H;

        // Divider below attributes compartment
        ctx.strokeStyle = panelBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, curY);
        ctx.lineTo(box.width, curY);
        ctx.stroke();
      }

      // Operations Compartment
      const opsVisible = node.showOperations !== false;
      const ops = node.operations ?? [];
      if (opsVisible && ops.length > 0) {
        const compPadY = 5;
        const compPadX = 8;
        const memberLineH = 16.7;
        let lineY = curY + compPadY;

        for (const op of ops) {
          const visSign = formatVisibilitySign(op.visibility);
          ctx.font = `bold 11.5px ${monoFamily}`;
          ctx.fillStyle = editorFg;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(visSign, compPadX, lineY);

          const nameX = compPadX + 16;
          ctx.font = `11.5px ${monoFamily}`;
          const params = extractOperationParameters(op);
          const paramsStr = params.map((p) => p.name + (p.type ? `: ${p.type}` : '')).join(', ');
          const sigText = `${op.name || ''}(${paramsStr})`;
          ctx.fillText(sigText, nameX, lineY);

          if (op.returnType) {
            const sigW = ctx.measureText(sigText).width;
            ctx.fillStyle = descFg;
            ctx.fillText(`: ${op.returnType}`, nameX + sigW, lineY);
          }

          lineY += memberLineH;
        }
      }

      ctx.restore(); // unclip
      ctx.restore(); // un-translate node
    }

    return { canvas, width, height };
  }

  async function exportToClipboard(): Promise<void> {
    try {
      const render = renderDiagramToCanvas();
      if (!render) {
        store.setStatusMessage('No diagram content to export.');
        return;
      }
      const { canvas } = render;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('Canvas snapshot generation failed');

      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');

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
      const render = renderDiagramToCanvas();
      if (!render) {
        store.setStatusMessage('No diagram content to export.');
        return;
      }
      const { canvas } = render;

      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
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

<div class="vz-workspace">
  <div class="vz-main-split">
    <!-- Interactive World-Coordinate Canvas -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      bind:this={viewportEl}
      class="vz-viewport vz-canvas-bg"
      class:space-grab={spacePressed}
      class:space-grabbing={gesture.mode === 'panning'}
      style="background-size: {gridSpacing}px {gridSpacing}px; background-position: {gridPosX}px {gridPosY}px; background-image: radial-gradient(rgba(128, 128, 128, {gridOpacity}) {gridDotRadius}px, transparent {gridDotRadius}px);"
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
            {@const isSelected = store.selectedIds.includes(node.id)}
            {@const isInlineEditing = inlineEditingNodeId === node.id}
            {#if box}
              <div
                use:registerNodeElement={node.id}
                class="vz-uml-node kind-frame"
                class:selected={isSelected}
                class:inline-editing={isInlineEditing}
                class:dashed={node.line === 'dashed'}
                style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px;"
                role="button"
                tabindex="0"
                aria-label="UML frame {node.name}"
                onpointerdown={(e) => handleNodePointerDown(e, node)}
                oncontextmenu={(e) => handleNodeContextMenu(e, node)}
                ondblclick={(e) => {
                  e.stopPropagation();
                  if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                  startInlineNodeEdit(node);
                }}
              >
                {#if !store.isReadOnly}
                  <!-- Frame Border Hit Zones for Resizing 1 side -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-frame-edge-hit top"
                    title="Drag to resize top side"
                    onpointerdown={(e) => handleResizeHandlePointerDown(e, node, 'n')}
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-frame-edge-hit bottom"
                    title="Drag to resize bottom side"
                    onpointerdown={(e) => handleResizeHandlePointerDown(e, node, 's')}
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-frame-edge-hit left"
                    title="Drag to resize left side"
                    onpointerdown={(e) => handleResizeHandlePointerDown(e, node, 'w')}
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-frame-edge-hit right"
                    title="Drag to resize right side"
                    onpointerdown={(e) => handleResizeHandlePointerDown(e, node, 'e')}
                  ></div>
                {/if}

                <!-- Resize Handle on Bottom-Right Corner -->
                {#if isSelected && !store.isReadOnly}
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-resize-handle"
                    title="Drag to resize frame (snaps to 20px grid)"
                    onpointerdown={(e) => handleResizeHandlePointerDown(e, node, 'se')}
                  ></div>
                {/if}
              </div>
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
                {@const touchesNote = srcNode?.kind === 'note' || tgtNode?.kind === 'note'}
                {@const isDashed = (edge.visual?.line ?? (touchesNote ? 'dashed' : 'solid')) === 'dashed'}
                {@const startDec = edge.visual?.start ?? { shape: 'none', size: 10 }}
                {@const endDec = edge.visual?.end ?? { shape: 'none', size: 10 }}
                {@const geom = computeUmlEdgeGeometry(
                  srcBox,
                  tgtBox,
                  getEdgeRouting(edge),
                  startDec,
                  endDec,
                  edgeParallelOffsets[edge.id] ?? 0,
                  undefined,
                  undefined,
                  srcNode?.kind === 'shape' ? srcNode.shape : undefined,
                  tgtNode?.kind === 'shape' ? tgtNode.shape : undefined,
                  edge.label
                )}
                {@const startMarker = renderEndpointPath(startDec)}
                {@const endMarker = renderEndpointPath(endDec)}
                {@const startCenter = getEndpointVisualCenter(
                  geom.startTip,
                  geom.startAngleDeg,
                  startDec
                )}
                {@const endCenter = getEndpointVisualCenter(
                  geom.endTip,
                  geom.endAngleDeg,
                  endDec
                )}
                {@const startMultPt = getMultiplicityLabelPoint(
                  geom.startTip,
                  geom.startAngleDeg,
                  edge.source.multiplicity
                )}
                {@const endMultPt = getMultiplicityLabelPoint(
                  geom.endTip,
                  geom.endAngleDeg,
                  edge.target.multiplicity
                )}
                {@const isEdgeSelected =
                  store.selectedIds.includes(edge.id) ||
                  (store.selectedIds.includes(edge.source.nodeId) &&
                   store.selectedIds.includes(edge.target.nodeId))}

                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <g
                  class="vz-edge-group"
                  class:selected={isEdgeSelected}
                  oncontextmenu={(e) => handleEdgeContextMenu(e, edge)}
                >
                  <!-- Wide transparent hit target for easy clicking -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <path
                    d={geom.hitPathD}
                    class="vz-edge-hit"
                    onclick={(e) => {
                      e.stopPropagation();
                      if (inlineEditingNodeId) commitInlineNodeEdit();
                      store.selectSingle(edge.id, e.shiftKey || e.metaKey || e.ctrlKey);
                    }}
                    ondblclick={(e) => {
                      e.stopPropagation();
                      if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                      startInlineEdgeLabelEdit(edge);
                    }}
                  />

                  <!-- Trimmed visible relation path -->
                  <path
                    d={geom.pathD}
                    class="vz-edge-stroke"
                    stroke-dasharray={isDashed ? '6 4' : undefined}
                  />

                  <!-- Start Endpoint Decoration -->
                  {#if startMarker.d}
                    <path
                      d={startMarker.d}
                      fill={startMarker.fill}
                      class="vz-endpoint-marker"
                      transform="translate({geom.startTip.x}, {geom.startTip.y}) rotate({geom.startAngleDeg})"
                    />
                  {/if}

                  <!-- End Endpoint Decoration -->
                  {#if endMarker.d}
                    <path
                      d={endMarker.d}
                      fill={endMarker.fill}
                      class="vz-endpoint-marker"
                      transform="translate({geom.endTip.x}, {geom.endTip.y}) rotate({geom.endAngleDeg})"
                    />
                  {/if}

                  <!-- Source Multiplicity Label (Blank by default; double-click to edit) -->
                  {#if edge.source.multiplicity}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <g
                      class="vz-edge-mult-group"
                      transform="translate({startMultPt.x}, {startMultPt.y})"
                      onclick={(e) => {
                        e.stopPropagation();
                        if (inlineEditingNodeId) commitInlineNodeEdit();
                        store.selectSingle(edge.id, false);
                      }}
                      ondblclick={(e) => {
                        e.stopPropagation();
                        if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineMultiplicityEdit(edge, 'start');
                      }}
                    >
                      <rect
                        x={-(edge.source.multiplicity.length * 3.8 + 6)}
                        y="-9"
                        width={edge.source.multiplicity.length * 7.6 + 12}
                        height="17"
                        rx="3"
                        class="vz-edge-mult-bg"
                      />
                      <text text-anchor="middle" dy="3" class="vz-edge-mult-text">
                        {edge.source.multiplicity}
                      </text>
                    </g>
                  {/if}

                  <!-- Target Multiplicity Label (Blank by default; double-click to edit) -->
                  {#if edge.target.multiplicity}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <g
                      class="vz-edge-mult-group"
                      transform="translate({endMultPt.x}, {endMultPt.y})"
                      onclick={(e) => {
                        e.stopPropagation();
                        if (inlineEditingNodeId) commitInlineNodeEdit();
                        store.selectSingle(edge.id, false);
                      }}
                      ondblclick={(e) => {
                        e.stopPropagation();
                        if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineMultiplicityEdit(edge, 'end');
                      }}
                    >
                      <rect
                        x={-(edge.target.multiplicity.length * 3.8 + 6)}
                        y="-9"
                        width={edge.target.multiplicity.length * 7.6 + 12}
                        height="17"
                        rx="3"
                        class="vz-edge-mult-bg"
                      />
                      <text text-anchor="middle" dy="3" class="vz-edge-mult-text">
                        {edge.target.multiplicity}
                      </text>
                    </g>
                  {/if}

                  <!-- Edge Label (Double-click to edit directly on canvas) -->
                  {#if edge.label && inlineEditingEdgeId !== edge.id}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <g
                      class="vz-edge-label-group"
                      transform="translate({geom.labelPoint.x}, {geom.labelPoint.y})"
                      onclick={(e) => {
                        e.stopPropagation();
                        if (inlineEditingNodeId) commitInlineNodeEdit();
                        store.selectSingle(edge.id, e.shiftKey || e.metaKey || e.ctrlKey);
                      }}
                      ondblclick={(e) => {
                        e.stopPropagation();
                        if (store.isReadOnly || e.shiftKey || e.ctrlKey || e.metaKey) return;
                        startInlineEdgeLabelEdit(edge);
                      }}
                    >
                      <rect
                        x={-(edge.label.length * 3.8 + 8)}
                        y="-10"
                        width={edge.label.length * 7.6 + 16}
                        height="20"
                        rx="4"
                        class="vz-edge-label-bg"
                      />
                      <text text-anchor="middle" dominant-baseline="central" class="vz-edge-label-text">
                        {edge.label}
                      </text>
                    </g>
                  {/if}
                </g>
              {/if}
            {/each}

            <!-- Frame Floating Labels (identical to relation labels) -->
            {#each doc.nodes.filter((n) => n.kind === 'frame') as frame (frame.id)}
              {@const fbox = effectiveNodeLayouts[frame.id]}
              {#if fbox}
                {@const labelText = frame.name || 'Frame'}
                {@const labelW = labelText.length * 7.6 + 16}
                {#if inlineEditingNodeId !== frame.id}
                  <g
                    class="vz-edge-label-group vz-frame-label-group"
                    transform="translate({fbox.x + 16}, {fbox.y})"
                    role="button"
                    tabindex="0"
                    aria-label="Edit frame label {labelText}"
                    onpointerdown={(e) => {
                      handleNodePointerDown(e, frame);
                    }}
                    ondblclick={(e) => {
                      e.stopPropagation();
                      if (!store.isReadOnly) startInlineNodeEdit(frame);
                    }}
                  >
                    <rect
                      x="0"
                      y="-10"
                      width={labelW}
                      height="20"
                      rx="4"
                      class="vz-edge-label-bg"
                    />
                    <text x={labelW / 2} y="0" text-anchor="middle" dominant-baseline="central" class="vz-edge-label-text">
                      {labelText}
                    </text>
                  </g>
                {/if}
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
            {@const isSelected = store.selectedIds.includes(node.id)}
            {@const isInlineEditing = inlineEditingNodeId === node.id}
            {@const kindDesc = getUmlNodeKind(node.kind)}
            {@const attrsExplicitlyShown = node.showAttributes !== false}
            {@const opsExplicitlyShown = node.showOperations !== false}
            {@const hasAttrs = (node.attributes ?? []).length > 0}
            {@const hasOps = (node.operations ?? []).length > 0}
            {@const attrsVisible = isInlineEditing ? attrsExplicitlyShown : (attrsExplicitlyShown && hasAttrs)}
            {@const opsVisible = isInlineEditing ? opsExplicitlyShown : (opsExplicitlyShown && hasOps)}
            {#if box}
              <div
                use:registerNodeElement={node.id}
                class="vz-uml-node kind-{node.kind}"
                class:selected={isSelected}
                class:inline-editing={isInlineEditing}
                class:unsupported={!kindDesc}
                style="left: {box.x}px; top: {box.y}px; width: {box.width}px; height: {box.height}px; min-height: {box.height}px;"
                role="button"
                tabindex="0"
                aria-label="UML {node.kind} {node.name}"
                onpointerdown={(e) => handleNodePointerDown(e, node)}
                oncontextmenu={(e) => handleNodeContextMenu(e, node)}
                ondblclick={(e) => {
                  e.stopPropagation();
                  if (store.isReadOnly || !kindDesc || e.shiftKey || e.ctrlKey || e.metaKey) return;
                  startInlineNodeEdit(node);
                }}
              >
                {#if node.kind === 'shape'}
                  <!-- Geometric Shape Node (Ellipse, Rectangle, Rhombus, Trapezoid, Parallelogram) -->
                  <svg
                    class="vz-shape-node-svg"
                    width={box.width}
                    height={box.height}
                    viewBox="0 0 {box.width} {box.height}"
                    aria-hidden="true"
                  >
                    <path
                      d={buildShapeSvgPath(node.shape, box.width, box.height)}
                      class="vz-shape-node-path"
                    />
                  </svg>

                  <div class="vz-shape-node-content">
                    {#if isInlineEditing}
                      <!-- svelte-ignore a11y_autofocus -->
                      <input
                        type="text"
                        class="vz-inline-input vz-shape-inline-input"
                        use:focusInput
                        bind:value={inlineNodeNameDraft}
                        onblur={() => flushInlineNodeHeader(node)}
                        onchange={() => flushInlineNodeHeader(node)}
                        onkeydown={(ke) => {
                          if (ke.key === 'Enter') {
                            commitInlineNodeEdit(node);
                          } else if (ke.key === 'Escape') {
                            inlineEditingNodeId = null;
                          }
                        }}
                      />
                    {:else}
                      <div class="vz-uml-node-title">{node.name}</div>
                    {/if}
                  </div>
                {:else}
                  <div class="vz-uml-node-header">
                    {#if isInlineEditing}
                      {#if node.kind === 'note'}
                        <div class="vz-inline-field">
                          <div class="vz-inline-sec-hdr">
                            <span>Name</span>
                          </div>
                          <input
                            type="text"
                            class="vz-inline-input"
                            bind:value={inlineNodeNameDraft}
                            onblur={() => flushInlineNodeHeader(node)}
                            onchange={() => flushInlineNodeHeader(node)}
                            onkeydown={(ke) => {
                              if (ke.key === 'Enter') {
                                commitInlineNodeEdit(node);
                              } else if (ke.key === 'Escape') {
                                inlineEditingNodeId = null;
                              }
                            }}
                          />
                        </div>
                      {:else}
                        <div class="vz-inline-fields">
                          <div class="vz-inline-field">
                            <div class="vz-inline-sec-hdr">
                              <span>Name</span>
                            </div>
                            <input
                              type="text"
                              class="vz-inline-input"
                              placeholder="Name"
                              bind:value={inlineNodeNameDraft}
                              onblur={() => flushInlineNodeHeader(node)}
                              onchange={() => flushInlineNodeHeader(node)}
                              onkeydown={(ke) => {
                                if (ke.key === 'Enter') {
                                  commitInlineNodeEdit(node);
                                } else if (ke.key === 'Escape') {
                                  inlineEditingNodeId = null;
                                }
                              }}
                            />
                          </div>
                          <div class="vz-inline-field">
                            <div class="vz-inline-sec-hdr">
                              <span>Stereotype</span>
                            </div>
                            <input
                              type="text"
                              class="vz-inline-input"
                              placeholder="e.g. entity, service"
                              bind:value={inlineNodeStereotypeDraft}
                              onblur={() => flushInlineNodeHeader(node)}
                              onchange={() => flushInlineNodeHeader(node)}
                              onkeydown={(ke) => {
                                if (ke.key === 'Enter') {
                                  commitInlineNodeEdit(node);
                                } else if (ke.key === 'Escape') {
                                  inlineEditingNodeId = null;
                                }
                              }}
                            />
                          </div>
                        </div>
                      {/if}
                    {:else}
                      {#if node.kind !== 'note' && (node.stereotype || kindDesc?.defaultStereotype)}
                        <div class="vz-uml-stereotype">
                          «{node.stereotype || kindDesc?.defaultStereotype}»
                        </div>
                      {:else if !kindDesc}
                        <div class="vz-uml-stereotype">«unsupported: {node.kind}»</div>
                      {/if}
                      <div class="vz-uml-node-title">{node.name}</div>
                    {/if}
                  </div>

                  {#if node.kind === 'note'}
                    {#if isInlineEditing}
                      <div class="vz-uml-note-body">
                        <div class="vz-inline-sec-hdr">
                          <span>Content</span>
                        </div>
                        <textarea
                          class="vz-inline-textarea"
                          rows="4"
                          placeholder="Note content…"
                          bind:value={inlineNodeTextDraft}
                          onblur={() => flushInlineNodeText(node)}
                          onchange={() => flushInlineNodeText(node)}
                          onkeydown={(ke) => {
                            if (ke.key === 'Escape') inlineEditingNodeId = null;
                          }}
                        ></textarea>
                      </div>
                    {:else}
                      <div class="vz-uml-note-body">
                        {node.text || node.name}
                      </div>
                    {/if}
                  {:else}
                    <!-- Attributes Compartment -->
                    {#if attrsVisible || isInlineEditing}
                      <div class="vz-uml-compartment">
                        {#if isInlineEditing}
                          <div class="vz-inline-sec-hdr">
                            <span>Attributes</span>
                            <button
                              type="button"
                              class="vz-eye-toggle-btn"
                              class:off={!attrsVisible}
                              title={attrsVisible ? 'Hide Attributes' : 'Show Attributes'}
                              onclick={(e) => {
                                e.stopPropagation();
                                store.dispatchOperation({
                                  type: 'uml.updateNode',
                                  nodeId: node.id,
                                  showAttributes: !attrsVisible
                                });
                              }}
                            >
                              {@render eyeIcon(attrsVisible)}
                            </button>
                          </div>
                          {#if attrsVisible}
                            <textarea
                              class="vz-inline-textarea"
                              rows={Math.max(3, (node.attributes ?? []).length + 1)}
                              placeholder="+ name: type&#10;- privateField: string"
                              bind:value={inlineNodeAttributesDraft}
                              onblur={() => flushInlineNodeMembers(node)}
                              onchange={() => flushInlineNodeMembers(node)}
                              onkeydown={(ke) => {
                                if (ke.key === 'Escape') inlineEditingNodeId = null;
                              }}
                            ></textarea>
                          {/if}
                        {:else}
                          {#each node.attributes ?? [] as attr (attr.id)}
                            <div class="vz-uml-member">
                              <span class="vz-vis">{formatVisibilitySign(attr.visibility)}</span>
                              <span>{attr.name}</span>
                              {#if attr.type}
                                <span class="vz-type">: {attr.type}</span>
                              {/if}
                            </div>
                          {/each}
                        {/if}
                      </div>
                    {/if}

                    <!-- Operations Compartment -->
                    {#if opsVisible || isInlineEditing}
                      <div class="vz-uml-compartment">
                        {#if isInlineEditing}
                          <div class="vz-inline-sec-hdr">
                            <span>Operations</span>
                            <button
                              type="button"
                              class="vz-eye-toggle-btn"
                              class:off={!opsVisible}
                              title={opsVisible ? 'Hide Operations' : 'Show Operations'}
                              onclick={(e) => {
                                e.stopPropagation();
                                store.dispatchOperation({
                                  type: 'uml.updateNode',
                                  nodeId: node.id,
                                  showOperations: !opsVisible
                                });
                              }}
                            >
                              {@render eyeIcon(opsVisible)}
                            </button>
                          </div>
                          {#if opsVisible}
                            <textarea
                              class="vz-inline-textarea"
                              rows={Math.max(3, (node.operations ?? []).length + 1)}
                              placeholder="+ method(): returnType&#10;+ execute(arg: type)"
                              bind:value={inlineNodeOperationsDraft}
                              onblur={() => flushInlineNodeMembers(node)}
                              onchange={() => flushInlineNodeMembers(node)}
                              onkeydown={(ke) => {
                                if (ke.key === 'Escape') inlineEditingNodeId = null;
                              }}
                            ></textarea>
                          {/if}
                        {:else}
                          {#each node.operations ?? [] as op (op.id)}
                            {@const params = extractOperationParameters(op)}
                            <div class="vz-uml-member">
                              <span class="vz-vis">{formatVisibilitySign(op.visibility)}</span>
                              <span>{op.name}(</span>{#each params as param, pIdx (param.id ?? pIdx)}{#if pIdx > 0}, {/if}<span>{param.name}</span>{#if param.type}<span class="vz-type">: {param.type}</span>{/if}{/each}<span>)</span>
                              {#if op.returnType}
                                <span class="vz-type">: {op.returnType}</span>
                              {/if}
                            </div>
                          {/each}
                        {/if}
                      </div>
                    {/if}
                  {/if}
                {/if}

                {#if !store.isReadOnly && kindDesc}
                  <!-- Default Connection Port on Right Edge: Drag to another node to immediately connect a line -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="vz-connect-port"
                    title="Drag to another node to connect relation"
                    onpointerdown={(e) => handleConnectPortPointerDown(e, node)}
                  ></div>

                  <!-- Resize Handle on Bottom-Right Corner -->
                  {#if isSelected}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="vz-resize-handle"
                      title="Drag to resize node (snaps to 20px grid)"
                      onpointerdown={(e) => handleResizeHandlePointerDown(e, node)}
                    ></div>
                  {/if}
                {/if}
              </div>
            {/if}
          {/each}
        </div>

        <!-- Foreground SVG Layer (Rendered OVER nodes, but under popups: endpoint circle selectors, connection preview, marquee) -->
        <svg class="vz-svg-layer vz-svg-foreground" aria-label="UML Canvas Interactions">
          <g
            transform="translate({store.viewport.panX}, {store.viewport.panY}) scale({store.viewport.zoom})"
          >
            <!-- Endpoint Circle Selectors for Selected Relations (Positioned over nodes) -->
            {#if !store.isReadOnly}
              {#each doc.edges as edge (edge.id)}
                {@const isEdgeSelected =
                  store.selectedIds.includes(edge.id) ||
                  (store.selectedIds.includes(edge.source.nodeId) &&
                   store.selectedIds.includes(edge.target.nodeId))}
                {#if isEdgeSelected}
                  {@const srcBox = effectiveNodeLayouts[edge.source.nodeId]}
                  {@const tgtBox = effectiveNodeLayouts[edge.target.nodeId]}
                  {#if srcBox && tgtBox}
                    {@const startDec = edge.visual?.start ?? { shape: 'none', size: 10 }}
                    {@const endDec = edge.visual?.end ?? { shape: 'none', size: 10 }}
                    {@const srcNode = doc.nodes.find((n) => n.id === edge.source.nodeId)}
                    {@const tgtNode = doc.nodes.find((n) => n.id === edge.target.nodeId)}
                    {@const geom = computeUmlEdgeGeometry(
                      srcBox,
                      tgtBox,
                      getEdgeRouting(edge),
                      startDec,
                      endDec,
                      edgeParallelOffsets[edge.id] ?? 0,
                      undefined,
                      undefined,
                      srcNode?.kind === 'shape' ? srcNode.shape : undefined,
                      tgtNode?.kind === 'shape' ? tgtNode.shape : undefined,
                      edge.label
                    )}
                    {@const startCenter = getEndpointVisualCenter(
                      geom.startTip,
                      geom.startAngleDeg,
                      startDec
                    )}
                    {@const endCenter = getEndpointVisualCenter(
                      geom.endTip,
                      geom.endAngleDeg,
                      endDec
                    )}

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <circle
                      cx={startCenter.x}
                      cy={startCenter.y}
                      r={Math.max(9, 10 / store.viewport.zoom)}
                      class="vz-endpoint-picker-target"
                      onclick={(e) => {
                        e.stopPropagation();
                        openEndpointPickerPopup(
                          e.clientX,
                          e.clientY,
                          edge,
                          'start',
                          startDec
                        );
                      }}
                    >
                      <title>Click to customize START endpoint shape & multiplicity</title>
                    </circle>

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <circle
                      cx={endCenter.x}
                      cy={endCenter.y}
                      r={Math.max(9, 10 / store.viewport.zoom)}
                      class="vz-endpoint-picker-target"
                      onclick={(e) => {
                        e.stopPropagation();
                        openEndpointPickerPopup(
                          e.clientX,
                          e.clientY,
                          edge,
                          'end',
                          endDec
                        );
                      }}
                    >
                      <title>Click to customize END endpoint shape & multiplicity</title>
                    </circle>
                  {/if}
                {/if}
              {/each}
            {/if}

            {#if gesture.mode === 'connecting'}
              <line
                x1={gesture.startPoint.x}
                y1={gesture.startPoint.y}
                x2={gesture.currentWorld.x}
                y2={gesture.currentWorld.y}
                class="vz-gesture-line"
              />
            {/if}

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

        <!-- Inline Connection Label Editor Floating directly on the Edge Midpoint -->
        {#if inlineEditingEdgeId}
          {@const editingEdge = inlineEditingEdgeId ? doc.edges.find((e) => e.id === inlineEditingEdgeId) : undefined}
          {#if editingEdge}
            {@const srcB = effectiveNodeLayouts[editingEdge.source.nodeId]}
            {@const tgtB = effectiveNodeLayouts[editingEdge.target.nodeId]}
            {#if srcB && tgtB}
              {@const srcNode = doc.nodes.find((n) => n.id === editingEdge.source.nodeId)}
              {@const tgtNode = doc.nodes.find((n) => n.id === editingEdge.target.nodeId)}
              {@const g = computeUmlEdgeGeometry(
                srcB,
                tgtB,
                getEdgeRouting(editingEdge),
                editingEdge.visual?.start,
                editingEdge.visual?.end,
                edgeParallelOffsets[editingEdge.id] ?? 0,
                undefined,
                undefined,
                srcNode?.kind === 'shape' ? srcNode.shape : undefined,
                tgtNode?.kind === 'shape' ? tgtNode.shape : undefined,
                inlineEdgeLabelDraft || editingEdge.label
              )}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="vz-floating-edge-label-editor"
                style="left: {g.labelPoint.x * store.viewport.zoom + store.viewport.panX}px; top: {g.labelPoint.y * store.viewport.zoom + store.viewport.panY}px; width: {Math.max(64, inlineEdgeLabelDraft.length * 7.6 + 20)}px; transform: translate(-50%, -50%) scale({store.viewport.zoom}); transform-origin: center center;"
                onpointerdown={(e) => e.stopPropagation()}
              >
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  type="text"
                  class="vz-input"
                  use:focusInput
                  placeholder="Label"
                  bind:value={inlineEdgeLabelDraft}
                  onblur={() => commitInlineEdgeLabel(editingEdge)}
                  onkeydown={(ke) => {
                    if (ke.key === 'Enter') commitInlineEdgeLabel(editingEdge);
                    if (ke.key === 'Escape') inlineEditingEdgeId = null;
                  }}
                />
              </div>
            {/if}
          {/if}
        {/if}

        <!-- Inline Frame Label Editor Floating at Top-Left of Frame (exact same component as edge label editor) -->
        {#if inlineEditingNodeId}
          {@const editingFrame = doc.nodes.find((n) => n.id === inlineEditingNodeId && n.kind === 'frame')}
          {#if editingFrame}
            {@const fbox = effectiveNodeLayouts[editingFrame.id]}
            {#if fbox}
              {@const labelDraft = inlineNodeNameDraft !== undefined ? inlineNodeNameDraft : (editingFrame.name || 'Frame')}
              {@const labelW = Math.max(64, labelDraft.length * 7.6 + 20)}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="vz-floating-edge-label-editor vz-floating-frame-label-editor"
                style="left: {(fbox.x + 16) * store.viewport.zoom + store.viewport.panX}px; top: {fbox.y * store.viewport.zoom + store.viewport.panY}px; width: {labelW}px; transform: translateY(-50%) scale({store.viewport.zoom}); transform-origin: left center;"
                onpointerdown={(e) => e.stopPropagation()}
              >
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  type="text"
                  class="vz-input"
                  use:focusInput
                  placeholder="Frame"
                  bind:value={inlineNodeNameDraft}
                  onblur={() => commitInlineNodeEdit(editingFrame)}
                  onkeydown={(ke) => {
                    if (ke.key === 'Enter') commitInlineNodeEdit(editingFrame);
                    if (ke.key === 'Escape') inlineEditingNodeId = null;
                  }}
                />
              </div>
            {/if}
          {/if}
        {/if}

        <!-- Inline Multiplicity Editor Floating near Start or End of Edge -->
        {#if inlineEditingMultiplicity}
          {@const multEdit = inlineEditingMultiplicity}
          {@const editingEdge = multEdit ? doc.edges.find((e) => e.id === multEdit.edgeId) : undefined}
          {#if multEdit && editingEdge}
            {@const srcB = effectiveNodeLayouts[editingEdge.source.nodeId]}
            {@const tgtB = effectiveNodeLayouts[editingEdge.target.nodeId]}
            {#if srcB && tgtB}
              {@const srcNode = doc.nodes.find((n) => n.id === editingEdge.source.nodeId)}
              {@const tgtNode = doc.nodes.find((n) => n.id === editingEdge.target.nodeId)}
              {@const g = computeUmlEdgeGeometry(
                srcB,
                tgtB,
                getEdgeRouting(editingEdge),
                editingEdge.visual?.start,
                editingEdge.visual?.end,
                edgeParallelOffsets[editingEdge.id] ?? 0,
                undefined,
                undefined,
                srcNode?.kind === 'shape' ? srcNode.shape : undefined,
                tgtNode?.kind === 'shape' ? tgtNode.shape : undefined,
                editingEdge.label
              )}
              {@const pt =
                multEdit && multEdit.end === 'start'
                  ? getMultiplicityLabelPoint(g.startTip, g.startAngleDeg, multEdit.draft || editingEdge.source.multiplicity)
                  : multEdit
                    ? getMultiplicityLabelPoint(g.endTip, g.endAngleDeg, multEdit.draft || editingEdge.target.multiplicity)
                    : { x: 0, y: 0 }}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="vz-floating-edge-label-editor vz-floating-mult-editor"
                style="left: {pt.x * store.viewport.zoom + store.viewport.panX}px; top: {pt.y * store.viewport.zoom + store.viewport.panY}px; width: {Math.max(38, (multEdit?.draft?.length ?? 0) * 8 + 14)}px; transform: translate(-50%, -50%) scale({store.viewport.zoom}); transform-origin: center center;"
                onpointerdown={(e) => e.stopPropagation()}
              >
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  type="text"
                  class="vz-input"
                  use:focusInput
                  placeholder="1, *"
                  value={multEdit?.draft ?? ''}
                  oninput={(e) => {
                    if (inlineEditingMultiplicity) {
                      inlineEditingMultiplicity.draft = e.currentTarget.value;
                    }
                  }}
                  onblur={() => commitInlineMultiplicity(editingEdge)}
                  onkeydown={(ke) => {
                    if (ke.key === 'Enter') commitInlineMultiplicity(editingEdge);
                    if (ke.key === 'Escape') inlineEditingMultiplicity = null;
                  }}
                />
              </div>
            {/if}
          {/if}
        {/if}

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

    <UmlInspector
      {store}
      onDeleteSelected={deleteSelected}
      onDuplicateSelected={duplicateSelected}
    />
  </div>
</div>
