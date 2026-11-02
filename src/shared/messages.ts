import type {
  EndpointDecoration,
  UmlRelationKind,
  ValidationIssue,
  VizionDocument,
  VizionDocumentKind
} from './documents/types';
import type { VizionOperationPayload } from './operations';

/**
 * Validated, serializable message contracts between the VS Code Extension Host
 * and the Svelte 5 Webview Canvas.
 */

export interface HostToWebviewSnapshotMessage {
  type: 'host.snapshot';
  expectedKind: VizionDocumentKind;
  documentVersion: number;
  isReadOnly: boolean;
  isEmptyDocument: boolean;
  canExplicitlyInitialize: boolean;
  valid: boolean;
  document?: VizionDocument;
  lastValidDocument?: VizionDocument;
  issues: ValidationIssue[];
  hasUnsupportedConstructs?: boolean;
}

export interface HostToWebviewOperationAckMessage {
  type: 'host.operationResult';
  requestId: string;
  ok: boolean;
  error?: string;
  createdIds?: string[];
  staleRejected?: boolean;
}

export interface HostToWebviewCommandMessage {
  type: 'host.command';
  command: 'fitContent' | 'resetZoom' | 'restoreCanvasFocus';
}

export type HostToWebviewMessage =
  | HostToWebviewSnapshotMessage
  | HostToWebviewOperationAckMessage
  | HostToWebviewCommandMessage;

// ============================================================================
// Webview -> Host Messages
// ============================================================================

export type WebviewToHostMessage =
  | {
      type: 'webview.ready';
    }
  | {
      type: 'webview.operation';
      requestId: string;
      expectedDocumentVersion: number;
      operation: VizionOperationPayload;
    }
  | {
      type: 'webview.openAsText';
    }
  | {
      type: 'webview.showProblems';
    }
  | {
      type: 'webview.recheck';
    }
  | {
      type: 'webview.initializeEmpty';
    }
  | {
      type: 'webview.promptAddUmlNode';
      expectedDocumentVersion: number;
      x: number;
      y: number;
      defaultKind?: string;
    }
  | {
      type: 'webview.promptAddUmlEdge';
      expectedDocumentVersion: number;
      sourceNodeId: string;
      targetNodeId: string;
      defaultKind?: UmlRelationKind;
    }
  | {
      type: 'webview.promptEndpointDecoration';
      expectedDocumentVersion: number;
      edgeId: string;
      end: 'start' | 'end';
      currentDecoration?: EndpointDecoration;
    }
  | {
      type: 'webview.promptRenameEntity';
      expectedDocumentVersion: number;
      targetKind: 'node' | 'edgeLabel' | 'documentTitle';
      targetId: string;
      currentValue: string;
    }
  | {
      type: 'webview.promptChangeRelationKind';
      expectedDocumentVersion: number;
      edgeId: string;
      currentKind: UmlRelationKind;
    }
  | {
      type: 'webview.undo';
    }
  | {
      type: 'webview.redo';
    }
  | {
      type: 'webview.exportFile';
      format: 'png';
      base64Data: string;
    }
  | {
      type: 'webview.copyImageToClipboard';
      base64Data: string;
    }
  | {
      type: 'webview.checkForExtensionUpdate';
    };
