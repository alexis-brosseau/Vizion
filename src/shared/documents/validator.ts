import { parseTree, printParseErrorCode, type ParseError } from 'jsonc-parser';
import { getEndpointShape, getUmlNodeKind } from '../registry/uml-registry';
import type {
  UmlDocument,
  ValidationIssue,
  VizionDocument,
  VizionDocumentKind
} from './types';

export interface ParseAndValidateResult<T extends VizionDocument = VizionDocument> {
  ok: boolean;
  document?: T;
  issues: ValidationIssue[];
  hasUnsupportedConstructs?: boolean;
}

const FORBIDDEN_VERSION_KEYS = [
  'version',
  'schemaVersion',
  'formatVersion',
  'instructionsVersion',
  'revision',
  'migrationVersion'
];

const VALID_RELATION_KINDS = new Set([
  'association',
  'dependency',
  'generalization',
  'realization',
  'aggregation',
  'composition'
]);
const VALID_SHAPE_GEOMETRIES = new Set([
  'ellipse',
  'rectangle',
  'rhombus',
  'trapezoid',
  'parallelogram'
]);

function offsetToLineColumn(text: string, offset: number): { line: number; column: number } {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let lastLineStart = 0;
  for (let i = 0; i < clamped; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastLineStart = i + 1;
    }
  }
  return { line, column: clamped - lastLineStart + 1 };
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function isFiniteCoordinate(val: unknown): val is number {
  return typeof val === 'number' && Number.isFinite(val) && Math.abs(val) <= 100000;
}

/**
 * Validates embedded AI guidance per Section 4.3.
 */
function validateAiGuidance(ai: unknown, issues: ValidationIssue[]): void {
  if (!isPlainObject(ai)) {
    issues.push({
      path: 'ai',
      message: 'Missing or invalid "ai" guidance object (must include purpose, interpretation, and editingRules).',
      severity: 'error'
    });
    return;
  }

  for (const key of FORBIDDEN_VERSION_KEYS) {
    if (key in ai) {
      issues.push({
        path: `ai.${key}`,
        message: `Forbidden version field "${key}" in AI guidance. Vizion documents are unversioned.`,
        severity: 'error'
      });
    }
  }

  if (typeof ai.purpose !== 'string' || ai.purpose.trim().length === 0) {
    issues.push({
      path: 'ai.purpose',
      message: 'ai.purpose must be a non-empty string.',
      severity: 'error'
    });
  }

  if (
    !Array.isArray(ai.interpretation) ||
    !ai.interpretation.every((item) => typeof item === 'string')
  ) {
    issues.push({
      path: 'ai.interpretation',
      message: 'ai.interpretation must be an array of strings.',
      severity: 'error'
    });
  }

  if (
    !Array.isArray(ai.editingRules) ||
    !ai.editingRules.every((item) => typeof item === 'string')
  ) {
    issues.push({
      path: 'ai.editingRules',
      message: 'ai.editingRules must be an array of strings.',
      severity: 'error'
    });
  }
}

function validateUmlDocument(
  raw: Record<string, unknown>,
  issues: ValidationIssue[]
): { hasUnsupportedConstructs: boolean } {
  let hasUnsupportedConstructs = false;

  if (typeof raw.title !== 'string' || raw.title.trim().length === 0) {
    issues.push({
      path: 'title',
      message: 'Document "title" must be a non-empty string.',
      severity: 'error'
    });
  }

  validateAiGuidance(raw.ai, issues);

  if (!Array.isArray(raw.nodes)) {
    issues.push({
      path: 'nodes',
      message: '"nodes" must be an array.',
      severity: 'error'
    });
  }

  if (!Array.isArray(raw.edges)) {
    issues.push({
      path: 'edges',
      message: '"edges" must be an array.',
      severity: 'error'
    });
  }

  if (!isPlainObject(raw.layout)) {
    issues.push({
      path: 'layout',
      message: '"layout" must be an object containing "nodes" and "edges" maps.',
      severity: 'error'
    });
  } else {
    if (!isPlainObject(raw.layout.nodes)) {
      issues.push({
        path: 'layout.nodes',
        message: '"layout.nodes" must be an object keyed by node ID.',
        severity: 'error'
      });
    }
    if (!isPlainObject(raw.layout.edges)) {
      issues.push({
        path: 'layout.edges',
        message: '"layout.edges" must be an object keyed by edge ID.',
        severity: 'error'
      });
    }
  }

  const nodeIds = new Set<string>();
  if (Array.isArray(raw.nodes)) {
    if (raw.nodes.length > 1000) {
      issues.push({
        path: 'nodes',
        message: 'Document exceeds maximum supported node count (1000).',
        severity: 'error'
      });
    }

    raw.nodes.forEach((node, idx) => {
      const path = `nodes[${idx}]`;
      if (!isPlainObject(node)) {
        issues.push({ path, message: 'Node entry must be an object.', severity: 'error' });
        return;
      }
      if (typeof node.id !== 'string' || node.id.trim().length === 0) {
        issues.push({
          path: `${path}.id`,
          message: 'Node "id" must be a non-empty string.',
          severity: 'error'
        });
      } else if (nodeIds.has(node.id)) {
        issues.push({
          path: `${path}.id`,
          message: `Duplicate node ID "${node.id}".`,
          severity: 'error'
        });
      } else {
        nodeIds.add(node.id);
      }

      if (typeof node.kind !== 'string' || node.kind.trim().length === 0) {
        issues.push({
          path: `${path}.kind`,
          message: 'Node "kind" must be a non-empty string.',
          severity: 'error'
        });
      } else if (!getUmlNodeKind(node.kind)) {
        hasUnsupportedConstructs = true;
        issues.push({
          path: `${path}.kind`,
          message: `Unsupported node kind "${node.kind}". Shown in non-destructive fallback mode.`,
          severity: 'warning'
        });
      }

      if (typeof node.name !== 'string') {
        issues.push({
          path: `${path}.name`,
          message: 'Node "name" must be a string.',
          severity: 'error'
        });
      }

      if (node.shape !== undefined) {
        if (typeof node.shape !== 'string' || !VALID_SHAPE_GEOMETRIES.has(node.shape)) {
          issues.push({
            path: `${path}.shape`,
            message: `Node "shape" must be one of: ${Array.from(VALID_SHAPE_GEOMETRIES).join(', ')}.`,
            severity: 'error'
          });
        }
      }

      if (node.attributes !== undefined) {
        if (!Array.isArray(node.attributes)) {
          issues.push({
            path: `${path}.attributes`,
            message: 'Node "attributes" must be an array when present.',
            severity: 'error'
          });
        } else {
          const attrIds = new Set<string>();
          node.attributes.forEach((attr, aIdx) => {
            if (!isPlainObject(attr) || typeof attr.id !== 'string' || typeof attr.name !== 'string') {
              issues.push({
                path: `${path}.attributes[${aIdx}]`,
                message: 'Attribute must have string "id" and "name".',
                severity: 'error'
              });
            } else if (attrIds.has(attr.id)) {
              issues.push({
                path: `${path}.attributes[${aIdx}].id`,
                message: `Duplicate attribute ID "${attr.id}" on node "${node.id}".`,
                severity: 'error'
              });
            } else {
              attrIds.add(attr.id);
            }
          });
        }
      }

      if (node.operations !== undefined) {
        if (!Array.isArray(node.operations)) {
          issues.push({
            path: `${path}.operations`,
            message: 'Node "operations" must be an array when present.',
            severity: 'error'
          });
        } else {
          const opIds = new Set<string>();
          node.operations.forEach((op, oIdx) => {
            if (!isPlainObject(op) || typeof op.id !== 'string' || typeof op.name !== 'string') {
              issues.push({
                path: `${path}.operations[${oIdx}]`,
                message: 'Operation must have string "id" and "name".',
                severity: 'error'
              });
            } else if (opIds.has(op.id)) {
              issues.push({
                path: `${path}.operations[${oIdx}].id`,
                message: `Duplicate operation ID "${op.id}" on node "${node.id}".`,
                severity: 'error'
              });
            } else {
              opIds.add(op.id);
            }
          });
        }
      }
    });
  }

  const edgeIds = new Set<string>();
  if (Array.isArray(raw.edges)) {
    if (raw.edges.length > 2000) {
      issues.push({
        path: 'edges',
        message: 'Document exceeds maximum supported edge count (2000).',
        severity: 'error'
      });
    }

    raw.edges.forEach((edge, idx) => {
      const path = `edges[${idx}]`;
      if (!isPlainObject(edge)) {
        issues.push({ path, message: 'Edge entry must be an object.', severity: 'error' });
        return;
      }

      if (typeof edge.id !== 'string' || edge.id.trim().length === 0) {
        issues.push({
          path: `${path}.id`,
          message: 'Edge "id" must be a non-empty string.',
          severity: 'error'
        });
      } else if (edgeIds.has(edge.id)) {
        issues.push({
          path: `${path}.id`,
          message: `Duplicate edge ID "${edge.id}".`,
          severity: 'error'
        });
      } else {
        edgeIds.add(edge.id);
      }

      if (typeof edge.kind !== 'string' || !VALID_RELATION_KINDS.has(edge.kind)) {
        issues.push({
          path: `${path}.kind`,
          message: `Edge "kind" must be one of: ${Array.from(VALID_RELATION_KINDS).join(', ')}.`,
          severity: 'error'
        });
      }

      if (!isPlainObject(edge.source) || typeof edge.source.nodeId !== 'string') {
        issues.push({
          path: `${path}.source.nodeId`,
          message: 'Edge "source.nodeId" must be a string.',
          severity: 'error'
        });
      } else if (!nodeIds.has(edge.source.nodeId)) {
        issues.push({
          path: `${path}.source.nodeId`,
          message: `Node "${edge.source.nodeId}" does not exist.`,
          severity: 'error'
        });
      }

      if (!isPlainObject(edge.target) || typeof edge.target.nodeId !== 'string') {
        issues.push({
          path: `${path}.target.nodeId`,
          message: 'Edge "target.nodeId" must be a string.',
          severity: 'error'
        });
      } else if (!nodeIds.has(edge.target.nodeId)) {
        issues.push({
          path: `${path}.target.nodeId`,
          message: `Node "${edge.target.nodeId}" does not exist.`,
          severity: 'error'
        });
      }

      if (edge.visual !== undefined) {
        if (!isPlainObject(edge.visual)) {
          issues.push({
            path: `${path}.visual`,
            message: 'Edge "visual" must be an object when present.',
            severity: 'error'
          });
        } else {
          for (const endKey of ['start', 'end'] as const) {
            const dec = edge.visual[endKey];
            if (dec !== undefined) {
              if (!isPlainObject(dec) || typeof dec.shape !== 'string') {
                issues.push({
                  path: `${path}.visual.${endKey}`,
                  message: `Endpoint "${endKey}" must be an object with a string "shape".`,
                  severity: 'error'
                });
              } else {
                const shapeDesc = getEndpointShape(dec.shape);
                if (!shapeDesc) {
                  hasUnsupportedConstructs = true;
                  issues.push({
                    path: `${path}.visual.${endKey}.shape`,
                    message: `Unknown endpoint shape "${dec.shape}". Rendering fallback marker.`,
                    severity: 'warning'
                  });
                }
                if (
                  dec.fill !== undefined &&
                  dec.fill !== 'hollow' &&
                  dec.fill !== 'filled'
                ) {
                  issues.push({
                    path: `${path}.visual.${endKey}.fill`,
                    message: 'Endpoint fill must be "hollow" or "filled".',
                    severity: 'error'
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  if (isPlainObject(raw.layout) && isPlainObject(raw.layout.nodes)) {
    for (const [nodeId, box] of Object.entries(raw.layout.nodes)) {
      const path = `layout.nodes.${nodeId}`;
      if (!nodeIds.has(nodeId)) {
        issues.push({
          path,
          message: `Layout entry references non-existent node "${nodeId}".`,
          severity: 'error'
        });
        continue;
      }
      if (
        !isPlainObject(box) ||
        !isFiniteCoordinate(box.x) ||
        !isFiniteCoordinate(box.y) ||
        !isFiniteCoordinate(box.width) ||
        !isFiniteCoordinate(box.height) ||
        box.width < 20 ||
        box.height < 20
      ) {
        issues.push({
          path,
          message: `Layout for node "${nodeId}" must have finite x, y and width/height >= 20.`,
          severity: 'error'
        });
      }
    }
  }

  return { hasUnsupportedConstructs };
}

/**
 * Parses and validates a raw JSON string against the expected Vizion document kind ('uml').
 */
export function parseAndValidateDocument(
  text: string,
  expectedKind: VizionDocumentKind = 'uml'
): ParseAndValidateResult<UmlDocument> {
  const issues: ValidationIssue[] = [];
  const parseErrors: ParseError[] = [];

  const withoutBom = text.replace(/^\uFEFF/, '');
  if (withoutBom.trim().length === 0) {
    issues.push({
      path: '$',
      message: 'Document is empty.',
      line: 1,
      column: 1,
      severity: 'error'
    });
    return { ok: false, issues };
  }

  // Strictly parse JSON (disallow trailing commas and comments since .viz files are strict JSON)
  parseTree(withoutBom, parseErrors, {
    allowTrailingComma: false,
    disallowComments: true
  });

  if (parseErrors.length > 0) {
    const first = parseErrors[0];
    const pos = offsetToLineColumn(withoutBom, first.offset);
    issues.push({
      path: '$',
      message: `Invalid JSON syntax (${printParseErrorCode(first.error)}) at line ${pos.line}, column ${pos.column}.`,
      line: pos.line,
      column: pos.column,
      severity: 'error'
    });
    return { ok: false, issues };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(withoutBom);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
    issues.push({
      path: '$',
      message: msg,
      line: 1,
      column: 1,
      severity: 'error'
    });
    return { ok: false, issues };
  }

  if (!isPlainObject(parsed)) {
    issues.push({
      path: '$',
      message: 'Document root must be a JSON object.',
      line: 1,
      column: 1,
      severity: 'error'
    });
    return { ok: false, issues };
  }

  // Reject forbidden version fields anywhere on root
  for (const key of FORBIDDEN_VERSION_KEYS) {
    if (key in parsed) {
      issues.push({
        path: key,
        message: `Forbidden version property "${key}". Vizion documents must not contain version or migration fields.`,
        severity: 'error'
      });
    }
  }

  if (parsed.format !== 'vizion') {
    issues.push({
      path: 'format',
      message: `Expected "format": "vizion", found ${JSON.stringify(parsed.format)}.`,
      severity: 'error'
    });
  }

  if (parsed.kind !== expectedKind) {
    issues.push({
      path: 'kind',
      message: `Filename expects kind "${expectedKind}", but document specifies kind ${JSON.stringify(parsed.kind)}. Open as Text to inspect or rename the file.`,
      severity: 'error'
    });
    return { ok: false, issues };
  }

  const { hasUnsupportedConstructs } = validateUmlDocument(parsed, issues);

  const hasError = issues.some((i) => i.severity === 'error');
  return {
    ok: !hasError,
    document: !hasError ? (parsed as unknown as UmlDocument) : undefined,
    issues,
    hasUnsupportedConstructs
  };
}
