import * as crypto from 'crypto';
import * as fs from 'fs';
import * as vscode from 'vscode';
import type { HostToWebviewSnapshotMessage } from '../../shared/messages';

function readAssetText(extensionUri: vscode.Uri, fileName: string): string {
  try {
    const fullPath = vscode.Uri.joinPath(extensionUri, 'media', fileName).fsPath;
    return fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    return `console.error("Failed to read ${fileName}:", ${JSON.stringify(String(err))});`;
  }
}

/**
 * Generates a self-contained, restrictive Content-Security-Policy HTML shell for the Svelte 5 webview.
 * Inlines the bundled CSS and JS with a cryptographic nonce so the webview never hangs waiting
 * on external `vscode-webview-resource:` network fetches.
 */
export function buildWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  editorKind: 'uml',
  initialSnapshot: HostToWebviewSnapshotMessage
): string {
  const nonce = crypto.randomBytes(16).toString('base64');

  const styleContent = readAssetText(extensionUri, 'webview.css');
  const scriptContent = readAssetText(extensionUri, 'webview.js').replace(
    /<\/script>/gi,
    '<\\/script>'
  );

  // Safely escape JSON for inline script embedding
  const serializedSnapshot = JSON.stringify(initialSnapshot)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  const csp = [
    `default-src 'none'`,
    `img-src ${webview.cspSource} data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `font-src ${webview.cspSource} data:`,
    `script-src 'nonce-${nonce}'`
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vizion ${editorKind.toUpperCase()} Editor</title>
  <style nonce="${nonce}">
${styleContent}
  </style>
</head>
<body data-vizion-kind="${editorKind}">
  <div id="app">
    <div style="padding: 16px; color: var(--vscode-descriptionForeground);">Loading Vizion ${editorKind.toUpperCase()} Canvas…</div>
  </div>
  <script nonce="${nonce}">
    window.__VIZION_INITIAL_SNAPSHOT__ = ${serializedSnapshot};
    window.addEventListener('error', function(e) {
      var el = document.getElementById('app');
      if (el) {
        el.innerHTML = '<div style="padding:20px;color:var(--vscode-errorForeground);font-family:monospace;"><strong>Vizion Webview Error:</strong><pre>' + (e.error && e.error.stack ? e.error.stack : e.message) + '</pre></div>';
      }
    });
  </script>
  <script nonce="${nonce}">
${scriptContent}
  </script>
</body>
</html>`;
}
