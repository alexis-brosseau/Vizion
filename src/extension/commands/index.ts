import * as vscode from 'vscode';
import type { CoordinatorRegistry } from '../coordinator';
import { registerCanvasCommands } from './canvas-commands';
import { createAndOpenVizionFile, resolveTargetFolder } from './create-diagram';

export function registerVizionCommands(
  context: vscode.ExtensionContext,
  registry: CoordinatorRegistry
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('vizion.newUmlDiagram', async (uri?: vscode.Uri) => {
      await createAndOpenVizionFile(uri);
    })
  );

  registerCanvasCommands(context, registry);
}

export { createAndOpenVizionFile, resolveTargetFolder } from './create-diagram';
export { registerCanvasCommands } from './canvas-commands';
