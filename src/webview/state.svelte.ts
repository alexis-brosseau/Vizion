import type {
  UmlDocument,
  UmlNodeLayout,
  UmlShapeGeometry,
  ValidationIssue,
  VizionDocument,
  VizionDocumentKind
} from '../shared/documents/types';
import { GRID_SIZE, snapToGrid } from '../shared/geometry';
import type { HostToWebviewMessage, HostToWebviewSnapshotMessage } from '../shared/messages';
import type { VizionOperationPayload } from '../shared/operations';
import { UML_SHAPE_GEOMETRIES } from '../shared/registry/uml-registry';
import { postToHost } from './bridge';

declare global {
  interface Window {
    __VIZION_INITIAL_SNAPSHOT__?: HostToWebviewSnapshotMessage;
  }
}

export interface ViewportTransform {
  panX: number;
  panY: number;
  zoom: number;
}

export interface ContextMenuItem {
  label: string;
  shortcut?: string;
  danger?: boolean;
  dividerBefore?: boolean;
  action?: () => void;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  title?: string;
  items: ContextMenuItem[];
}

export interface ClipboardState {
  kind: VizionDocumentKind;
  nodeIds: string[];
  edgeIds: string[];
  pasteCount: number;
}

/**
 * Reactive Svelte 5 runes store managing the active Vizion webview state,
 * selection, optimistic layout overrides, clipboard, context menu, and host synchronization.
 */
export class VizionWebviewStore {
  expectedKind = $state<VizionDocumentKind>('uml');
  documentVersion = $state<number>(1);
  isReadOnly = $state<boolean>(false);
  isEmptyDocument = $state<boolean>(false);
  canExplicitlyInitialize = $state<boolean>(false);
  valid = $state<boolean>(true);
  document = $state<VizionDocument | undefined>(undefined);
  lastValidDocument = $state<VizionDocument | undefined>(undefined);
  issues = $state<ValidationIssue[]>([]);
  hasUnsupportedConstructs = $state<boolean>(false);

  // Optimistic node layouts so drag/resize never snaps back before host ack arrives
  optimisticUmlLayouts = $state<Record<string, UmlNodeLayout>>({});

  // Transient UI state
  selectedIds = $state<string[]>([]);
  outlineSearchQuery = $state<string>('');
  sidebarWidth = $state<number>(290);
  elementsPaneRatio = $state<number>(0.4);
  viewport = $state<ViewportTransform>({ panX: 40, panY: 40, zoom: 1 });
  statusMessage = $state<string | null>(null);
  staleNotice = $state<string | null>(null);
  contextMenu = $state<ContextMenuState | null>(null);
  clipboard = $state<ClipboardState | null>(null);

  private requestCounter = 0;
  private onFitContentCallback?: () => void;
  private onResetZoomCallback?: () => void;
  private onRestoreFocusCallback?: () => void;
  private onExportSvgCallback?: () => void;

  constructor(initialKind: VizionDocumentKind) {
    this.expectedKind = initialKind;

    if (window.__VIZION_INITIAL_SNAPSHOT__) {
      this.applySnapshot(window.__VIZION_INITIAL_SNAPSHOT__);
    }

    window.addEventListener('message', (event: MessageEvent<HostToWebviewMessage>) => {
      this.handleHostMessage(event.data);
    });

    postToHost({ type: 'webview.ready' });
  }

  get umlDoc(): UmlDocument | undefined {
    return this.document?.kind === 'uml' ? this.document : undefined;
  }

  registerCanvasCallbacks(callbacks: {
    onFitContent?: () => void;
    onResetZoom?: () => void;
    onRestoreFocus?: () => void;
    onExportSvg?: () => void;
  }): void {
    this.onFitContentCallback = callbacks.onFitContent;
    this.onResetZoomCallback = callbacks.onResetZoom;
    this.onRestoreFocusCallback = callbacks.onRestoreFocus;
    this.onExportSvgCallback = callbacks.onExportSvg;
  }

  private applySnapshot(msg: HostToWebviewSnapshotMessage): void {
    this.expectedKind = msg.expectedKind;
    this.documentVersion = msg.documentVersion;
    this.isReadOnly = msg.isReadOnly;
    this.isEmptyDocument = msg.isEmptyDocument;
    this.canExplicitlyInitialize = msg.canExplicitlyInitialize;
    this.valid = msg.valid;
    this.document = msg.document;
    this.lastValidDocument = msg.lastValidDocument;
    this.issues = msg.issues;
    this.hasUnsupportedConstructs = Boolean(msg.hasUnsupportedConstructs);

    // Clear optimistic layouts once authoritative document snapshot arrives
    this.optimisticUmlLayouts = {};

    if (msg.valid && msg.document) {
      const validIds = new Set<string>([
        ...msg.document.nodes.map((n) => n.id),
        ...msg.document.edges.map((e) => e.id)
      ]);
      const filtered = this.selectedIds.filter((id) => validIds.has(id));
      this.selectedIds = this.syncSelectionEdges(filtered);
    }
  }

  private handleHostMessage(msg: HostToWebviewMessage): void {
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'host.snapshot': {
        this.applySnapshot(msg);
        break;
      }

      case 'host.operationResult': {
        if (!msg.ok) {
          this.optimisticUmlLayouts = {};
          if (msg.staleRejected) {
            this.staleNotice =
              msg.error ?? 'Document changed externally during gesture. View refreshed.';
          } else if (msg.error) {
            this.statusMessage = msg.error;
          }
        } else {
          this.staleNotice = null;
          if (msg.createdIds && msg.createdIds.length > 0) {
            this.selectedIds = this.syncSelectionEdges(msg.createdIds);
          }
        }
        break;
      }

      case 'host.command': {
        if (msg.command === 'fitContent') {
          this.onFitContentCallback?.();
        } else if (msg.command === 'resetZoom') {
          this.onResetZoomCallback?.();
        } else if (msg.command === 'restoreCanvasFocus') {
          this.onRestoreFocusCallback?.();
        } else if (msg.command === 'requestSvgExport') {
          this.onExportSvgCallback?.();
        }
        break;
      }
    }
  }

  dispatchOperation(operation: VizionOperationPayload): string {
    const requestId = `req-${++this.requestCounter}-${Date.now()}`;
    postToHost({
      type: 'webview.operation',
      requestId,
      expectedDocumentVersion: this.documentVersion,
      operation
    });
    return requestId;
  }

  triggerUndo(): void {
    postToHost({ type: 'webview.undo' });
  }

  triggerRedo(): void {
    postToHost({ type: 'webview.redo' });
  }

  copySelection(): void {
    if (this.selectedIds.length === 0) return;
    if (this.umlDoc) {
      const nodeIds = this.umlDoc.nodes
        .filter((n) => this.selectedIds.includes(n.id))
        .map((n) => n.id);
      const edgeIds = this.umlDoc.edges
        .filter((e) => this.selectedIds.includes(e.id))
        .map((e) => e.id);
      if (nodeIds.length > 0 || edgeIds.length > 0) {
        this.clipboard = {
          kind: 'uml',
          nodeIds,
          edgeIds,
          pasteCount: 0
        };
      }
    }
  }

  pasteClipboard(stripCustomData = false): void {
    if (this.isReadOnly || !this.clipboard) return;
    this.clipboard.pasteCount += 1;
    const step = this.clipboard.pasteCount * 20;

    if (this.clipboard.kind === 'uml' && this.umlDoc) {
      this.dispatchOperation({
        type: 'uml.duplicateSelection',
        nodeIds: this.clipboard.nodeIds,
        edgeIds: this.clipboard.edgeIds,
        offsetX: step,
        offsetY: step,
        stripCustomData
      });
    }
  }

  createQuickUmlNode(
    kind: 'class' | 'note' | 'shape',
    worldX?: number,
    worldY?: number,
    shapeGeometry: UmlShapeGeometry = 'rectangle'
  ): void {
    if (this.isReadOnly || !this.umlDoc) return;
    const existingCount = this.umlDoc.nodes.filter((n) => n.kind === kind).length + 1;
    const shapeLabel =
      UML_SHAPE_GEOMETRIES.find((g) => g.kind === shapeGeometry)?.label ?? 'Shape';
    const defaultNameMap: Record<'class' | 'note' | 'shape', string> = {
      class: `Class${existingCount}`,
      note: `Note ${existingCount}`,
      shape: `${shapeLabel} ${existingCount}`
    };

    const name = defaultNameMap[kind];
    const id = `${kind}-${Date.now().toString(36).slice(-4)}-${existingCount}`;

    const rawX =
      worldX ?? Math.round((220 - this.viewport.panX) / this.viewport.zoom) + (existingCount % 4) * 40;
    const rawY =
      worldY ?? Math.round((140 - this.viewport.panY) / this.viewport.zoom) + (existingCount % 4) * 40;

    const x = snapToGrid(rawX, GRID_SIZE);
    const y = snapToGrid(rawY, GRID_SIZE);

    this.dispatchOperation({
      type: 'uml.addNode',
      id,
      kind,
      name,
      x,
      y,
      text: kind === 'note' ? 'Design note...' : undefined,
      shape: kind === 'shape' ? shapeGeometry : undefined
    });
  }

  openContextMenu(x: number, y: number, items: ContextMenuItem[], title?: string): void {
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - 220));
    const clampedY = Math.max(8, Math.min(y, window.innerHeight - 260));
    this.contextMenu = { x: clampedX, y: clampedY, items, title };
  }

  closeContextMenu(): void {
    this.contextMenu = null;
  }

  syncSelectionEdges(baseIds: string[], prevIds: string[] = this.selectedIds): string[] {
    if (!this.umlDoc) return baseIds;
    const selectedSet = new Set(baseIds);
    const prevNodeIds = new Set(
      this.umlDoc.nodes.filter((n) => prevIds.includes(n.id)).map((n) => n.id)
    );
    const nextNodeIds = new Set(
      this.umlDoc.nodes.filter((n) => selectedSet.has(n.id)).map((n) => n.id)
    );

    // Identify which nodes were deselected (were selected previously, but not now)
    const deselectedNodes = new Set([...prevNodeIds].filter((id) => !nextNodeIds.has(id)));

    // When deselecting a node, deselect all relations linked to it
    for (const deselectedId of deselectedNodes) {
      for (const edge of this.umlDoc.edges) {
        if (edge.source.nodeId === deselectedId || edge.target.nodeId === deselectedId) {
          selectedSet.delete(edge.id);
        }
      }
    }

    // If 2 or more nodes are selected, their relation between them must also be selected
    if (nextNodeIds.size >= 2) {
      for (const edge of this.umlDoc.edges) {
        if (nextNodeIds.has(edge.source.nodeId) && nextNodeIds.has(edge.target.nodeId)) {
          selectedSet.add(edge.id);
        } else if (
          edge.source.nodeId &&
          edge.target.nodeId &&
          (!nextNodeIds.has(edge.source.nodeId) || !nextNodeIds.has(edge.target.nodeId))
        ) {
          // Deselect relations where at least one linked node is not selected
          selectedSet.delete(edge.id);
        }
      }
    } else {
      // If fewer than 2 nodes are selected, remove any edges that connected selected nodes
      for (const edge of this.umlDoc.edges) {
        if (
          selectedSet.has(edge.id) &&
          (nextNodeIds.has(edge.source.nodeId) || nextNodeIds.has(edge.target.nodeId))
        ) {
          selectedSet.delete(edge.id);
        }
      }
    }

    return Array.from(selectedSet);
  }

  setSelectedIds(ids: string[]): void {
    this.selectedIds = this.syncSelectionEdges(ids, this.selectedIds);
  }

  selectSingle(id: string, additive = false): void {
    let next: string[];
    if (additive) {
      if (this.selectedIds.includes(id)) {
        next = this.selectedIds.filter((x) => x !== id);
      } else {
        next = [...this.selectedIds, id];
      }
    } else {
      next = [id];
    }
    this.selectedIds = this.syncSelectionEdges(next, this.selectedIds);
  }

  clearSelection(): void {
    this.selectedIds = [];
  }

  setViewport(next: ViewportTransform): void {
    const clampedZoom = Math.min(3.0, Math.max(0.2, next.zoom));
    this.viewport = {
      panX: Math.round(next.panX * 10) / 10,
      panY: Math.round(next.panY * 10) / 10,
      zoom: Math.round(clampedZoom * 1000) / 1000
    };
  }

  setSidebarWidth(width: number): void {
    this.sidebarWidth = Math.max(210, Math.min(560, Math.round(width)));
  }

  setElementsPaneRatio(ratio: number): void {
    this.elementsPaneRatio = Math.max(0.12, Math.min(0.92, Math.round(ratio * 1000) / 1000));
  }
}
