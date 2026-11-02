import * as vscode from 'vscode';
import {
  isEmptyOrWhitespaceDocument,
  serializeDefaultDocument
} from '../../shared/documents/templates';
import type { VizionDocumentKind } from '../../shared/documents/types';
import {
  applyUmlOperationToText,
  type VizionOperationPayload
} from '../../shared/operations';

export interface WorkspaceEditResult {
  ok: boolean;
  applied: boolean;
  staleRejected?: boolean;
  error?: string;
  createdIds?: string[];
}

/**
 * Pipeline responsible for atomic WorkspaceEdit execution, two-phase version concurrency locking,
 * and empty document initialization.
 */
export class WorkspaceEditPipeline {
  /**
   * Checks whether the underlying document is read-only (e.g. git diff, virtual file).
   */
  public static isDocumentReadOnly(document: vscode.TextDocument): boolean {
    const scheme = document.uri.scheme;
    return scheme !== 'file' && scheme !== 'untitled';
  }

  /**
   * Applies a semantic UML operation to the document atomically:
   * 1. Validates document is not read-only.
   * 2. Checks concurrency token (document.version === expectedVersion) to prevent lost updates.
   * 3. Calculates minimal JSON edits via applyUmlOperationToText.
   * 4. Re-verifies concurrency token immediately before applying edits.
   * 5. Translates TextSpanEdit[] into vscode.Range replacement spans.
   * 6. Commits vscode.workspace.applyEdit(WorkspaceEdit).
   */
  public static async applyOperation(
    document: vscode.TextDocument,
    expectedVersion: number,
    operation: VizionOperationPayload
  ): Promise<WorkspaceEditResult> {
    if (this.isDocumentReadOnly(document)) {
      return { ok: false, applied: false, error: 'Document is read-only.' };
    }

    if (document.version !== expectedVersion) {
      return {
        ok: false,
        applied: false,
        staleRejected: true,
        error: 'Document changed externally during gesture. View refreshed.'
      };
    }

    const rawText = document.getText();
    const result = applyUmlOperationToText(rawText, operation);

    if (!result.ok || !result.edits) {
      return {
        ok: false,
        applied: false,
        error: result.error ?? 'Operation failed validation.'
      };
    }

    if (result.edits.length === 0) {
      return {
        ok: true,
        applied: true,
        createdIds: result.createdIds
      };
    }

    if (document.version !== expectedVersion) {
      return {
        ok: false,
        applied: false,
        staleRejected: true,
        error: 'Document changed concurrently before edit could be committed.'
      };
    }

    const wsEdit = new vscode.WorkspaceEdit();
    for (const span of result.edits) {
      const range = new vscode.Range(
        document.positionAt(span.offset),
        document.positionAt(span.offset + span.length)
      );
      wsEdit.replace(document.uri, range, span.content);
    }

    const applied = await vscode.workspace.applyEdit(wsEdit);
    return {
      ok: applied,
      applied,
      createdIds: applied ? result.createdIds : undefined,
      error: applied ? undefined : 'VS Code rejected WorkspaceEdit.'
    };
  }

  /**
   * Atomically initializes an empty document with default JSON schema content.
   */
  public static async applyDefaultInitialization(
    document: vscode.TextDocument,
    kind: VizionDocumentKind
  ): Promise<boolean> {
    if (this.isDocumentReadOnly(document)) {
      return false;
    }

    const tokenBefore = document.version;
    const textBefore = document.getText();
    if (!isEmptyOrWhitespaceDocument(textBefore)) {
      return false;
    }

    const defaultContent = serializeDefaultDocument(
      kind,
      document.uri.fsPath || document.uri.path
    );

    if (
      document.version !== tokenBefore ||
      !isEmptyOrWhitespaceDocument(document.getText())
    ) {
      return false;
    }

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(textBefore.length)
    );
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, defaultContent);

    return await vscode.workspace.applyEdit(edit);
  }
}
