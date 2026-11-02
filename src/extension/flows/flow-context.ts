import * as vscode from 'vscode';
import type { VizionDocument } from '../../shared/documents/types';
import type { VizionOperationPayload } from '../../shared/operations';

export interface FlowContext {
  document: vscode.TextDocument;
  panel?: vscode.WebviewPanel;
  expectedVersion: number;
  getLastValidDocument?: () => VizionDocument | undefined;
  enqueueOperation: (task: () => Promise<void>) => Promise<void>;
  executeOperation: (
    panel: vscode.WebviewPanel | undefined,
    requestId: string,
    expectedVersion: number,
    operation: VizionOperationPayload
  ) => Promise<void>;
  restoreFocus: (panel?: vscode.WebviewPanel) => void;
}
