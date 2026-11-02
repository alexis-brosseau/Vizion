import * as vscode from 'vscode';
import type { VizionDocumentKind } from '../../shared/documents/types';
import type { VizionDiagnosticsManager } from './diagnostics-manager';
import { DocumentCoordinator } from './document-coordinator';

export class CoordinatorRegistry implements vscode.Disposable {
  private readonly coordinators = new Map<string, DocumentCoordinator>();

  constructor(private readonly diagnostics: VizionDiagnosticsManager) {}

  public acquire(
    document: vscode.TextDocument,
    kind: VizionDocumentKind
  ): DocumentCoordinator {
    const key = document.uri.toString();
    const existing = this.coordinators.get(key);
    if (existing) {
      return existing;
    }

    const created = new DocumentCoordinator(
      document,
      kind,
      this.diagnostics,
      (closedKey) => {
        const coord = this.coordinators.get(closedKey);
        if (coord) {
          coord.dispose();
          this.coordinators.delete(closedKey);
        }
      }
    );
    this.coordinators.set(key, created);
    return created;
  }

  public getActiveCoordinator(): DocumentCoordinator | undefined {
    for (const coord of this.coordinators.values()) {
      if (coord.hasActivePanel) {
        return coord;
      }
    }
    return undefined;
  }

  public dispose(): void {
    for (const coord of this.coordinators.values()) {
      coord.dispose();
    }
    this.coordinators.clear();
  }
}
