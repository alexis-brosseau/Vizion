import * as vscode from 'vscode';
import { isEmptyOrWhitespaceDocument } from '../../shared/documents/templates';
import type {
  VizionDocument,
  VizionDocumentKind
} from '../../shared/documents/types';
import { parseAndValidateDocument } from '../../shared/documents/validator';
import type {
  HostToWebviewMessage,
  HostToWebviewSnapshotMessage,
  WebviewToHostMessage
} from '../../shared/messages';
import type { VizionOperationPayload } from '../../shared/operations';
import type { VizionDiagnosticsManager } from './diagnostics-manager';
import { ExportService } from './export-service';
import type { FlowContext } from '../flows/flow-context';
import {
  promptAddUmlEdgeFlow,
  promptAddUmlNodeFlow,
  promptChangeRelationKindFlow,
  promptEndpointDecorationFlow,
  promptRenameEntityFlow
} from '../flows';
import { WorkspaceEditPipeline } from './workspace-edit-pipeline';

interface PanelEntry {
  panel: vscode.WebviewPanel;
  ready: boolean;
}

/**
 * Lean Document Coordinator managing webview panels, 45ms debounced snapshot broadcasting,
 * diagnostics synchronization, FIFO serialized queue, native undo/redo, and IPC routing.
 */
export class DocumentCoordinator implements vscode.Disposable {
  public readonly uriKey: string;
  private readonly panels = new Set<PanelEntry>();
  private readonly disposables: vscode.Disposable[] = [];
  public readonly exportService: ExportService;

  private initializationConsidered = false;
  private isInitializing = false;
  private lastValidDocument: VizionDocument | undefined;
  private operationQueue: Promise<void> = Promise.resolve();
  private validationDebounceTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    public readonly document: vscode.TextDocument,
    public readonly kind: VizionDocumentKind,
    private readonly diagnostics: VizionDiagnosticsManager,
    private readonly onAllPanelsAndDocumentClosed: (uriKey: string) => void
  ) {
    this.uriKey = document.uri.toString();
    this.exportService = new ExportService(document);

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
      if (entry.panel.active) return true;
    }
    return false;
  }

  public get lastValidDoc(): VizionDocument | undefined {
    return this.lastValidDocument;
  }

  public attachPanel(panel: vscode.WebviewPanel): void {
    const entry: PanelEntry = { panel, ready: false };
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
    command: 'fitContent' | 'resetZoom' | 'restoreCanvasFocus',
    onlyActive = false
  ): void {
    const msg: HostToWebviewMessage = { type: 'host.command', command };
    for (const entry of this.panels) {
      if (!entry.ready) continue;
      if (onlyActive && !entry.panel.active) continue;
      void entry.panel.webview.postMessage(msg);
    }
  }

  public restoreFocus(panel?: vscode.WebviewPanel): void {
    if (!panel) return;
    void panel.webview.postMessage({
      type: 'host.command',
      command: 'restoreCanvasFocus'
    } satisfies HostToWebviewMessage);
  }

  public enqueueOperation<T>(task: () => Promise<T>): Promise<T> {
    const resultPromise = this.operationQueue.then(task, task);
    this.operationQueue = resultPromise.then(() => {}, () => {});
    return resultPromise;
  }

  public async maybeAutoInitializeOnFirstOpen(): Promise<void> {
    if (this.initializationConsidered || this.isInitializing) return;
    this.initializationConsidered = true;

    if (WorkspaceEditPipeline.isDocumentReadOnly(this.document)) return;
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) return;

    await this.applyDefaultInitializationEdit();
  }

  public async explicitlyInitializeEmptyDocument(): Promise<void> {
    if (WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
      void vscode.window.showWarningMessage('Cannot initialize a read-only Vizion document.');
      return;
    }
    if (!isEmptyOrWhitespaceDocument(this.document.getText())) {
      void vscode.window.showWarningMessage('Document is not empty. Vizion never overwrites non-empty content.');
      return;
    }
    await this.applyDefaultInitializationEdit();
    this.revalidateAndBroadcast();
  }

  private async applyDefaultInitializationEdit(): Promise<void> {
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      const applied = await WorkspaceEditPipeline.applyDefaultInitialization(
        this.document,
        this.kind
      );
      if (!applied) {
        void vscode.window.showErrorMessage('Vizion could not apply default initialization to the document.');
      }
    } finally {
      this.isInitializing = false;
    }
  }

  public async executeOperationRequest(
    requestingPanel: vscode.WebviewPanel | undefined,
    requestId: string,
    expectedVersion: number,
    operation: VizionOperationPayload
  ): Promise<void> {
    const result = await WorkspaceEditPipeline.applyOperation(
      this.document,
      expectedVersion,
      operation
    );

    if (requestingPanel) {
      void requestingPanel.webview.postMessage({
        type: 'host.operationResult',
        requestId,
        ok: result.ok,
        createdIds: result.createdIds,
        error: result.error,
        staleRejected: result.staleRejected
      } satisfies HostToWebviewMessage);

      if (result.staleRejected) {
        this.sendSnapshotToPanel(requestingPanel);
      }
    }

    if (result.applied) {
      this.revalidateAndBroadcast();
    }
  }

  public createFlowContext(panel?: vscode.WebviewPanel, expectedVersion = this.document.version): FlowContext {
    return {
      document: this.document,
      panel,
      expectedVersion,
      getLastValidDocument: () => this.lastValidDocument,
      enqueueOperation: (task) => this.enqueueOperation(task),
      executeOperation: (targetPanel, reqId, expVer, op) =>
        this.executeOperationRequest(targetPanel, reqId, expVer, op),
      restoreFocus: (targetPanel) => this.restoreFocus(targetPanel ?? panel)
    };
  }

  private async handleWebviewMessage(
    entry: PanelEntry,
    msg: WebviewToHostMessage
  ): Promise<void> {
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') return;

    switch (msg.type) {
      case 'webview.ready':
        entry.ready = true;
        await this.maybeAutoInitializeOnFirstOpen();
        this.revalidateAndBroadcast();
        break;

      case 'webview.recheck':
        this.revalidateAndBroadcast();
        break;

      case 'webview.openAsText':
        await vscode.commands.executeCommand(
          'vscode.openWith',
          this.document.uri,
          'default',
          entry.panel.viewColumn
        );
        break;

      case 'webview.showProblems':
        await vscode.commands.executeCommand('workbench.actions.view.problems');
        break;

      case 'webview.initializeEmpty':
        await this.explicitlyInitializeEmptyDocument();
        break;

      case 'webview.operation':
        this.enqueueOperation(async () => {
          await this.executeOperationRequest(
            entry.panel,
            msg.requestId,
            msg.expectedDocumentVersion,
            msg.operation
          );
        });
        break;

      case 'webview.promptAddUmlNode':
        await promptAddUmlNodeFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          { x: msg.x, y: msg.y, defaultKind: msg.defaultKind }
        );
        break;

      case 'webview.promptAddUmlEdge':
        await promptAddUmlEdgeFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            sourceNodeId: msg.sourceNodeId,
            targetNodeId: msg.targetNodeId,
            defaultKind: msg.defaultKind
          }
        );
        break;

      case 'webview.promptEndpointDecoration':
        await promptEndpointDecorationFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            edgeId: msg.edgeId,
            end: msg.end,
            currentDecoration: msg.currentDecoration
          }
        );
        break;

      case 'webview.promptRenameEntity':
        await promptRenameEntityFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            targetKind: msg.targetKind,
            targetId: msg.targetId,
            memberId: msg.memberId,
            currentValue: msg.currentValue
          }
        );
        break;

      case 'webview.promptChangeRelationKind':
        await promptChangeRelationKindFlow(
          this.createFlowContext(entry.panel, msg.expectedDocumentVersion),
          {
            edgeId: msg.edgeId,
            currentKind: msg.currentKind
          }
        );
        break;

      case 'webview.undo':
        if (!WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
          this.enqueueOperation(async () => {
            await vscode.commands.executeCommand('undo');
          });
        }
        break;

      case 'webview.redo':
        if (!WorkspaceEditPipeline.isDocumentReadOnly(this.document)) {
          this.enqueueOperation(async () => {
            await vscode.commands.executeCommand('redo');
          });
        }
        break;

      case 'webview.exportFile':
        await this.exportService.exportDiagram({
          format: msg.format,
          base64Data: msg.base64Data,
          svgData: msg.svgData,
          defaultFileName: msg.defaultFileName
        });
        break;

      case 'webview.copyImageToClipboard':
        await this.exportService.copyImageToClipboard(msg.base64Data);
        break;

      case 'webview.copyToClipboard':
        await this.exportService.copyTextToClipboard(msg.content, msg.format.toUpperCase());
        break;

      case 'webview.checkForExtensionUpdate':
        try {
          await vscode.commands.executeCommand('workbench.extensions.action.checkForUpdates');
          await vscode.commands.executeCommand('workbench.extensions.search', '@installed Vizion');
        } catch {
          void vscode.window.showInformationMessage('Please check the Extensions view for the latest Vizion update.');
        }
        break;
    }
  }

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

  public sendSnapshotToPanel(panel: vscode.WebviewPanel): void {
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
      isReadOnly: WorkspaceEditPipeline.isDocumentReadOnly(this.document),
      isEmptyDocument: isEmpty,
      canExplicitlyInitialize: isEmpty && !WorkspaceEditPipeline.isDocumentReadOnly(this.document),
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
    this.panels.clear();
  }
}
