import * as vscode from 'vscode';
import type { CoordinatorRegistry } from '../coordinator';
import {
  promptAddUmlEdgeFlow,
  promptAddUmlNodeFlow,
  promptRenameEntityFlow
} from '../flows';

export function registerCanvasCommands(
  context: vscode.ExtensionContext,
  registry: CoordinatorRegistry
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('vizion.initializeCurrentDocument', async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await active.explicitlyInitializeEmptyDocument();
        return;
      }
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.fileName.endsWith('.viz')) {
        const coord = registry.acquire(editor.document, 'uml');
        await coord.explicitlyInitializeEmptyDocument();
      } else {
        void vscode.window.showInformationMessage('Focus an empty .viz document first.');
      }
    }),

    vscode.commands.registerCommand('vizion.openCurrentAsText', async () => {
      const active = registry.getActiveCoordinator();
      if (active) {
        await vscode.commands.executeCommand('vscode.openWith', active.document.uri, 'default');
      }
    }),

    vscode.commands.registerCommand('vizion.fitCanvasToContent', () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand('fitContent', true);
    }),

    vscode.commands.registerCommand('vizion.resetCanvasZoom', () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand('resetZoom', true);
    }),

    vscode.commands.registerCommand('vizion.addNode', async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode.window.showInformationMessage('Open or focus a Vizion UML editor first.');
        return;
      }
      await promptAddUmlNodeFlow(active.createFlowContext());
    }),

    vscode.commands.registerCommand('vizion.addRelation', async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode.window.showInformationMessage('Open or focus a Vizion UML editor first.');
        return;
      }
      await promptAddUmlEdgeFlow(active.createFlowContext());
    }),

    vscode.commands.registerCommand('vizion.renameEntity', async () => {
      const active = registry.getActiveCoordinator();
      if (!active) {
        void vscode.window.showInformationMessage('Open or focus a Vizion UML editor first.');
        return;
      }
      await promptRenameEntityFlow(active.createFlowContext());
    })
  );
}
