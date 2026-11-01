import * as path from 'path';
import * as vscode from 'vscode';
import { serializeDefaultDocument } from '../../shared/documents/templates';
import type { CoordinatorRegistry } from '../documents/registry';

async function resolveTargetFolder(contextUri?: vscode.Uri): Promise<vscode.Uri | undefined> {
  if (contextUri) {
    try {
      const stat = await vscode.workspace.fs.stat(contextUri);
      if ((stat.type & vscode.FileType.Directory) !== 0) {
        return contextUri;
      }
      return vscode.Uri.file(path.dirname(contextUri.fsPath));
    } catch {
      // Fallback to workspace root
    }
  }

  const firstWorkspace = vscode.workspace.workspaceFolders?.[0];
  if (firstWorkspace) {
    return vscode.Uri.joinPath(firstWorkspace.uri, '.vizion', 'architecture');
  }

  const picked = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Folder for Vizion File'
  });
  return picked?.[0];
}

async function createAndOpenVizionFile(contextUri?: vscode.Uri): Promise<void> {
  const suffix = '.viz';
  const defaultBase = 'domain';
  const entered = await vscode.window.showInputBox({
    title: 'Vizion: New UML Diagram',
    prompt: `Enter filename (automatically appends ${suffix} if omitted)`,
    value: `${defaultBase}${suffix}`,
    validateInput: (val) => {
      const trimmed = val.trim();
      if (!trimmed) return 'Filename cannot be empty.';
      if (/[<>:"/\\|?*]/.test(trimmed)) return 'Filename contains invalid path characters.';
      return undefined;
    }
  });

  if (!entered) return;

  let fileName = entered.trim();
  if (!fileName.toLowerCase().endsWith(suffix)) {
    fileName = `${fileName}${suffix}`;
  }

  const folderUri = await resolveTargetFolder(contextUri);
  if (!folderUri) return;

  await vscode.workspace.fs.createDirectory(folderUri);
  const fileUri = vscode.Uri.joinPath(folderUri, fileName);

  try {
    await vscode.workspace.fs.stat(fileUri);
    const overwrite = await vscode.window.showWarningMessage(
      `File "${fileName}" already exists. Open existing file instead?`,
      'Open Existing',
      'Cancel'
    );
    if (overwrite !== 'Open Existing') return;
  } catch {
    const initialJson = serializeDefaultDocument('uml', fileName);
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(initialJson, 'utf8'));
  }

  await vscode.commands.executeCommand('vscode.openWith', fileUri, 'vizion.uml');
}

export function registerVizionCommands(
  context: vscode.ExtensionContext,
  registry: CoordinatorRegistry
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('vizion.newUmlDiagram', async (uri?: vscode.Uri) => {
      await createAndOpenVizionFile(uri);
    }),

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
        void vscode.window.showInformationMessage(
          'Focus an empty .viz document first.'
        );
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

    vscode.commands.registerCommand('vizion.exportCurrentSvg', () => {
      const active = registry.getActiveCoordinator();
      active?.broadcastCommand('requestSvgExport', true);
    })
  );
}
