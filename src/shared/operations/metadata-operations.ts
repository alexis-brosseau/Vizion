import type { JsonMutationPatch } from '../documents/json-patch';
import { runDocumentMigrations } from '../documents/migrations';
import type { UmlDocument } from '../documents/types';
import { EXTENSION_VERSION } from '../documents/version';
import type {
  OperationMutationResult,
  UmlMigrateDocumentPayload,
  UmlUpdateMetadataPayload
} from './types';

/**
 * Pure JSON mutation generator for updating title, description, purpose, and default routing.
 */
export function applyUpdateMetadata(
  doc: UmlDocument,
  op: UmlUpdateMetadataPayload
): OperationMutationResult {
  const patches: JsonMutationPatch[] = [];
  if (op.title !== undefined && op.title.trim().length > 0) {
    patches.push({ path: ['title'], value: op.title.trim() });
  }
  if (op.description !== undefined) {
    patches.push({ path: ['description'], value: op.description.trim() });
  } else if (op.purpose !== undefined) {
    patches.push({ path: ['description'], value: op.purpose.trim() });
  }
  if (op.defaultRouting !== undefined) {
    patches.push({ path: ['defaultRouting'], value: op.defaultRouting });
  }
  return { ok: true, patches };
}

/**
 * Pure JSON mutation generator for migrating document versions and schemas.
 */
export function applyMigrateDocument(
  doc: UmlDocument,
  _op?: UmlMigrateDocumentPayload
): OperationMutationResult {
  const { doc: migratedDoc, appliedSteps } = runDocumentMigrations(doc);
  if (appliedSteps.length === 0 && doc.version === EXTENSION_VERSION) {
    return { ok: false, error: 'Document is already up to date.' };
  }
  const patches: JsonMutationPatch[] = [];
  patches.push({ path: ['version'], value: EXTENSION_VERSION });
  if (migratedDoc.description !== undefined) {
    patches.push({ path: ['description'], value: migratedDoc.description });
  }
  if (doc.ai && 'purpose' in doc.ai) {
    patches.push({ path: ['ai', 'purpose'], value: undefined });
  }
  patches.push({ path: ['ai', 'interpretation'], value: migratedDoc.ai.interpretation });
  patches.push({ path: ['ai', 'editingRules'], value: migratedDoc.ai.editingRules });
  return { ok: true, patches };
}

// Generator aliases
export const generateUpdateMetadataPatches = applyUpdateMetadata;
export const generateMigrateDocumentPatches = applyMigrateDocument;
