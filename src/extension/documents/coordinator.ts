import * as vscode from 'vscode';
import { computeMinimalDiffSpan } from '../../shared/documents/json-patch';
import {
  isEmptyOrWhitespaceDocument,
  serializeDefaultDocument
} from '../../shared/documents/templates';
import type {
  EndpointDecoration,
  EndpointFillMode,
  UmlRelationKind,
  VizionDocument,
  VizionDocumentKind
} from '../../shared/documents/types';
import { parseAndValidateDocument } from '../../shared/documents/validator';
import type {
  HostToWebviewMessage,
  HostToWebviewSnapshotMessage,
  WebviewToHostMessage
} from '../../shared/messages';
import {
  applyUmlOperationToText,
  type VizionOperationPayload
} from '../../shared/operations';
import {
  getEndpointShape,
  listEndpointShapes,
  listUmlNodeKinds,
  listUmlRelationPresets
} from '../../shared/registry/uml-registry';
import type { VizionDiagnosticsManager } from './diagnostics';

/**
 * Per-document coordinator keyed by canonical `TextDocument.uri.toString()`.
 *
 * Responsibilities:
 * 1. One-time empty initialization guard tied to the live `TextDocument` lifetime (Section 5.2 & 5.3).
 * 2. Serialized operation queue with ephemeral `TextDocument.version` concurrency token checking.
 * 3. Minimal `WorkspaceEdit` application so native VS Code Undo/Redo, Save, and split views stay in sync.
 * 4. Native VS Code Quick Pick & Input Box workflows for UML node creation, relation kinds, and endpoint decorations.
 */
export class DocumentCoordinator implements vscode.Disposable {
  public readonly uriKey: string;
  private readonly panels = new Set<{ panel: vscode.WebviewPanel; ready: boolean }>();
  private readonly disposables: vscode.Disposable[] = [];

  /**
   * Tracks whether one-time empty initialization has already been considered during this
   * live `TextDocument`'s lifetime. Splitting the editor, reloading a webview, or undoing
   * back to empty will NOT re-initialize automatically.
   */
  private initializationConsidered = false;
  private isInitializing = false;
  private lastValidDocument: VizionDocument | undefined;
  private operationQueue: Promise<void> = Promise.resolve();
  private validationDebounceTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly undoStack: string[] = [];
  private readonly redoStack: string[] = [];

  constructor(
    public readonly document: vscode.TextDocument,
    public readonly kind: VizionDocumentKind,
    private readonly diagnostics: VizionDiagnosticsManager,
    private readonly onAllPanelsAndDocumentClosed: (uriKey: string) => void
  ) {
    this.uriKey = document.uri.toString();

    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() === this.uriKey) {
          this.scheduleRevalidateAndBroadcast();
        }
      }),
      vscode.workspace.onDidCloseTextDocument((closedDoc) => {
        if (closedDoc.uri.toString() === this.uriKey) {
          this.diagnostics.clearDiagnostics(closedDoc.uri);
          this.onAllPanelsAndDocumentClosed(this.uriKey);
        }
      })
    );
  }

  public get hasActivePanel(): boolean {
    for (const entry of this.panels) {
      if (entry.panel.active) {
        return true;
      }
    }
    return false;
  }

  public attachPanel(panel: vscode.WebviewPanel): void {
    const entry = { panel, ready: false };
    this.panels.add(entry);

    const msgListener = panel.webview.onDidReceiveMessage((rawMsg: unknown) => {
      void this.handleWebviewMessage(entry, rawMsg as WebviewToHostMessage);
    });

    const viewStateListener = panel.onDidChangeViewState(() => {
      if (panel.visible && entry.ready) {
        this.sendSnapshotToPanel(entry.panel);
      }
    });

    panel.onDidDispose(() => {
      msgListener.dispose();
      viewStateListener.dispose();
      this.panels.delete(entry);
    });
  }

  public broadcastCommand(
    command: 'fitContent' | 'resetZoom' | 'restoreCanvasFocus' | 'requestSvgExport',
    onlyActive = false
  ): void {
    const msg: HostToWebviewMessage = { type: 'host.command', command };
    for (const entry of this.panels) {
      if (!entry.ready) continue;
      if (onlyActive && !entry.panel.active) continue;
      void entry.panel.webview.postMessage(msg);
    }
  }

  private isDocumentReadOnly(): boolean {
    const scheme = this.document.uri.scheme;
    if (scheme !== 'file' && scheme !== 'untitled') {
      return true;
    }
    return false;
  }

  private async handleWebviewMessage(
    entry: { panel: vscode.WebviewPanel; ready: boolean },
    msg: WebviewToHostMessage
  ): Promise<void> {
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
      return;
    }

    switch (msg.type) {
      case 'webview.ready': {
        entry.ready = true;
        await this.maybeAutoInitializeOnFirstOpen();
        this.revalidateAndBroadcast();
        break;
      }

      case 'webview.recheck': {
        this.revalidateAndBroadcast();
        break;
      }

      case 'webview.openAsText': {
        await vscode.commands.executeCommand(
          'vscode.openWith',
          this.document.uri,
          'default',
          entry.panel.viewColumn
        );
        break;
      }

      case 'webview.showProblems': {
        await vscode.commands.executeCommand('workbench.actions.view.problems');
        break;
      }

      case 'webview.initializeEmpty': {
        await this.explicitlyInitializeEmptyDocument();
        break;
      }

      case 'webview.operation': {
        this.enqueueOperation(async () => {
          await this.executeOperationRequest(
            entry.panel,
            msg.requestId,
            msg.expectedDocumentVersion,
            msg.operation
          );
        });
        break;
      }

      case 'webview.promptAddUmlNode': {
        await this.promptAddUmlNodeFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.x,
          msg.y,
          msg.defaultKind
        );
        break;
      }

      case 'webview.promptAddUmlEdge': {
        await this.promptAddUmlEdgeFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.sourceNodeId,
          msg.targetNodeId,
          msg.defaultKind
        );
        break;
      }

      case 'webview.promptEndpointDecoration': {
        await this.promptEndpointDecorationFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.edgeId,
          msg.end,
          msg.currentDecoration
        );
        break;
      }

      case 'webview.promptRenameEntity': {
        await this.promptRenameEntityFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.targetKind,
          msg.targetId,
          msg.currentValue
        );
        break;
      }

      case 'webview.promptChangeRelationKind': {
        await this.promptChangeRelationKindFlow(
          entry.panel,
          msg.expectedDocumentVersion,
          msg.edgeId,
          msg.currentKind
        );
        break;
      }

      case 'webview.undo': {
        this.enqueueOperation(async () => {
          await this.performUndo();
        });
        break;
      }

      case 'webview.redo': {
        this.enqueueOperation(async () => {
          await this.performRedo();
        });
        break;
      }

      case 'webview.exportSvgContent': {
        await this.saveExportedSvg(msg.svgContent);
        break;
      }
    }
  }

  /**
   * Implements Section 5.2 Initialization Algorithm:
   * - Runs at most once per live `TextDocument` lifetime.
   * - Re-checks text and concurrency token immediately before applying.
   * - Applies a single standard WorkspaceEdit (marks dirty, respects normal VS Code Save/Undo).
   */
  public async maybeAutoInitializeOnFirstOpen(): Promise<void> {
    if (this.initializationConsidered || this.isInitializing) {
      return;
    }
    this.initializationConsidered = true;

    if (this.isDocumentReadOnly()) {
      return;
    }

    const initialText = this.document.getText();
    if (!isEmptyOrWhitespaceDocument(initialText)) {
      return;
    }

    await this.applyDefaultInitializationEdit();
  }

  public async explicitlyInitializeEmptyDocument(): Promise<void> {
    if (this.isDocumentReadOnly()) {
      void vscode.window.showWarningMessage(
        'Cannot initialize a read-only Vizion document.'
      );
      return;
    }
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) {
      void vscode.window.showWarningMessage(
        'Document is not empty. Vizion never overwrites non-empty content.'
      );
      return;
    }
    await this.applyDefaultInitializationEdit();
    this.revalidateAndBroadcast();
  }

  private async applyDefaultInitializationEdit(): Promise<void> {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      const tokenBefore = this.document.version;
      const textBefore = this.document.getText();
      if (!isEmptyOrWhitespaceDocument(textBefore)) {
        return;
      }

      const defaultContent = serializeDefaultDocument(
        this.kind,
        this.document.uri.fsPath || this.document.uri.path
      );

      // Re-verify concurrency token immediately prior to applying
      if (
        this.document.version !== tokenBefore ||
        !isEmptyOrWhitespaceDocument(this.document.getText())
      ) {
        return;
      }

      const fullRange = new vscode.Range(
        this.document.positionAt(0),
        this.document.positionAt(textBefore.length)
      );
      const edit = new vscode.WorkspaceEdit();
      edit.replace(this.document.uri, fullRange, defaultContent);

      const applied = await vscode.workspace.applyEdit(edit);
      if (!applied) {
        void vscode.window.showErrorMessage(
          'Vizion could not apply default initialization to the document.'
        );
      }
    } finally {
      this.isInitializing = false;
    }
  }

  private enqueueOperation(task: () => Promise<void>): void {
    this.operationQueue = this.operationQueue.then(task, task);
  }

  private async executeOperationRequest(
    requestingPanel: vscode.WebviewPanel,
    requestId: string,
    expectedVersion: number,
    operation: VizionOperationPayload
  ): Promise<void> {
    if (this.isDocumentReadOnly()) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: false,
        error: 'Document is read-only.'
      } satisfies HostToWebviewMessage);
      return;
    }

    // Reject stale operations if the underlying TextDocument changed since the gesture started
    if (this.document.version !== expectedVersion) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: false,
        staleRejected: true,
        error: 'Document changed externally during gesture. View refreshed.'
      } satisfies HostToWebviewMessage);
      this.sendSnapshotToPanel(requestingPanel);
      return;
    }

    const rawText = this.document.getText();
    const result = applyUmlOperationToText(rawText, operation);

    if (!result.ok || !result.edits) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: false,
        error: result.error ?? 'Operation failed validation.'
      } satisfies HostToWebviewMessage);
      return;
    }

    if (result.edits.length === 0) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: true,
        createdIds: result.createdIds
      } satisfies HostToWebviewMessage);
      return;
    }

    // Re-check concurrency token right before applying WorkspaceEdit
    if (this.document.version !== expectedVersion) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: false,
        staleRejected: true,
        error: 'Document changed concurrently before edit could be committed.'
      } satisfies HostToWebviewMessage);
      this.sendSnapshotToPanel(requestingPanel);
      return;
    }

    const wsEdit = new vscode.WorkspaceEdit();
    for (const span of result.edits) {
      const range = new vscode.Range(
        this.document.positionAt(span.offset),
        this.document.positionAt(span.offset + span.length)
      );
      wsEdit.replace(this.document.uri, range, span.content);
    }

    const applied = await vscode.workspace.applyEdit(wsEdit);
    if (applied) {
      this.undoStack.push(rawText);
      if (this.undoStack.length > 200) {
        this.undoStack.shift();
      }
      this.redoStack.length = 0;
      this.revalidateAndBroadcast();
    }
    void requestingPanel.webview.postMessage({
      type: 'host.operationResult',
      requestId,
      ok: applied,
      createdIds: applied ? result.createdIds : undefined,
      error: applied ? undefined : 'VS Code rejected WorkspaceEdit.'
    } satisfies HostToWebviewMessage);
  }

  private async performUndo(): Promise<void> {
    if (this.isDocumentReadOnly()) return;
    if (this.undoStack.length === 0) {
      await vscode.commands.executeCommand('undo');
      this.revalidateAndBroadcast();
      return;
    }
    const targetText = this.undoStack.pop()!;
    const currentText = this.document.getText();
    const diff = computeMinimalDiffSpan(currentText, targetText);
    if (!diff) {
      return;
    }
    const wsEdit = new vscode.WorkspaceEdit();
    const range = new vscode.Range(
      this.document.positionAt(diff.offset),
      this.document.positionAt(diff.offset + diff.length)
    );
    wsEdit.replace(this.document.uri, range, diff.content);
    const applied = await vscode.workspace.applyEdit(wsEdit);
    if (applied) {
      this.redoStack.push(currentText);
      this.revalidateAndBroadcast();
    }
  }

  private async performRedo(): Promise<void> {
    if (this.isDocumentReadOnly()) return;
    if (this.redoStack.length === 0) {
      await vscode.commands.executeCommand('redo');
      this.revalidateAndBroadcast();
      return;
    }
    const targetText = this.redoStack.pop()!;
    const currentText = this.document.getText();
    const diff = computeMinimalDiffSpan(currentText, targetText);
    if (!diff) {
      return;
    }
    const wsEdit = new vscode.WorkspaceEdit();
    const range = new vscode.Range(
      this.document.positionAt(diff.offset),
      this.document.positionAt(diff.offset + diff.length)
    );
    wsEdit.replace(this.document.uri, range, diff.content);
    const applied = await vscode.workspace.applyEdit(wsEdit);
    if (applied) {
      this.undoStack.push(currentText);
      this.revalidateAndBroadcast();
    }
  }

  // ============================================================================
  // Native VS Code Picker & Input Box Workflows (Section 2.3 & 9.5)
  // ============================================================================

  public async promptAddUmlNodeFlow(
    panel: vscode.WebviewPanel | undefined,
    expectedVersion = this.document.version,
    x = 120,
    y = 100,
    preselectedKind?: string
  ): Promise<void> {
    if (this.kind !== 'uml' || this.isDocumentReadOnly()) return;

    let chosenKind = preselectedKind;
    if (!chosenKind) {
      const kindItems = listUmlNodeKinds().map((desc) => ({
        label: desc.label,
        description: desc.kind,
        detail: desc.description,
        kindValue: desc.kind
      }));
      const picked = await vscode.window.showQuickPick(kindItems, {
        title: 'Vizion UML: Choose Node Kind',
        placeHolder: 'Select class, note, or shape'
      });
      if (!picked) {
        this.restoreFocus(panel);
        return;
      }
      chosenKind = picked.kindValue;
    }

    const defaultName =
      chosenKind === 'note'
        ? 'Architecture Note'
        : chosenKind === 'shape'
          ? 'Shape'
          : 'DomainEntity';

    const enteredName = await vscode.window.showInputBox({
      title: `Vizion UML: New ${chosenKind.toUpperCase()} Name`,
      prompt:
        chosenKind === 'note'
          ? 'Enter note text or summary'
          : `Enter ${chosenKind} identifier`,
      value: defaultName,
      validateInput: (val) =>
        val.trim().length === 0 ? 'Name cannot be empty' : undefined
    });

    this.restoreFocus(panel);
    if (!enteredName || enteredName.trim().length === 0) {
      return;
    }

    // Verify document didn't drift while picker was open
    if (this.document.version !== expectedVersion) {
      void vscode.window.showWarningMessage(
        'Document changed while the picker was open. Please retry adding the node.'
      );
      return;
    }

    const baseSlug =
      enteredName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || chosenKind;
    const uniqueId = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

    this.enqueueOperation(async () => {
      const targetPanel = panel ?? Array.from(this.panels)[0]?.panel;
      if (!targetPanel) return;
      await this.executeOperationRequest(targetPanel, `host-add-${uniqueId}`, expectedVersion, {
        type: 'uml.addNode',
        id: uniqueId,
        kind: chosenKind,
        name: enteredName.trim(),
        x,
        y,
        text: chosenKind === 'note' ? enteredName.trim() : undefined
      });
    });
  }

  private async promptAddUmlEdgeFlow(
    panel: vscode.WebviewPanel,
    expectedVersion: number,
    sourceNodeId: string,
    targetNodeId: string,
    defaultKind?: UmlRelationKind
  ): Promise<void> {
    const presetItems = listUmlRelationPresets().map((preset) => ({
      label: preset.label,
      description: preset.kind,
      detail: preset.description,
      picked: preset.kind === (defaultKind ?? 'association'),
      presetKind: preset.kind
    }));

    const picked = await vscode.window.showQuickPick(presetItems, {
      title: `Vizion UML: Relation Kind (${sourceNodeId} > ${targetNodeId})`,
      placeHolder: 'Choose semantic relationship kind'
    });

    this.restoreFocus(panel);
    if (!picked) {
      return;
    }

    if (this.document.version !== expectedVersion) {
      void vscode.window.showWarningMessage(
        'Document changed while choosing relation kind. Connection cancelled.'
      );
      return;
    }

    const edgeId = `edge-${sourceNodeId}-${targetNodeId}-${Date.now().toString(36).slice(-4)}`;
    this.enqueueOperation(async () => {
      await this.executeOperationRequest(panel, `host-edge-${edgeId}`, expectedVersion, {
        type: 'uml.addEdge',
        id: edgeId,
        kind: picked.presetKind,
        sourceNodeId,
        targetNodeId
      });
    });
  }

  /**
   * Implements Section 9.5 Endpoint Editing Flow:
   * 1. Identifies start or end explicitly in the Quick Pick title.
   * 2. Opens native Quick Pick for decoration shape (none, circle, diamond, square, triangle, open-arrow).
   * 3. For closed shapes (`supportsFill: true`), offers hollow / filled selection.
   * 4. Commits the complete choice as a single atomic operation, or cancels without mutating.
   */
  private async promptEndpointDecorationFlow(
    panel: vscode.WebviewPanel,
    expectedVersion: number,
    edgeId: string,
    end: 'start' | 'end',
    currentDecoration?: EndpointDecoration
  ): Promise<void> {
    const endLabel = end === 'start' ? 'START (Source)' : 'END (Target)';
    const shapeItems = listEndpointShapes().map((shape) => ({
      label: shape.label,
      description:
        currentDecoration?.shape === shape.kind ? `${shape.kind} (current)` : shape.kind,
      detail: shape.description,
      shapeDescriptor: shape
    }));

    const pickedShape = await vscode.window.showQuickPick(shapeItems, {
      title: `Vizion UML: Customize ${endLabel} Endpoint Shape`,
      placeHolder: `Select decoration shape for ${endLabel} endpoint of relation "${edgeId}"`
    });

    if (!pickedShape) {
      this.restoreFocus(panel);
      return;
    }

    let chosenFill: EndpointFillMode | undefined;
    if (pickedShape.shapeDescriptor.supportsFill) {
      const currentFill =
        currentDecoration?.fill ?? pickedShape.shapeDescriptor.defaultFill ?? 'hollow';
      const fillItems: { label: string; description: string; detail: string; fillValue: EndpointFillMode }[] = [
        {
          label: 'Hollow',
          description: currentFill === 'hollow' ? 'hollow (current)' : 'hollow',
          detail: 'Interior filled with theme canvas background; path trimmed cleanly at boundary',
          fillValue: 'hollow'
        },
        {
          label: 'Filled',
          description: currentFill === 'filled' ? 'filled (current)' : 'filled',
          detail: 'Solid foreground fill',
          fillValue: 'filled'
        }
      ];

      const pickedFill = await vscode.window.showQuickPick(fillItems, {
        title: `Vizion UML: Choose ${endLabel} ${pickedShape.shapeDescriptor.label} Fill Mode`,
        placeHolder: 'Select Hollow or Filled appearance'
      });

      if (!pickedFill) {
        this.restoreFocus(panel);
        return;
      }
      chosenFill = pickedFill.fillValue;
    }

    this.restoreFocus(panel);

    if (this.document.version !== expectedVersion) {
      void vscode.window.showWarningMessage(
        'Document changed while endpoint picker was open. Endpoint update cancelled.'
      );
      return;
    }

    const decoration: EndpointDecoration = {
      shape: pickedShape.shapeDescriptor.kind,
      size: currentDecoration?.size ?? pickedShape.shapeDescriptor.defaultSize,
      ...(chosenFill ? { fill: chosenFill } : {})
    };

    this.enqueueOperation(async () => {
      await this.executeOperationRequest(
        panel,
        `host-endpoint-${edgeId}-${end}`,
        expectedVersion,
        {
          type: 'uml.updateEndpoint',
          edgeId,
          end,
          decoration
        }
      );
    });
  }

  private async promptChangeRelationKindFlow(
    panel: vscode.WebviewPanel,
    expectedVersion: number,
    edgeId: string,
    currentKind: UmlRelationKind
  ): Promise<void> {
    const items = listUmlRelationPresets().map((preset) => ({
      label: preset.label,
      description:
        preset.kind === currentKind ? `${preset.kind} (current)` : preset.kind,
      detail: preset.description,
      presetKind: preset.kind
    }));

    const picked = await vscode.window.showQuickPick(items, {
      title: `Vizion UML: Change Relation Kind (${edgeId})`,
      placeHolder: 'Select relation semantic kind and reset notation preset'
    });

    this.restoreFocus(panel);
    if (!picked) return;

    if (this.document.version !== expectedVersion) {
      void vscode.window.showWarningMessage(
        'Document changed while picker was open. Operation cancelled.'
      );
      return;
    }

    this.enqueueOperation(async () => {
      await this.executeOperationRequest(panel, `host-relkind-${edgeId}`, expectedVersion, {
        type: 'uml.updateEdge',
        edgeId,
        kind: picked.presetKind
      });
    });
  }

  private async promptRenameEntityFlow(
    panel: vscode.WebviewPanel,
    expectedVersion: number,
    targetKind: 'node' | 'edgeLabel' | 'documentTitle',
    targetId: string,
    currentValue: string
  ): Promise<void> {
    const titleMap = {
      node: 'Rename UML Node',
      edgeLabel: 'Edit Relation Label',
      documentTitle: 'Rename Document Title'
    };

    const nextValue = await vscode.window.showInputBox({
      title: `Vizion: ${titleMap[targetKind]}`,
      value: currentValue,
      prompt:
        targetKind === 'edgeLabel'
          ? 'Enter relation label (leave empty to clear)'
          : 'Enter new text'
    });

    this.restoreFocus(panel);
    if (nextValue === undefined) {
      return;
    }

    if (this.document.version !== expectedVersion) {
      void vscode.window.showWarningMessage(
        'Document changed while input box was open. Edit cancelled.'
      );
      return;
    }

    this.enqueueOperation(async () => {
      if (targetKind === 'node') {
        if (!nextValue.trim()) return;
        await this.executeOperationRequest(panel, `rename-node-${targetId}`, expectedVersion, {
          type: 'uml.updateNode',
          nodeId: targetId,
          name: nextValue.trim()
        });
      } else if (targetKind === 'edgeLabel') {
        await this.executeOperationRequest(panel, `rename-edge-${targetId}`, expectedVersion, {
          type: 'uml.updateEdge',
          edgeId: targetId,
          label: nextValue.trim()
        });
      } else if (targetKind === 'documentTitle') {
        if (!nextValue.trim()) return;
        await this.executeOperationRequest(panel, `rename-doc`, expectedVersion, {
          type: 'uml.updateMetadata',
          title: nextValue.trim()
        });
      }
    });
  }

  private async saveExportedSvg(svgContent: string): Promise<void> {
    const defaultUri = vscode.Uri.file(
      this.document.uri.fsPath.replace(/\.uml\.viz$/i, '.svg')
    );
    const targetUri = await vscode.window.showSaveDialog({
      title: 'Export Vizion Diagram as SVG',
      defaultUri,
      filters: { 'SVG Vector Image': ['svg'] }
    });
    if (!targetUri) return;

    await vscode.workspace.fs.writeFile(targetUri, Buffer.from(svgContent, 'utf8'));
    void vscode.window.showInformationMessage(
      `Exported SVG to ${ vscode.workspace.asRelativePath(targetUri) }`
    );
  }

  private restoreFocus(panel: vscode.WebviewPanel | undefined): void {
    if (!panel) return;
    void panel.webview.postMessage({
      type: 'host.command',
      command: 'restoreCanvasFocus'
    } satisfies HostToWebviewMessage);
  }

  // ============================================================================
  // Validation & Snapshot Broadcasting
  // ============================================================================

  private scheduleRevalidateAndBroadcast(): void {
    if (this.validationDebounceTimer) {
      clearTimeout(this.validationDebounceTimer);
    }
    this.validationDebounceTimer = setTimeout(() => {
      this.revalidateAndBroadcast();
    }, 45);
  }

  public revalidateAndBroadcast(): void {
    const snapshot = this.computeSnapshot();
    this.diagnostics.updateDiagnostics(this.document, snapshot.issues);

    for (const entry of this.panels) {
      if (entry.ready) {
        void entry.panel.webview.postMessage(snapshot);
      }
    }
  }

  private sendSnapshotToPanel(panel: vscode.WebviewPanel): void {
    const snapshot = this.computeSnapshot();
    void panel.webview.postMessage(snapshot);
  }

  public computeSnapshot(): HostToWebviewSnapshotMessage {
    const rawText = this.document.getText();
    const isEmpty = isEmptyOrWhitespaceDocument(rawText);
    const parsed = parseAndValidateDocument(rawText, this.kind);

    if (parsed.ok && parsed.document) {
      this.lastValidDocument = parsed.document;
    }

    return {
      type: 'host.snapshot',
      expectedKind: this.kind,
      documentVersion: this.document.version,
      isReadOnly: this.isDocumentReadOnly(),
      isEmptyDocument: isEmpty,
      canExplicitlyInitialize: isEmpty && !this.isDocumentReadOnly(),
      valid: parsed.ok,
      document: parsed.document,
      lastValidDocument: parsed.ok ? undefined : this.lastValidDocument,
      issues: parsed.issues,
      hasUnsupportedConstructs: parsed.hasUnsupportedConstructs
    };
  }

  public dispose(): void {
    if (this.validationDebounceTimer) {
      clearTimeout(this.validationDebounceTimer);
    }
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables.length = 0;
  }
}
