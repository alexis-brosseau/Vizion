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
import { ClipboardController, type ClipboardState } from './state/clipboard.svelte';
import { GestureStateMachine } from './state/gesture-machine.svelte';
import { InlineEditController } from './state/inline-edit.svelte';
import { SelectionController } from './state/selection.svelte';
import { ViewportController, type ViewportTransform } from './state/viewport.svelte';

export type { ClipboardState, ViewportTransform };

declare global {
  interface Window {
    __VIZION_INITIAL_SNAPSHOT__?: HostToWebviewSnapshotMessage;
  }
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

  // State controllers (composition keeps the public facade stable for existing components)
  readonly viewportController = new ViewportController();
  readonly selectionController = new SelectionController();
  readonly clipboardController = new ClipboardController();
  readonly gestureMachine = new GestureStateMachine();
  readonly inlineEdit = new InlineEditController(this);

  get viewport(): ViewportTransform {
    return this.viewportController.transform;
  }

  get selectedIds(): string[] {
    return this.selectionController.selectedIds;
  }

  get clipboard(): ClipboardState | null {
    return this.clipboardController.state;
  }

  // Transient UI state
  outlineSearchQuery = $state<string>('');
  sidebarWidth = $state<number>(290);
  elementsPaneRatio = $state<number>(0.4);
  statusMessage = $state<string | null>(null);
  staleNotice = $state<string | null>(null);
  contextMenu = $state<ContextMenuState | null>(null);

  private requestCounter = 0;
  private onFitContentCallback?: () => void;
  private onResetZoomCallback?: () => void;
  private onRestoreFocusCallback?: () => void;

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
  }): void {
    this.onFitContentCallback = callbacks.onFitContent;
    this.onResetZoomCallback = callbacks.onResetZoom;
    this.onRestoreFocusCallback = callbacks.onRestoreFocus;
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
      this.selectionController.prune(msg.document);
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
            this.selectionController.setSelectedIds(this.umlDoc, msg.createdIds);
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
        }
        break;
      }
    }
  }

  dispatchOperation(operation: VizionOperationPayload): string {
    const requestId = `req-${++this.requestCounter}-${Date.now()}`;

    // Apply optimistic updates synchronously so local UI transitions (such as closing
    // inline editing on Enter or canvas blur) do not temporarily flicker back to stale values.
    if (operation.type === 'uml.updateNode' && this.umlDoc) {
      const node = this.umlDoc.nodes.find((n) => n.id === operation.nodeId);
      if (node) {
        if (operation.name !== undefined) node.name = operation.name;
        if (operation.stereotype !== undefined) {
          if (operation.stereotype) node.stereotype = operation.stereotype;
          else delete node.stereotype;
        }
        if (operation.text !== undefined) node.text = operation.text;
        if (operation.shape !== undefined) node.shape = operation.shape;
        if (operation.children !== undefined) node.children = [...operation.children];
        if (operation.line !== undefined) node.line = operation.line;
        if (operation.attributes !== undefined) node.attributes = operation.attributes;
        if (operation.operations !== undefined) node.operations = operation.operations;
        if (operation.showAttributes !== undefined) node.showAttributes = operation.showAttributes;
        if (operation.showOperations !== undefined) node.showOperations = operation.showOperations;
      }
    } else if (operation.type === 'uml.moveResizeNodes' && this.umlDoc) {
      if (operation.frameChildrenUpdates) {
        for (const [frameId, children] of Object.entries(operation.frameChildrenUpdates)) {
          const frameNode = this.umlDoc.nodes.find((n) => n.id === frameId);
          if (frameNode) {
            frameNode.children = [...children];
          }
        }
      }
    } else if (operation.type === 'uml.updateEdge' && this.umlDoc) {
      const edge = this.umlDoc.edges.find((e) => e.id === operation.edgeId);
      if (edge) {
        if (operation.label !== undefined) edge.label = operation.label;
        if (operation.sourceMultiplicity !== undefined) {
          edge.source.multiplicity = operation.sourceMultiplicity;
        }
        if (operation.targetMultiplicity !== undefined) {
          edge.target.multiplicity = operation.targetMultiplicity;
        }
        if (operation.kind !== undefined) edge.kind = operation.kind;
      }
    } else if (operation.type === 'uml.updateEndpoint' && this.umlDoc) {
      const edge = this.umlDoc.edges.find((e) => e.id === operation.edgeId);
      if (edge) {
        if (!edge.visual) edge.visual = {};
        edge.visual[operation.end] = { ...operation.decoration };
      }
    }

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

  checkForExtensionUpdate(): void {
    postToHost({ type: 'webview.checkForExtensionUpdate' });
  }

  setStatusMessage(message: string | null): void {
    this.statusMessage = message;
  }

  setStaleNotice(message: string | null): void {
    this.staleNotice = message;
  }

  copySelection(): void {
    this.clipboardController.copy(this.umlDoc, this.selectedIds);
  }

  pasteClipboard(stripCustomData = false): void {
    const clipboard = this.clipboardController.state;
    if (this.isReadOnly || !clipboard) return;
    const step = this.clipboardController.nextPasteOffset();

    if (clipboard.kind === 'uml' && this.umlDoc) {
      this.dispatchOperation({
        type: 'uml.duplicateSelection',
        nodeIds: clipboard.nodeIds,
        edgeIds: clipboard.edgeIds,
        offsetX: step,
        offsetY: step,
        stripCustomData
      });
    }
  }

  createQuickUmlNode(
    kind: 'class' | 'note' | 'shape' | 'frame',
    worldX?: number,
    worldY?: number,
    shapeGeometry: UmlShapeGeometry = 'rectangle'
  ): void {
    if (this.isReadOnly || !this.umlDoc) return;
    const existingCount = this.umlDoc.nodes.filter((n) => n.kind === kind).length + 1;
    const shapeLabel =
      UML_SHAPE_GEOMETRIES.find((g) => g.kind === shapeGeometry)?.label ?? 'Shape';
    const defaultNameMap: Record<'class' | 'note' | 'shape' | 'frame', string> = {
      class: `Class${existingCount}`,
      note: `Note ${existingCount}`,
      shape: `${shapeLabel} ${existingCount}`,
      frame: `Frame ${existingCount}`
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
    return this.selectionController.syncSelectionEdges(this.umlDoc, baseIds, prevIds);
  }

  setSelectedIds(ids: string[]): void {
    this.selectionController.setSelectedIds(this.umlDoc, ids);
  }

  selectSingle(id: string, additive = false): void {
    this.selectionController.selectSingle(this.umlDoc, id, additive);
  }

  clearSelection(): void {
    this.selectionController.clear();
  }

  setViewport(next: ViewportTransform): void {
    this.viewportController.setViewport(next);
  }

  setSidebarWidth(width: number): void {
    this.sidebarWidth = Math.max(210, Math.min(560, Math.round(width)));
  }

  setElementsPaneRatio(ratio: number): void {
    this.elementsPaneRatio = Math.max(0.12, Math.min(0.92, Math.round(ratio * 1000) / 1000));
  }
}
