import * as vscode from 'vscode';
import type { CoordinatorRegistry } from '../documents/registry';
import { buildWebviewHtml } from '../webviews/html';

export class UmlEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'vizion.uml';

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly registry: CoordinatorRegistry
  ) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
    };

    const coordinator = this.registry.acquire(document, 'uml');
    coordinator.attachPanel(webviewPanel);
    await coordinator.maybeAutoInitializeOnFirstOpen();
    const initialSnapshot = coordinator.computeSnapshot();
    webviewPanel.webview.html = buildWebviewHtml(
      webviewPanel.webview,
      this.extensionUri,
      'uml',
      initialSnapshot
    );
  }
}

