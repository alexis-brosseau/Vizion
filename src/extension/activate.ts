import * as vscode from 'vscode';
import { registerVizionCommands } from './commands';
import { VizionDiagnosticsManager } from './documents/diagnostics';
import { CoordinatorRegistry } from './documents/registry';
import { UmlEditorProvider } from './providers/uml-provider';

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = new VizionDiagnosticsManager();
  const registry = new CoordinatorRegistry(diagnostics);

  context.subscriptions.push(
    diagnostics,
    registry,
    vscode.window.registerCustomEditorProvider(
      UmlEditorProvider.viewType,
      new UmlEditorProvider(context.extensionUri, registry),
      {
        webviewOptions: {
          // Prefer rebuilding state from the authoritative host snapshot on hide/show
          // rather than keeping every hidden webview alive in memory (Section 6.4)
          retainContextWhenHidden: false
        },
        supportsMultipleEditorsPerDocument: true
      }
    )
  );

  registerVizionCommands(context, registry);
}

export function deactivate(): void {
  // All subscriptions are disposed via context.subscriptions
}
