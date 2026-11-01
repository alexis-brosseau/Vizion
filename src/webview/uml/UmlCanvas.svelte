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
    UmlShapeGeometry
  } from '../../shared/documents/types';
  import {
    computeUmlEdgeGeometry,
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
    formatVisibilitySign
  } from '../../shared/operations';
  import {
    getEndpointShape,
    getUmlNodeKind,
    listUmlRelationPresets,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import { postToHost } from '../bridge';
  import VisibilityPicker from '../common/VisibilityPicker.svelte';
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
      }
    | {
        mode: 'resizing';
        nodeId: string;
        startWorld: Point2D;
        currentWorld: Point2D;
        initialBox: UmlNodeLayout;
      }
    | {
        mode: 'connecting';
        sourceNodeId: string;
        startPoint: Point2D;
        currentWorld: Point2D;
      };

  let gesture = $state<UmlGestureState>({ mode: 'idle' });
  let spacePressed = $state<boolean>(false);
  let inlineEditingNodeId = $state<string | null>(null);
  let inlineNodeNameDraft = $state<string>('');
  let inlineNodeStereotypeDraft = $state<string>('');
  let inlineEditingEdgeId = $state<string | null>(null);
  let inlineEdgeLabelDraft = $state<string>('');
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

  // Compute live layout boxes including optimistic layouts and grid-snapped gesture preview
  const effectiveNodeLayouts = $derived.by<Record<string, UmlNodeLayout>>(() => {
    if (!doc) return {};
    const base: Record<string, UmlNodeLayout> = {};
    doc.nodes.forEach((n, idx) => {
      const persisted = doc.layout.nodes[n.id] ?? {
        x: 80 + (idx % 3) * 260,
        y: 80 + Math.floor(idx / 3) * 190,
        width: 220,
        height: 140
      };
      // Use optimistic layout while waiting for the host snapshot so nodes never snap back
      base[n.id] = store.optimisticUmlLayouts[n.id] ?? persisted;
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
    } else if (gesture.mode === 'resizing') {
      const rawDx = gesture.currentWorld.x - gesture.startWorld.x;
      const rawDy = gesture.currentWorld.y - gesture.startWorld.y;
      base[gesture.nodeId] = {
        ...gesture.initialBox,
        width: Math.max(100, snapToGrid(gesture.initialBox.width + rawDx, GRID_SIZE)),
        height: Math.max(60, snapToGrid(gesture.initialBox.height + rawDy, GRID_SIZE))
      };
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
      onRestoreFocus: () => viewportEl?.focus(),
      onExportSvg: exportDiagramToSvg
    });
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
    viewportEl?.focus();
    endpointPickerPopup = null;

    if (e.button === 1 || (e.button === 0 && (e.altKey || spacePressed))) {
      gesture = {
        mode: 'panning',
        startScreenX: e.clientX,
        startScreenY: e.clientY,
        initialPanX: store.viewport.panX,
        initialPanY: store.viewport.panY
      };
      viewportEl?.setPointerCapture(e.pointerId);
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
      viewportEl?.setPointerCapture(e.pointerId);
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
    endpointPickerPopup = null;
    e.stopPropagation();
    viewportEl?.focus();

    const additive = e.shiftKey || e.metaKey || e.ctrlKey;
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, additive);
    } else if (additive) {
      store.selectSingle(node.id, true);
      return;
    }

    if (store.isReadOnly) return;

    const pt = getRelativeWorldPoint(e);
    const initialLayouts: Record<string, UmlNodeLayout> = {};
    for (const id of store.selectedIds) {
      if (effectiveNodeLayouts[id]) {
        initialLayouts[id] = { ...effectiveNodeLayouts[id] };
      }
    }
    gesture = {
      mode: 'moving',
      startWorld: pt,
      currentWorld: pt,
      initialLayouts,
      clickedNodeId: node.id
    };
  }

  function handleResizeHandlePointerDown(e: PointerEvent, node: UmlNode): void {
    if (e.button === 2) return;
    e.stopPropagation();
    if (store.isReadOnly) return;
    const pt = getRelativeWorldPoint(e);
    const box = effectiveNodeLayouts[node.id];
    if (!box) return;
    gesture = {
      mode: 'resizing',
      nodeId: node.id,
      startWorld: pt,
      currentWorld: pt,
      initialBox: { ...box }
    };
  }

  function handleConnectPortPointerDown(e: PointerEvent, node: UmlNode): void {
    if (e.button === 2) return;
    e.stopPropagation();
    if (store.isReadOnly) return;
    const pt = getRelativeWorldPoint(e);
    const box = effectiveNodeLayouts[node.id];
    const startPoint = {
      x: (box?.x ?? pt.x) + (box?.width ?? 0),
      y: (box?.y ?? pt.y) + (box?.height ?? 0) / 2
    };
    gesture = {
      mode: 'connecting',
      sourceNodeId: node.id,
      startPoint,
      currentWorld: pt
    };
  }

  function handleWindowPointerMove(e: PointerEvent): void {
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
      gesture = { ...gesture, currentWorld: pt };
    }
  }

  function findHoveredTargetAt(worldPt: Point2D): UmlNode | undefined {
    if (!doc) return undefined;
    for (let i = doc.nodes.length - 1; i >= 0; i--) {
      const n = doc.nodes[i];
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
      // Retain optimistic positions before clearing gesture so nodes never snap back
      store.optimisticUmlLayouts = { ...store.optimisticUmlLayouts, ...updates };
      gesture = { mode: 'idle' };

      store.dispatchOperation({
        type: 'uml.moveResizeNodes',
        updates
      });
      return;
    }

    if (current.mode === 'resizing') {
      const rawDx = current.currentWorld.x - current.startWorld.x;
      const rawDy = current.currentWorld.y - current.startWorld.y;
      const nextWidth = Math.max(100, snapToGrid(current.initialBox.width + rawDx, GRID_SIZE));
      const nextHeight = Math.max(60, snapToGrid(current.initialBox.height + rawDy, GRID_SIZE));

      if (
        nextWidth === current.initialBox.width &&
        nextHeight === current.initialBox.height
      ) {
        gesture = { mode: 'idle' };
        return;
      }

      const nextBox: UmlNodeLayout = {
        ...current.initialBox,
        width: nextWidth,
        height: nextHeight
      };
      store.optimisticUmlLayouts = {
        ...store.optimisticUmlLayouts,
        [current.nodeId]: nextBox
      };
      gesture = { mode: 'idle' };

      store.dispatchOperation({
        type: 'uml.moveResizeNodes',
        updates: {
          [current.nodeId]: nextBox
        }
      });
      return;
    }

    if (current.mode === 'connecting') {
      gesture = { mode: 'idle' };
      const pt = getRelativeWorldPoint(e);
      const targetNode = findHoveredTargetAt(pt);
      if (targetNode && targetNode.id !== current.sourceNodeId) {
        // Immediately create a line (association default) without prompting
        const edgeId = `edge-${current.sourceNodeId}-${targetNode.id}-${Date.now().toString(36).slice(-4)}`;
        store.dispatchOperation({
          type: 'uml.addEdge',
          id: edgeId,
          kind: 'association',
          sourceNodeId: current.sourceNodeId,
          targetNodeId: targetNode.id
        });
      }
      return;
    }

    gesture = { mode: 'idle' };
  }

  function deleteSelected(): void {
    if (store.isReadOnly || !doc || store.selectedIds.length === 0) return;
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
    const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement).blur();
      }
      return;
    }

    const isMod = e.ctrlKey || e.metaKey;
    const keyLower = e.key.toLowerCase();

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
      if (keyLower === 'c') {
        e.preventDefault();
        store.createQuickUmlNode('class');
        return;
      }
      if (keyLower === 'n') {
        e.preventDefault();
        store.createQuickUmlNode('note');
        return;
      }
      if (keyLower === 's') {
        e.preventDefault();
        store.createQuickUmlNode('shape', undefined, undefined, 'rectangle');
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
        }
      ],
      'Canvas'
    );
  }

  function addNodeAttributeInline(node: UmlNode): void {
    const existing = node.attributes ?? [];
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      showAttributes: true,
      attributes: [
        ...existing,
        {
          id: `${node.id}-attr-${Date.now().toString(36).slice(-4)}`,
          visibility: '+' as const,
          name: `field${existing.length + 1}`,
          type: 'string'
        }
      ]
    });
  }

  function updateNodeAttributeInline(
    node: UmlNode,
    idx: number,
    partial: Partial<UmlAttribute>
  ): void {
    const existing = [...(node.attributes ?? [])];
    existing[idx] = { ...existing[idx], ...partial };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      attributes: existing
    });
  }

  function removeNodeAttributeInline(node: UmlNode, idx: number): void {
    const existing = (node.attributes ?? []).filter((_, i) => i !== idx);
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      attributes: existing
    });
  }

  function addNodeOperationInline(node: UmlNode): void {
    const existing = node.operations ?? [];
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      showOperations: true,
      operations: [
        ...existing,
        {
          id: `${node.id}-op-${Date.now().toString(36).slice(-4)}`,
          visibility: '+' as const,
          name: `method${existing.length + 1}`,
          signature: '()',
          returnType: 'void',
          parameters: []
        }
      ]
    });
  }

  function updateNodeOperationInline(
    node: UmlNode,
    idx: number,
    partial: Partial<UmlOperation>
  ): void {
    const existing = [...(node.operations ?? [])];
    existing[idx] = { ...existing[idx], ...partial };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: existing
    });
  }

  function removeNodeOperationInline(node: UmlNode, idx: number): void {
    const existing = (node.operations ?? []).filter((_, i) => i !== idx);
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: existing
    });
  }

  function addNodeOperationArgInline(node: UmlNode, opIdx: number): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIdx];
    if (!targetOp) return;
    const currentArgs = extractOperationParameters(targetOp);
    const nextArgs: UmlParameter[] = [
      ...currentArgs,
      {
        id: `${targetOp.id}-arg-${Date.now().toString(36).slice(-4)}`,
        name: `arg${currentArgs.length + 1}`,
        type: 'string'
      }
    ];
    ops[opIdx] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }

  function updateNodeOperationArgInline(
    node: UmlNode,
    opIdx: number,
    argIdx: number,
    partial: Partial<UmlParameter>
  ): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIdx];
    if (!targetOp) return;
    const nextArgs = [...extractOperationParameters(targetOp)];
    if (!nextArgs[argIdx]) return;
    nextArgs[argIdx] = { ...nextArgs[argIdx], ...partial };
    ops[opIdx] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }

  function removeNodeOperationArgInline(node: UmlNode, opIdx: number, argIdx: number): void {
    const ops = [...(node.operations ?? [])];
    const targetOp = ops[opIdx];
    if (!targetOp) return;
    const nextArgs = extractOperationParameters(targetOp).filter((_, i) => i !== argIdx);
    ops[opIdx] = {
      ...targetOp,
      parameters: nextArgs,
      signature: buildOperationSignature(nextArgs)
    };
    store.dispatchOperation({
      type: 'uml.updateNode',
      nodeId: node.id,
      operations: ops
    });
  }

  function handleNodeContextMenu(e: MouseEvent, node: UmlNode): void {
    e.preventDefault();
    e.stopPropagation();
    if (!store.selectedIds.includes(node.id)) {
      store.selectSingle(node.id, false);
    }

    const kindDesc = getUmlNodeKind(node.kind);
    const items = [
      {
        label: 'Edit Inline',
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
    inlineEditingNodeId = node.id;
    inlineNodeNameDraft = node.name ?? '';
    inlineNodeStereotypeDraft = node.stereotype ?? '';
  }

  function commitInlineNodeEdit(node?: UmlNode): void {
    const nodeId = inlineEditingNodeId;
    if (!nodeId) return;
    const targetNode = node ?? doc?.nodes.find((n) => n.id === nodeId);
    inlineEditingNodeId = null;
    if (!targetNode) return;

    const nextName = inlineNodeNameDraft.trim();
    const nextStereo = inlineNodeStereotypeDraft.replace(/^[«<]+|[»>]+$/g, '').trim();

    const updates: { name?: string; stereotype?: string } = {};
    if (nextName !== targetNode.name) {
      updates.name = nextName;
    }
    if (nextStereo !== (targetNode.stereotype ?? '')) {
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

  function openEndpointPickerPopup(
    clientX: number,
    clientY: number,
    edge: UmlEdge,
    end: 'start' | 'end',
    current: EndpointDecoration
  ): void {
    store.closeContextMenu();
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
          label: 'Edit Relation Label',
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
          label:
            (edge.visual?.routing ?? 'bezier') === 'bezier'
              ? 'Switch to Straight Routing'
              : 'Switch to Smooth Bézier Routing',
          dividerBefore: true,
          action: () =>
            store.dispatchOperation({
              type: 'uml.updateEdge',
              edgeId: edge.id,
              routing: (edge.visual?.routing ?? 'bezier') === 'bezier' ? 'straight' : 'bezier'
            })
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

  /**
   * Computes a clean label position near an endpoint tip for rendering multiplicity numbers (e.g. `1`, `*`, `1..5`).
   */
  function getMultiplicityLabelPoint(tip: Point2D, angleDeg: number): Point2D {
    const rad = (angleDeg * Math.PI) / 180;
    const inwardDist = 22;
    const perpDist = -14;
    const dx = -Math.cos(rad) * inwardDist - Math.sin(rad) * perpDist;
    const dy = -Math.sin(rad) * inwardDist + Math.cos(rad) * perpDist;
    return {
      x: tip.x + dx,
      y: tip.y + dy
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

  function exportDiagramToSvg(): void {
    if (!doc) return;
    const layouts = Object.values(effectiveNodeLayouts);
    let minX = 0;
    let minY = 0;
    let maxX = 800;
    let maxY = 600;
    if (layouts.length > 0) {
      minX = Math.min(...layouts.map((b) => b.x)) - 40;
      minY = Math.min(...layouts.map((b) => b.y)) - 40;
      maxX = Math.max(...layouts.map((b) => b.x + b.width)) + 40;
      maxY = Math.max(...layouts.map((b) => b.y + b.height)) + 40;
    }
    const w = Math.max(400, maxX - minX);
    const h = Math.max(300, maxY - minY);

    const escapeXml = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const nodeRectsSvg = doc.nodes
      .map((n) => {
        const b = effectiveNodeLayouts[n.id];
        if (!b) return '';
        return `<g transform="translate(${b.x}, ${b.y})">
          <rect width="${b.width}" height="${b.height}" rx="6" fill="#1e1e1e" stroke="#569cd6" stroke-width="1.5"/>
          <text x="${b.width / 2}" y="24" text-anchor="middle" fill="#d4d4d4" font-family="sans-serif" font-weight="bold" font-size="13">${escapeXml(n.name)}</text>
        </g>`;
      })
      .join('\n');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${w} ${h}" width="${w}" height="${h}">
  ${nodeRectsSvg}
</svg>`;

    postToHost({ type: 'webview.exportSvgContent', svgContent });
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
      onpointerdown={handleCanvasPointerDown}
      oncontextmenu={handleCanvasContextMenu}
      ondblclick={(e) => {
        if (store.isReadOnly) return;
        if (
          e.target === viewportEl ||
          (e.target as HTMLElement)?.classList.contains('vz-canvas-bg')
        ) {
          const pt = getRelativeWorldPoint(e);
          store.createQuickUmlNode('class', pt.x, pt.y);
        }
      }}
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
          -
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
        <!-- SVG Layer for Edges, Tangent-Oriented Endpoint Markers, Multiplicities (Rendered BEHIND nodes) -->
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
                {@const startDec = edge.visual?.start ?? { shape: 'none', size: 10 }}
                {@const endDec = edge.visual?.end ?? { shape: 'none', size: 10 }}
                {@const geom = computeUmlEdgeGeometry(
                  srcBox,
                  tgtBox,
                  edge.visual?.routing ?? 'bezier',
                  startDec,
                  endDec,
                  edgeParallelOffsets[edge.id] ?? 0
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
                  geom.startAngleDeg
                )}
                {@const endMultPt = getMultiplicityLabelPoint(
                  geom.endTip,
                  geom.endAngleDeg
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
                    stroke-dasharray={edge.visual?.line === 'dashed' ? '6 4' : undefined}
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
                        y="-11"
                        width={edge.label.length * 7.6 + 16}
                        height="20"
                        rx="4"
                        class="vz-edge-label-bg"
                      />
                      <text text-anchor="middle" dy="3" class="vz-edge-label-text">
                        {edge.label}
                      </text>
                    </g>
                  {/if}
                </g>
              {/if}
            {/each}
          </g>
        </svg>

        <!-- HTML/Svelte Layer for Custom Extensible UML Nodes (Rendered in front of SVG relation lines) -->
        <div
          class="vz-html-world"
          style="transform: translate({store.viewport.panX}px, {store.viewport.panY}px) scale({store.viewport.zoom});"
        >
          {#each doc.nodes as node (node.id)}
            {@const box = effectiveNodeLayouts[node.id]}
            {@const isSelected = store.selectedIds.includes(node.id)}
            {@const isInlineEditing = inlineEditingNodeId === node.id}
            {@const kindDesc = getUmlNodeKind(node.kind)}
            {@const attrsVisible = node.showAttributes !== false}
            {@const opsVisible = node.showOperations !== false}
            {#if box}
              <div
                class="vz-uml-node kind-{node.kind}"
                class:selected={isSelected}
                class:inline-editing={isInlineEditing}
                class:unsupported={!kindDesc}
                style="left: {box.x}px; top: {box.y}px; width: {box.width}px; min-height: {box.height}px; {node.kind === 'shape' ? `height: ${box.height}px;` : ''}"
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
                        autofocus
                        bind:value={inlineNodeNameDraft}
                        onblur={() => commitInlineNodeEdit(node)}
                        onkeydown={(ke) => {
                          if (ke.key === 'Enter') {
                            commitInlineNodeEdit(node);
                          } else if (ke.key === 'Escape') {
                            inlineEditingNodeId = null;
                          }
                        }}
                      />
                      <input
                        type="text"
                        class="vz-inline-input vz-inline-stereotype-input"
                        placeholder="«stereotype»"
                        bind:value={inlineNodeStereotypeDraft}
                        onblur={() => commitInlineNodeEdit(node)}
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
                      {#if node.stereotype}
                        <div class="vz-uml-stereotype">«{node.stereotype}»</div>
                      {/if}
                    {/if}
                  </div>
                {:else}
                  <div class="vz-uml-node-header">
                    {#if isInlineEditing}
                      <!-- svelte-ignore a11y_autofocus -->
                      <input
                        type="text"
                        class="vz-inline-input"
                        autofocus
                        bind:value={inlineNodeNameDraft}
                        onblur={() => commitInlineNodeEdit(node)}
                        onkeydown={(ke) => {
                          if (ke.key === 'Enter') {
                            commitInlineNodeEdit(node);
                          } else if (ke.key === 'Escape') {
                            inlineEditingNodeId = null;
                          }
                        }}
                      />
                      <input
                        type="text"
                        class="vz-inline-input vz-inline-stereotype-input"
                        placeholder="«stereotype»"
                        bind:value={inlineNodeStereotypeDraft}
                        onblur={() => commitInlineNodeEdit(node)}
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
                      {#if node.stereotype || kindDesc?.defaultStereotype}
                        <div class="vz-uml-stereotype">
                          «{node.stereotype || kindDesc?.defaultStereotype}»
                        </div>
                      {:else if !kindDesc}
                        <div class="vz-uml-stereotype">«unsupported: {node.kind}»</div>
                      {/if}
                    {/if}
                  </div>

                  {#if node.kind === 'note'}
                    {#if isInlineEditing}
                      <div class="vz-uml-note-body">
                        <textarea
                          class="vz-inline-textarea"
                          rows="4"
                          placeholder="Note content…"
                          value={node.text ?? ''}
                          onblur={(ev) => {
                            if (ev.currentTarget.value !== (node.text ?? '')) {
                              store.dispatchOperation({
                                type: 'uml.updateNode',
                                nodeId: node.id,
                                text: ev.currentTarget.value
                              });
                            }
                          }}
                          onchange={(ev) =>
                            store.dispatchOperation({
                              type: 'uml.updateNode',
                              nodeId: node.id,
                              text: ev.currentTarget.value
                            })}
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
                            {#each node.attributes ?? [] as attr, idx (attr.id)}
                              <div class="vz-inline-member-row">
                                <VisibilityPicker
                                  compact={true}
                                  value={attr.visibility ?? '+'}
                                  ariaLabel="Attribute visibility"
                                  onSelect={(nextVis) =>
                                    updateNodeAttributeInline(node, idx, { visibility: nextVis })}
                                />
                                <input
                                  type="text"
                                  class="vz-inline-cell-input"
                                  value={attr.name}
                                  placeholder="name"
                                  onblur={(ev) => {
                                    if (ev.currentTarget.value !== attr.name) {
                                      updateNodeAttributeInline(node, idx, { name: ev.currentTarget.value });
                                    }
                                  }}
                                  onchange={(ev) =>
                                    updateNodeAttributeInline(node, idx, {
                                      name: ev.currentTarget.value
                                    })}
                                />
                                <input
                                  type="text"
                                  class="vz-inline-cell-input"
                                  value={attr.type ?? ''}
                                  placeholder="type"
                                  onblur={(ev) => {
                                    if (ev.currentTarget.value !== (attr.type ?? '')) {
                                      updateNodeAttributeInline(node, idx, { type: ev.currentTarget.value });
                                    }
                                  }}
                                  onchange={(ev) =>
                                    updateNodeAttributeInline(node, idx, {
                                      type: ev.currentTarget.value
                                    })}
                                />
                                <button
                                  type="button"
                                  class="vz-inline-del-btn"
                                  title="Remove attribute"
                                  onclick={() => removeNodeAttributeInline(node, idx)}
                                >
                                  ×
                                </button>
                              </div>
                            {/each}
                            <button
                              type="button"
                              class="vz-inline-add-btn"
                              onclick={() => addNodeAttributeInline(node)}
                            >
                              ＋ Attribute
                            </button>
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
                            {#each node.operations ?? [] as op, idx (op.id)}
                              {@const opArgs = extractOperationParameters(op)}
                              <div class="vz-inline-op-block">
                                <div class="vz-inline-member-row">
                                  <VisibilityPicker
                                    compact={true}
                                    value={op.visibility ?? '+'}
                                    ariaLabel="Operation visibility"
                                    onSelect={(nextVis) =>
                                      updateNodeOperationInline(node, idx, { visibility: nextVis })}
                                  />
                                  <input
                                    type="text"
                                    class="vz-inline-cell-input"
                                    value={op.name}
                                    placeholder="method"
                                    onblur={(ev) => {
                                      if (ev.currentTarget.value !== op.name) {
                                        updateNodeOperationInline(node, idx, { name: ev.currentTarget.value });
                                      }
                                    }}
                                    onchange={(ev) =>
                                      updateNodeOperationInline(node, idx, {
                                        name: ev.currentTarget.value
                                      })}
                                  />
                                  <input
                                    type="text"
                                    class="vz-inline-cell-input"
                                    value={op.returnType ?? ''}
                                    placeholder="return"
                                    onblur={(ev) => {
                                      if (ev.currentTarget.value !== (op.returnType ?? '')) {
                                        updateNodeOperationInline(node, idx, { returnType: ev.currentTarget.value });
                                      }
                                    }}
                                    onchange={(ev) =>
                                      updateNodeOperationInline(node, idx, {
                                        returnType: ev.currentTarget.value
                                      })}
                                  />
                                  <button
                                    type="button"
                                    class="vz-inline-del-btn"
                                    title="Remove operation"
                                    onclick={() => removeNodeOperationInline(node, idx)}
                                  >
                                    ×
                                  </button>
                                </div>

                                <!-- Inline Operation Arguments -->
                                <div class="vz-inline-params-wrap">
                                  {#each opArgs as argItem, aIdx (argItem.id)}
                                    <div class="vz-inline-param-row">
                                      <input
                                        type="text"
                                        class="vz-inline-cell-input"
                                        value={argItem.name}
                                        placeholder="argName"
                                        onblur={(ev) => {
                                          if (ev.currentTarget.value !== argItem.name) {
                                            updateNodeOperationArgInline(node, idx, aIdx, { name: ev.currentTarget.value });
                                          }
                                        }}
                                        onchange={(ev) =>
                                          updateNodeOperationArgInline(node, idx, aIdx, {
                                            name: ev.currentTarget.value
                                          })}
                                      />
                                      <input
                                        type="text"
                                        class="vz-inline-cell-input"
                                        value={argItem.type ?? ''}
                                        placeholder="argType"
                                        onblur={(ev) => {
                                          if (ev.currentTarget.value !== (argItem.type ?? '')) {
                                            updateNodeOperationArgInline(node, idx, aIdx, { type: ev.currentTarget.value });
                                          }
                                        }}
                                        onchange={(ev) =>
                                          updateNodeOperationArgInline(node, idx, aIdx, {
                                            type: ev.currentTarget.value
                                          })}
                                      />
                                      <button
                                        type="button"
                                        class="vz-inline-del-btn"
                                        title="Remove argument"
                                        onclick={() =>
                                          removeNodeOperationArgInline(node, idx, aIdx)}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  {/each}
                                  <button
                                    type="button"
                                    class="vz-inline-add-btn vz-param-add-btn"
                                    onclick={() => addNodeOperationArgInline(node, idx)}
                                  >
                                    ＋ Argument
                                  </button>
                                </div>
                              </div>
                            {/each}
                            <button
                              type="button"
                              class="vz-inline-add-btn"
                              onclick={() => addNodeOperationInline(node)}
                            >
                              ＋ Operation
                            </button>
                          {/if}
                        {:else}
                          {#each node.operations ?? [] as op (op.id)}
                            <div class="vz-uml-member">
                              <span class="vz-vis">{formatVisibilitySign(op.visibility)}</span>
                              <span>{op.name}{op.signature ?? '()'}</span>
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
                    {@const geom = computeUmlEdgeGeometry(
                      srcBox,
                      tgtBox,
                      edge.visual?.routing ?? 'bezier',
                      startDec,
                      endDec,
                      edgeParallelOffsets[edge.id] ?? 0
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
          {@const editingEdge = doc.edges.find((e) => e.id === inlineEditingEdgeId)}
          {#if editingEdge}
            {@const srcB = effectiveNodeLayouts[editingEdge.source.nodeId]}
            {@const tgtB = effectiveNodeLayouts[editingEdge.target.nodeId]}
            {#if srcB && tgtB}
              {@const g = computeUmlEdgeGeometry(
                srcB,
                tgtB,
                editingEdge.visual?.routing ?? 'bezier',
                editingEdge.visual?.start,
                editingEdge.visual?.end,
                edgeParallelOffsets[editingEdge.id] ?? 0
              )}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="vz-floating-edge-label-editor"
                style="left: {g.labelPoint.x * store.viewport.zoom + store.viewport.panX}px; top: {g.labelPoint.y * store.viewport.zoom + store.viewport.panY}px;"
                onpointerdown={(e) => e.stopPropagation()}
              >
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  type="text"
                  class="vz-input"
                  autofocus
                  placeholder="Relation label…"
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

        <!-- Inline Multiplicity Editor Floating near Start or End of Edge -->
        {#if inlineEditingMultiplicity}
          {@const multEdit = inlineEditingMultiplicity}
          {@const editingEdge = doc.edges.find((e) => e.id === multEdit.edgeId)}
          {#if editingEdge}
            {@const srcB = effectiveNodeLayouts[editingEdge.source.nodeId]}
            {@const tgtB = effectiveNodeLayouts[editingEdge.target.nodeId]}
            {#if srcB && tgtB}
              {@const g = computeUmlEdgeGeometry(
                srcB,
                tgtB,
                editingEdge.visual?.routing ?? 'bezier',
                editingEdge.visual?.start,
                editingEdge.visual?.end,
                edgeParallelOffsets[editingEdge.id] ?? 0
              )}
              {@const pt =
                multEdit.end === 'start'
                  ? getMultiplicityLabelPoint(g.startTip, g.startAngleDeg)
                  : getMultiplicityLabelPoint(g.endTip, g.endAngleDeg)}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="vz-floating-edge-label-editor vz-floating-mult-editor"
                style="left: {pt.x * store.viewport.zoom + store.viewport.panX}px; top: {pt.y * store.viewport.zoom + store.viewport.panY}px;"
                onpointerdown={(e) => e.stopPropagation()}
              >
                <!-- svelte-ignore a11y_autofocus -->
                <input
                  type="text"
                  class="vz-input"
                  autofocus
                  placeholder="1, *"
                  bind:value={inlineEditingMultiplicity.draft}
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
            <div class="vz-context-menu-title">
              {popup.end === 'start' ? 'Start Endpoint & Multiplicity' : 'End Endpoint & Multiplicity'}
            </div>

            <div class="vz-endpoint-mult-row">
              <span class="vz-field-label">Multiplicity</span>
              <input
                type="text"
                class="vz-input-mini"
                placeholder="e.g. 1, *, 1..5, 2..*"
                bind:value={endpointPickerPopup.multiplicityDraft}
                onchange={(ev) => {
                  const val = ev.currentTarget.value.trim();
                  store.dispatchOperation({
                    type: 'uml.updateEdge',
                    edgeId: popup.edgeId,
                    ...(popup.end === 'start'
                      ? { sourceMultiplicity: val }
                      : { targetMultiplicity: val })
                  });
                }}
                onkeydown={(ke) => {
                  if (ke.key === 'Enter') {
                    const val = ke.currentTarget.value.trim();
                    store.dispatchOperation({
                      type: 'uml.updateEdge',
                      edgeId: popup.edgeId,
                      ...(popup.end === 'start'
                        ? { sourceMultiplicity: val }
                        : { targetMultiplicity: val })
                    });
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
