import type { UmlDocument } from './types';
import { EXTENSION_VERSION } from './version';
import { createDefaultUmlDocument } from './templates';

export interface MigrationStep {
  id: string;
  name: string;
  description: string;
  shouldApply: (doc: UmlDocument) => boolean;
  apply: (doc: UmlDocument) => void;
}

/**
 * Extensible registry of document migrations.
 * When the document schema, rules, or data representation changes across versions,
 * register new migration steps here.
 */
export const DOCUMENT_MIGRATIONS: MigrationStep[] = [
  {
    id: 'migrate-purpose-to-description',
    name: 'Move Purpose to Root Description',
    description: 'Moves legacy "ai.purpose" to root "description" property under title.',
    shouldApply: (doc) => {
      const ai = doc.ai as Record<string, unknown> | undefined;
      return Boolean(ai && typeof ai.purpose === 'string');
    },
    apply: (doc) => {
      const ai = doc.ai as Record<string, unknown> | undefined;
      if (ai && typeof ai.purpose === 'string') {
        if (!doc.description) {
          doc.description = ai.purpose;
        }
        delete ai.purpose;
      }
    }
  },
  {
    id: 'refresh-ai-guidance',
    name: 'Update AI Guidance Rules',
    description: 'Updates embedded interpretation and editing rules to the latest version.',
    shouldApply: (doc) => {
      const template = createDefaultUmlDocument(doc.title);
      const currentInterp = JSON.stringify(doc.ai?.interpretation ?? []);
      const templateInterp = JSON.stringify(template.ai.interpretation);
      const currentRules = JSON.stringify(doc.ai?.editingRules ?? []);
      const templateRules = JSON.stringify(template.ai.editingRules);
      return currentInterp !== templateInterp || currentRules !== templateRules;
    },
    apply: (doc) => {
      const template = createDefaultUmlDocument(doc.title);
      doc.ai.interpretation = [...template.ai.interpretation];
      doc.ai.editingRules = [...template.ai.editingRules];
    }
  },
  {
    id: 'sync-version',
    name: 'Sync Document Version',
    description: `Updates document version to current extension version (${EXTENSION_VERSION}).`,
    shouldApply: (doc) => doc.version !== EXTENSION_VERSION,
    apply: (doc) => {
      doc.version = EXTENSION_VERSION;
    }
  }
];

/**
 * Compares two semantic version strings (e.g. "0.2.0" vs "0.3.0").
 * Returns > 0 if v1 > v2, < 0 if v1 < v2, and 0 if equal.
 */
export function compareSemver(v1: string, v2: string): number {
  const parse = (v: string) => {
    const clean = v.replace(/^[v^~]/, '').split('-')[0];
    return clean.split('.').map((p) => {
      const n = parseInt(p, 10);
      return isNaN(n) ? 0 : n;
    });
  };
  const parts1 = parse(v1);
  const parts2 = parse(v2);
  const maxLen = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLen; i++) {
    const n1 = parts1[i] ?? 0;
    const n2 = parts2[i] ?? 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}

/**
 * Checks whether a document was created by a newer version than the running extension.
 */
export function isNewerVersionDocument(doc: UmlDocument | null | undefined): boolean {
  if (!doc?.version) return false;
  return compareSemver(doc.version, EXTENSION_VERSION) > 0;
}

/**
 * Checks whether a document needs migration compared to the current extension version.
 * If the document is from a newer version than the extension, it does not need migration
 * (instead, a compatibility warning is shown so the user updates their extension).
 */
export function isMigrationNeeded(doc: UmlDocument | null | undefined): boolean {
  if (!doc) return false;
  if (isNewerVersionDocument(doc)) return false;
  if (doc.version !== EXTENSION_VERSION) return true;
  return DOCUMENT_MIGRATIONS.some((step) => step.shouldApply(doc));
}

/**
 * Returns all migration steps that currently apply to this document.
 */
export function getApplicableMigrations(doc: UmlDocument): MigrationStep[] {
  return DOCUMENT_MIGRATIONS.filter((step) => step.shouldApply(doc));
}

/**
 * Runs all applicable migrations in sequence and ensures the document version is synced.
 */
export function runDocumentMigrations(doc: UmlDocument): { doc: UmlDocument; appliedSteps: string[] } {
  const cloned: UmlDocument = JSON.parse(JSON.stringify(doc));
  const appliedSteps: string[] = [];

  for (const step of DOCUMENT_MIGRATIONS) {
    if (step.shouldApply(cloned)) {
      step.apply(cloned);
      appliedSteps.push(step.id);
    }
  }

  // Ensure version is always synced to current extension version
  cloned.version = EXTENSION_VERSION;

  return { doc: cloned, appliedSteps };
}

