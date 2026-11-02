import { computeMinimalJsonEdits } from '../documents/json-patch';
import { parseAndValidateDocument } from '../documents/validator';
import {
  applyAddEdge,
  applyUpdateEdge,
  applyUpdateEndpoint
} from './edge-operations';
import {
  applyMigrateDocument,
  applyUpdateMetadata
} from './metadata-operations';
import {
  applyAddNode,
  applyDeleteEntities,
  applyDuplicateSelection,
  applyMoveResizeNodes,
  applyUpdateNode
} from './node-operations';
import type {
  ApplyOperationOutput,
  OperationMutationResult,
  UmlOperationPayload
} from './types';

// ============================================================================
// Public Barrel Re-Exports
// ============================================================================

export * from './types';
export * from './text-parsers';
export * from './node-operations';
export * from './edge-operations';
export * from './metadata-operations';

// ============================================================================
// Main Operations Dispatcher
// ============================================================================

/**
 * Applies a semantic UML operation to raw JSON text, preserving unknown fields and formatting,
 * and validates the resulting document before returning.
 */
export function applyUmlOperationToText(
  rawText: string,
  op: UmlOperationPayload
): ApplyOperationOutput {
  const parsed = parseAndValidateDocument(rawText, 'uml');
  if (!parsed.ok || !parsed.document) {
    return {
      ok: false,
      error: parsed.issues[0]?.message ?? 'Cannot apply UML operation to an invalid document.'
    };
  }

  const doc = parsed.document;
  let result: OperationMutationResult;

  switch (op.type) {
    case 'uml.updateMetadata':
      result = applyUpdateMetadata(doc, op);
      break;

    case 'uml.migrateDocument':
      result = applyMigrateDocument(doc, op);
      break;

    case 'uml.addNode':
      result = applyAddNode(doc, op);
      break;

    case 'uml.updateNode':
      result = applyUpdateNode(doc, op);
      break;

    case 'uml.moveResizeNodes':
      result = applyMoveResizeNodes(doc, op);
      break;

    case 'uml.deleteEntities':
      result = applyDeleteEntities(doc, op);
      break;

    case 'uml.duplicateSelection':
      result = applyDuplicateSelection(doc, op);
      break;

    case 'uml.addEdge':
      result = applyAddEdge(doc, op);
      break;

    case 'uml.updateEdge':
      result = applyUpdateEdge(doc, op);
      break;

    case 'uml.updateEndpoint':
      result = applyUpdateEndpoint(doc, op);
      break;

    default: {
      const exhaustiveCheck: never = op;
      return {
        ok: false,
        error: `Unhandled operation type: ${(exhaustiveCheck as { type?: string })?.type ?? 'unknown'}`
      };
    }
  }

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const patches = result.patches;
  const createdIds = result.createdIds ?? [];

  if (patches.length === 0) {
    return { ok: true, updatedText: rawText, edits: [], createdIds };
  }

  const { updatedText, edits } = computeMinimalJsonEdits(rawText, patches);
  const revalidated = parseAndValidateDocument(updatedText, 'uml');
  if (!revalidated.ok) {
    return {
      ok: false,
      error:
        revalidated.issues[0]?.message ??
        'Operation produced an invalid UML document state and was rejected.'
    };
  }

  return { ok: true, updatedText, edits, createdIds };
}
