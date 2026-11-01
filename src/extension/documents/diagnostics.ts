import * as vscode from 'vscode';
import type { ValidationIssue } from '../../shared/documents/types';

/**
 * Publishes validation and syntax issues for .uml.viz and .sketch.viz files
 * to the native VS Code Problems panel (`DiagnosticCollection`).
 */
export class VizionDiagnosticsManager implements vscode.Disposable {
  private readonly collection: vscode.DiagnosticCollection;

  constructor() {
    this.collection = vscode.languages.createDiagnosticCollection('vizion');
  }

  public updateDiagnostics(document: vscode.TextDocument, issues: ValidationIssue[]): void {
    if (issues.length === 0) {
      this.collection.delete(document.uri);
      return;
    }

    const text = document.getText();
    const diagnostics: vscode.Diagnostic[] = issues.map((issue) => {
      const range = this.resolveIssueRange(document, text, issue);
      const severity =
        issue.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : vscode.DiagnosticSeverity.Warning;
      const diag = new vscode.Diagnostic(
        range,
        `[${issue.path}] ${issue.message}`,
        severity
      );
      diag.source = 'Vizion';
      return diag;
    });

    this.collection.set(document.uri, diagnostics);
  }

  public clearDiagnostics(uri: vscode.Uri): void {
    this.collection.delete(uri);
  }

  private resolveIssueRange(
    document: vscode.TextDocument,
    text: string,
    issue: ValidationIssue
  ): vscode.Range {
    if (issue.line !== undefined && issue.line >= 1) {
      const zeroLine = Math.min(
        Math.max(0, issue.line - 1),
        Math.max(0, document.lineCount - 1)
      );
      const zeroCol = Math.max(0, (issue.column ?? 1) - 1);
      const pos = new vscode.Position(zeroLine, zeroCol);
      return new vscode.Range(pos, pos.translate(0, 1));
    }

    // Attempt to locate the JSON key from the tail of `issue.path`
    const tailKey = issue.path
      .split('.')
      .pop()
      ?.replace(/\[\d+\]$/, '');
    if (tailKey && tailKey !== '$') {
      const needle = `"${tailKey}"`;
      const idx = text.indexOf(needle);
      if (idx !== -1) {
        const start = document.positionAt(idx);
        const end = document.positionAt(idx + needle.length);
        return new vscode.Range(start, end);
      }
    }

    return new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 1));
  }

  public dispose(): void {
    this.collection.dispose();
  }
}

