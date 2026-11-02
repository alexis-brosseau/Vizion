import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawn } from 'node:child_process';
import * as vscode from 'vscode';

export type ExportFormat = 'png' | 'svg';

export interface ExportDiagramOptions {
  format: ExportFormat;
  base64Data?: string;
  svgData?: string;
  defaultFileName?: string;
}

export interface ExportResult {
  success: boolean;
  targetUri?: vscode.Uri;
  cancelled?: boolean;
  error?: string;
}

export interface ClipboardResult {
  success: boolean;
  error?: string;
}

/**
 * OS-Agnostic Export & Clipboard Service for Vizion diagrams.
 *
 * Handles native OS save dialogs, high-resolution PNG & SVG file writing,
 * and cross-platform image/text clipboard integration across Linux, macOS, and Windows.
 */
export class ExportService {
  constructor(private readonly document: vscode.TextDocument) {}

  /**
   * Prompts user with native OS save dialog and saves high-resolution PNG or SVG diagram.
   */
  public async exportDiagram(options: ExportDiagramOptions): Promise<ExportResult> {
    const format = options.format;
    const defaultUri = this.resolveDefaultSaveUri(format, options.defaultFileName);

    const filterName = format === 'svg' ? 'SVG Image' : 'PNG Image';
    const filterExt = format === 'svg' ? ['svg'] : ['png'];

    const chosenUri = await vscode.window.showSaveDialog({
      defaultUri,
      saveLabel: `Export ${format.toUpperCase()}`,
      title: `Export Diagram as ${format.toUpperCase()}`,
      filters: {
        [filterName]: filterExt,
        'All Files': ['*']
      }
    });

    if (!chosenUri) {
      return { success: false, cancelled: true };
    }

    // Ensure correct extension is present across all OS file pickers
    let targetUri = chosenUri;
    const expectedExt = `.${format}`;
    if (!targetUri.path.toLowerCase().endsWith(expectedExt)) {
      targetUri = targetUri.with({ path: `${targetUri.path}${expectedExt}` });
    }

    try {
      let bytes: Uint8Array;
      if (format === 'svg') {
        const svgContent =
          options.svgData ??
          (options.base64Data ? Buffer.from(options.base64Data, 'base64').toString('utf8') : '');
        if (!svgContent.trim()) {
          throw new Error('SVG export content is empty.');
        }
        bytes = Buffer.from(svgContent, 'utf8');
      } else {
        const cleanBase64 = (options.base64Data ?? '')
          .replace(/^data:image\/png;base64,/, '')
          .trim();
        if (!cleanBase64) {
          throw new Error('PNG export image data is empty.');
        }
        bytes = Buffer.from(cleanBase64, 'base64');
        if (bytes.length === 0) {
          throw new Error('Decoded image buffer is empty.');
        }
      }

      // Visual progress feedback for large diagrams (> 2 MB)
      const isLarge = bytes.length > 2 * 1024 * 1024;
      if (isLarge) {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Exporting diagram (${(bytes.length / (1024 * 1024)).toFixed(1)} MB)...`,
            cancellable: false
          },
          async () => {
            await vscode.workspace.fs.writeFile(targetUri, bytes);
          }
        );
      } else {
        await vscode.workspace.fs.writeFile(targetUri, bytes);
      }

      const relPath = vscode.workspace.asRelativePath(targetUri);
      void vscode.window.showInformationMessage(
        `Exported diagram ${format.toUpperCase()} to ${relPath}`
      );

      return { success: true, targetUri };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode.window.showErrorMessage(`Failed to export diagram: ${message}`);
      return { success: false, error: message };
    }
  }

  /**
   * Convenience alias for exporting file, returning the saved URI if successful.
   */
  public async exportFile(
    base64Data?: string,
    format: ExportFormat = 'png',
    svgData?: string,
    defaultFileName?: string
  ): Promise<vscode.Uri | undefined> {
    const res = await this.exportDiagram({
      format,
      base64Data,
      svgData,
      defaultFileName
    });
    return res.targetUri;
  }

  /**
   * Copies PNG image binary data to system clipboard in an OS-agnostic manner.
   * Supports Linux (wl-copy / xclip), macOS (osascript), Windows (PowerShell STA).
   */
  public async copyImageToClipboard(base64Data: string): Promise<ClipboardResult> {
    const cleanBase64 = (base64Data ?? '')
      .replace(/^data:image\/png;base64,/, '')
      .trim();
    if (!cleanBase64) {
      void vscode.window.showErrorMessage('Failed to copy: image data is empty.');
      return { success: false, error: 'Empty image data' };
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0) {
      void vscode.window.showErrorMessage('Failed to copy: decoded image buffer is empty.');
      return { success: false, error: 'Decoded buffer empty' };
    }

    try {
      if (process.platform === 'linux') {
        await this.copyLinuxImage(buffer);
      } else if (process.platform === 'darwin') {
        await this.copyMacImage(buffer);
      } else if (process.platform === 'win32') {
        await this.copyWindowsImage(buffer);
      } else {
        throw new Error(`Unsupported platform for image clipboard: ${process.platform}`);
      }

      void vscode.window.showInformationMessage('Diagram image copied to clipboard.');
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode.window.showWarningMessage(`Could not copy image to clipboard: ${message}`);
      return { success: false, error: message };
    }
  }

  /**
   * Copies text-based content (SVG vector data or JSON AST) to system clipboard via VS Code API.
   */
  public async copyTextToClipboard(content: string, formatName: string = 'text'): Promise<ClipboardResult> {
    if (!content) {
      void vscode.window.showErrorMessage(`Failed to copy: ${formatName} content is empty.`);
      return { success: false, error: 'Empty content' };
    }

    try {
      await vscode.env.clipboard.writeText(content);
      void vscode.window.showInformationMessage(`Diagram ${formatName} copied to clipboard.`);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      void vscode.window.showErrorMessage(`Failed to copy to clipboard: ${message}`);
      return { success: false, error: message };
    }
  }

  // ============================================================================
  // Platform-Specific Implementations
  // ============================================================================

  private resolveDefaultSaveUri(format: ExportFormat, defaultFileName?: string): vscode.Uri {
    const ext = `.${format}`;

    let baseName = defaultFileName;
    if (!baseName) {
      if (this.document.uri.scheme === 'file') {
        const parsed = path.parse(this.document.uri.fsPath);
        baseName = parsed.name.replace(/\.uml$/i, '');
      } else {
        baseName = 'diagram';
      }
    }
    baseName = baseName.replace(/\.(?:png|svg|viz)$/i, '');
    const targetFileName = `${baseName}${ext}`;

    if (this.document.uri.scheme === 'file') {
      const parentDir = path.dirname(this.document.uri.fsPath);
      return vscode.Uri.file(path.join(parentDir, targetFileName));
    }

    const workspaceFolder =
      vscode.workspace.getWorkspaceFolder(this.document.uri) ??
      vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
      return vscode.Uri.joinPath(workspaceFolder.uri, targetFileName);
    }

    return vscode.Uri.file(targetFileName);
  }

  private async copyLinuxImage(buffer: Buffer): Promise<void> {
    const isWayland = Boolean(process.env.WAYLAND_DISPLAY);
    const primaryTool = isWayland ? 'wl-copy' : 'xclip';
    const secondaryTool = isWayland ? 'xclip' : 'wl-copy';

    const runTool = (tool: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const args =
          tool === 'wl-copy'
            ? ['-t', 'image/png']
            : ['-selection', 'clipboard', '-t', 'image/png'];

        const proc = spawn(tool, args, { stdio: ['pipe', 'ignore', 'pipe'] });
        let stderr = '';

        const timer = setTimeout(() => {
          proc.kill('SIGKILL');
          reject(new Error(`${tool} timed out after 5000ms`));
        }, 5000);

        proc.stderr.on('data', (d: Buffer) => {
          stderr += d.toString();
        });
        proc.on('error', (err: Error) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on('close', (code: number | null) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`${tool} exited with code ${code}: ${stderr.trim()}`));
        });

        proc.stdin.on('error', (err: Error) => {
          clearTimeout(timer);
          reject(err);
        });

        proc.stdin.end(buffer);
      });
    };

    try {
      await runTool(primaryTool);
    } catch (err: any) {
      if (err?.code === 'ENOENT') {
        try {
          await runTool(secondaryTool);
        } catch (err2: any) {
          if (err2?.code === 'ENOENT') {
            throw new Error(
              'Neither "wl-copy" nor "xclip" was found. Install "wl-clipboard" (Wayland) or "xclip" (X11).'
            );
          }
          throw err2;
        }
      } else {
        throw err;
      }
    }
  }

  private async copyMacImage(buffer: Buffer): Promise<void> {
    const tmpPath = path.join(
      os.tmpdir(),
      `vizion-clip-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    );
    await fs.promises.writeFile(tmpPath, buffer);
    try {
      await new Promise<void>((resolve, reject) => {
        const script = `set the clipboard to (read (POSIX file "${tmpPath}") as «class PNGf»)`;
        const proc = spawn('osascript', ['-e', script], { stdio: ['ignore', 'ignore', 'pipe'] });
        let stderr = '';

        const timer = setTimeout(() => {
          proc.kill('SIGKILL');
          reject(new Error('osascript timed out after 5000ms'));
        }, 5000);

        proc.stderr.on('data', (d: Buffer) => {
          stderr += d.toString();
        });
        proc.on('error', (err: Error) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on('close', (code: number | null) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`osascript exited with code ${code}: ${stderr.trim()}`));
        });
      });
    } finally {
      await fs.promises.unlink(tmpPath).catch(() => {});
    }
  }

  private async copyWindowsImage(buffer: Buffer): Promise<void> {
    const tmpPath = path.join(
      os.tmpdir(),
      `vizion-clip-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
    );
    await fs.promises.writeFile(tmpPath, buffer);
    try {
      await new Promise<void>((resolve, reject) => {
        const escaped = tmpPath.replace(/'/g, "''");
        const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $img = [System.Drawing.Image]::FromFile('${escaped}'); [System.Windows.Forms.Clipboard]::SetImage($img); $img.Dispose()`;
        const proc = spawn(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-STA', '-Command', psCommand],
          { stdio: ['ignore', 'ignore', 'pipe'] }
        );
        let stderr = '';

        const timer = setTimeout(() => {
          proc.kill('SIGKILL');
          reject(new Error('PowerShell clipboard command timed out after 5000ms'));
        }, 5000);

        proc.stderr.on('data', (d: Buffer) => {
          stderr += d.toString();
        });
        proc.on('error', (err: Error) => {
          clearTimeout(timer);
          reject(err);
        });
        proc.on('close', (code: number | null) => {
          clearTimeout(timer);
          if (code === 0) resolve();
          else reject(new Error(`PowerShell exited with code ${code}: ${stderr.trim()}`));
        });
      });
    } finally {
      setTimeout(() => {
        fs.promises.unlink(tmpPath).catch(() => {});
      }, 100);
    }
  }
}
