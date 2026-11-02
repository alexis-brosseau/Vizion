import type { JsonMutationPatch } from '../documents/json-patch';
import type {
  EndpointDecoration,
  UmlDocument,
  UmlEdge,
  UmlRelationKind
} from '../documents/types';
import {
  detectMatchingRelationPreset,
  getEndpointShape,
  getUmlRelationPreset
} from '../registry/uml-registry';
import type {
  OperationMutationResult,
  UmlAddEdgePayload,
  UmlUpdateEdgePayload,
  UmlUpdateEndpointPayload
} from './types';

/**
 * Resolves whether an edge's visual appearance matches a built-in semantic UML relation kind.
 * If styling does not match any semantic preset, returns 'other' (or preserves 'association'
 * for undirected, directional, or bidirectional solid associations).
 */
export function resolveMatchingRelation(
  currentKind: UmlRelationKind,
  line: string | undefined,
  start: EndpointDecoration | undefined,
  end: EndpointDecoration | undefined
): UmlRelationKind {
  const match = detectMatchingRelationPreset(line, start, end);
  if (match) {
    return match;
  }
  const isStartAssoc =
    (start?.shape ?? 'none') === 'none' || (start?.shape ?? 'none') === 'open-arrow';
  const isEndAssoc =
    (end?.shape ?? 'none') === 'none' || (end?.shape ?? 'none') === 'open-arrow';
  if (line !== 'dashed' && isStartAssoc && isEndAssoc) {
    return 'association';
  }
  return 'other';
}

/**
 * Pure JSON mutation generator for creating a new relationship edge.
 */
export function applyAddEdge(doc: UmlDocument, op: UmlAddEdgePayload): OperationMutationResult {
  if (doc.edges.some((e) => e.id === op.id)) {
    return { ok: false, error: `Edge ID "${op.id}" already exists.` };
  }
  const sourceNode = doc.nodes.find((n) => n.id === op.sourceNodeId);
  if (!sourceNode) {
    return { ok: false, error: `Source node "${op.sourceNodeId}" does not exist.` };
  }
  const targetNode = doc.nodes.find((n) => n.id === op.targetNodeId);
  if (!targetNode) {
    return { ok: false, error: `Target node "${op.targetNodeId}" does not exist.` };
  }
  if (sourceNode.kind === 'frame' || targetNode.kind === 'frame') {
    return { ok: false, error: 'Frames cannot have relationships.' };
  }

  const touchesNote = sourceNode.kind === 'note' || targetNode.kind === 'note';
  const edgeKind = op.kind ?? (touchesNote ? 'other' : 'association');
  const preset = getUmlRelationPreset(edgeKind);
  const defaultLine = touchesNote ? 'dashed' : (preset?.line ?? 'solid');

  const newEdge: UmlEdge = {
    id: op.id,
    kind: edgeKind,
    source: {
      nodeId: op.sourceNodeId
    },
    target: {
      nodeId: op.targetNodeId
    },
    ...(op.label ? { label: op.label } : {}),
    visual: {
      line: op.line ?? defaultLine,
      routing: op.routing ?? preset?.routing ?? 'default',
      start: { ...(preset?.start ?? { shape: 'none', size: 10 }) },
      end: { ...(preset?.end ?? { shape: 'none', size: 10 }) }
    }
  };

  const patches: JsonMutationPatch[] = [
    {
      path: ['edges', doc.edges.length],
      value: newEdge,
      isArrayInsertion: true
    }
  ];

  return { ok: true, patches, createdIds: [op.id] };
}

/**
 * Pure JSON mutation generator for updating relationship properties, routing, and endpoints.
 */
export function applyUpdateEdge(doc: UmlDocument, op: UmlUpdateEdgePayload): OperationMutationResult {
  const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
  if (idx === -1) {
    return { ok: false, error: `Edge "${op.edgeId}" not found.` };
  }
  const existing = doc.edges[idx];
  const patches: JsonMutationPatch[] = [];

  if (op.reverseDirection) {
    patches.push({
      path: ['edges', idx, 'source'],
      value: { ...existing.target }
    });
    patches.push({
      path: ['edges', idx, 'target'],
      value: { ...existing.source }
    });
  }

  if (op.sourceNodeId !== undefined) {
    const sNode = doc.nodes.find((n) => n.id === op.sourceNodeId);
    if (!sNode) {
      return { ok: false, error: `Node "${op.sourceNodeId}" does not exist.` };
    }
    if (sNode.kind === 'frame') {
      return { ok: false, error: 'Frames cannot have relationships.' };
    }
    patches.push({
      path: ['edges', idx, 'source', 'nodeId'],
      value: op.sourceNodeId
    });
  }
  if (op.targetNodeId !== undefined) {
    const tNode = doc.nodes.find((n) => n.id === op.targetNodeId);
    if (!tNode) {
      return { ok: false, error: `Node "${op.targetNodeId}" does not exist.` };
    }
    if (tNode.kind === 'frame') {
      return { ok: false, error: 'Frames cannot have relationships.' };
    }
    patches.push({
      path: ['edges', idx, 'target', 'nodeId'],
      value: op.targetNodeId
    });
  }
  if (op.sourceMultiplicity !== undefined) {
    patches.push({
      path: ['edges', idx, 'source', 'multiplicity'],
      value: op.sourceMultiplicity.trim() || undefined
    });
  }
  if (op.targetMultiplicity !== undefined) {
    patches.push({
      path: ['edges', idx, 'target', 'multiplicity'],
      value: op.targetMultiplicity.trim() || undefined
    });
  }
  if (op.label !== undefined) {
    patches.push({
      path: ['edges', idx, 'label'],
      value: op.label.trim() || undefined
    });
  }
  if (op.kind !== undefined) {
    patches.push({ path: ['edges', idx, 'kind'], value: op.kind });
    const preset = getUmlRelationPreset(op.kind);
    if (preset) {
      patches.push({
        path: ['edges', idx, 'visual'],
        value: {
          ...(existing.visual ?? {}),
          line: preset.line,
          routing: existing.visual?.routing ?? preset.routing,
          start: { ...preset.start },
          end: { ...preset.end }
        }
      });
    }
  } else if (op.line !== undefined) {
    patches.push({
      path: ['edges', idx, 'visual', 'line'],
      value: op.line
    });
    const nextKind = resolveMatchingRelation(
      existing.kind,
      op.line,
      existing.visual?.start,
      existing.visual?.end
    );
    if (nextKind !== existing.kind) {
      patches.push({ path: ['edges', idx, 'kind'], value: nextKind });
    }
  }
  if (op.routing !== undefined) {
    patches.push({
      path: ['edges', idx, 'visual', 'routing'],
      value: op.routing
    });
  }

  return { ok: true, patches };
}

/**
 * Pure JSON mutation generator for updating endpoint decoration shapes, sizes, and fills.
 */
export function applyUpdateEndpoint(doc: UmlDocument, op: UmlUpdateEndpointPayload): OperationMutationResult {
  const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
  if (idx === -1) {
    return { ok: false, error: `Edge "${op.edgeId}" not found.` };
  }

  const shapeDesc = getEndpointShape(op.decoration.shape);
  if (!shapeDesc) {
    return {
      ok: false,
      error: `Unknown endpoint decoration shape "${op.decoration.shape}".`
    };
  }

  const existingEnd: Partial<EndpointDecoration> = doc.edges[idx].visual?.[op.end] ?? {};
  const cleanedDecoration: EndpointDecoration = {
    ...existingEnd,
    shape: op.decoration.shape,
    size: op.decoration.size ?? existingEnd.size ?? shapeDesc.defaultSize
  };

  if (shapeDesc.supportsFill) {
    cleanedDecoration.fill =
      op.decoration.fill ?? existingEnd.fill ?? shapeDesc.defaultFill ?? 'hollow';
  } else {
    delete cleanedDecoration.fill;
  }

  const patches: JsonMutationPatch[] = [];

  // Ensure `visual` object exists before patching nested endpoint
  if (!doc.edges[idx].visual) {
    const preset = getUmlRelationPreset(doc.edges[idx].kind);
    patches.push({
      path: ['edges', idx, 'visual'],
      value: {
        line: preset?.line ?? 'solid',
        routing: preset?.routing ?? 'default',
        start: op.end === 'start' ? cleanedDecoration : { ...(preset?.start ?? { shape: 'none', size: 10 }) },
        end: op.end === 'end' ? cleanedDecoration : { ...(preset?.end ?? { shape: 'none', size: 10 }) }
      }
    });
  } else {
    patches.push({
      path: ['edges', idx, 'visual', op.end],
      value: cleanedDecoration
    });
  }

  const currentEdge = doc.edges[idx];
  const startDec = op.end === 'start' ? cleanedDecoration : currentEdge.visual?.start;
  const endDec = op.end === 'end' ? cleanedDecoration : currentEdge.visual?.end;
  const nextKind = resolveMatchingRelation(
    currentEdge.kind,
    currentEdge.visual?.line,
    startDec,
    endDec
  );
  if (nextKind !== currentEdge.kind) {
    patches.push({ path: ['edges', idx, 'kind'], value: nextKind });
  }

  return { ok: true, patches };
}

// Generator aliases
export const generateAddEdgePatches = applyAddEdge;
export const generateUpdateEdgePatches = applyUpdateEdge;
export const generateUpdateEndpointPatches = applyUpdateEndpoint;
