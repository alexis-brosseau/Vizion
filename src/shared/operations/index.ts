import { computeMinimalJsonEdits, type JsonMutationPatch, type TextSpanEdit } from '../documents/json-patch';
import { parseAndValidateDocument } from '../documents/validator';
import {
  getEndpointShape,
  getUmlNodeKind,
  getUmlRelationPreset
} from '../registry/uml-registry';
import type {
  EndpointDecoration,
  UmlAttribute,
  UmlDocument,
  UmlEdge,
  UmlLineStyle,
  UmlNode,
  UmlNodeLayout,
  UmlOperation,
  UmlParameter,
  UmlRelationKind,
  UmlRoutingKind,
  UmlShapeGeometry,
  UmlVisibility
} from '../documents/types';

// ============================================================================
// Visibility & Operation Argument Helpers
// ============================================================================

/**
 * Formats UML visibility symbols using fullwidth plus (`＋`) and fullwidth hyphen-minus (`-`).
 */
export function formatVisibilitySign(vis?: UmlVisibility): string {
  switch (vis ?? '+') {
    case '+':
      return '＋';
    case '-':
      return '-';
    case '#':
      return '#';
    case '~':
      return '~';
  }
}

/**
 * Extracts structured `UmlParameter[]` from an operation, falling back to parsing `op.signature`
 * (e.g. `"(items: LineItem[], discount: number)"`) when `op.parameters` is not yet populated.
 */
export function extractOperationParameters(op: UmlOperation): UmlParameter[] {
  if (Array.isArray(op.parameters)) {
    return op.parameters;
  }
  const sig = (op.signature ?? '').trim();
  const inner = sig.replace(/^\(/, '').replace(/\)$/, '').trim();
  if (!inner) {
    return [];
  }
  return inner
    .split(',')
    .map((part, idx) => {
      const trimmed = part.trim();
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) {
        return {
          id: `${op.id}-param-${idx + 1}`,
          name: trimmed,
          type: ''
        };
      }
      return {
        id: `${op.id}-param-${idx + 1}`,
        name: trimmed.slice(0, colonIdx).trim(),
        type: trimmed.slice(colonIdx + 1).trim()
      };
    })
    .filter((p) => p.name.length > 0);
}

/**
 * Builds the canonical UML operation signature string `(name: type, ...)` from a parameter array.
 */
export function buildOperationSignature(params: UmlParameter[]): string {
  const formatted = params
    .filter((p) => p.name.trim().length > 0)
    .map((p) => (p.type && p.type.trim().length > 0 ? `${p.name.trim()}: ${p.type.trim()}` : p.name.trim()));
  return `(${formatted.join(', ')})`;
}

// ============================================================================
// Semantic Operation Payloads
// ============================================================================

export type UmlOperationPayload =
  | {
      type: 'uml.updateMetadata';
      title?: string;
      purpose?: string;
    }
  | {
      type: 'uml.addNode';
      id: string;
      kind: string;
      name: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
      text?: string;
      shape?: UmlShapeGeometry;
    }
  | {
      type: 'uml.updateNode';
      nodeId: string;
      name?: string;
      stereotype?: string;
      text?: string;
      shape?: UmlShapeGeometry;
      showAttributes?: boolean;
      showOperations?: boolean;
      attributes?: UmlAttribute[];
      operations?: UmlOperation[];
    }
  | {
      type: 'uml.moveResizeNodes';
      updates: Record<string, UmlNodeLayout>;
    }
  | {
      type: 'uml.deleteEntities';
      nodeIds: string[];
      edgeIds: string[];
    }
  | {
      type: 'uml.duplicateSelection';
      nodeIds: string[];
      edgeIds: string[];
      offsetX?: number;
      offsetY?: number;
      stripCustomData?: boolean;
    }
  | {
      type: 'uml.addEdge';
      id: string;
      kind: UmlRelationKind;
      sourceNodeId: string;
      targetNodeId: string;
      label?: string;
    }
  | {
      type: 'uml.updateEdge';
      edgeId: string;
      kind?: UmlRelationKind;
      label?: string;
      sourceNodeId?: string;
      targetNodeId?: string;
      sourceMultiplicity?: string;
      targetMultiplicity?: string;
      reverseDirection?: boolean;
      line?: UmlLineStyle;
      routing?: UmlRoutingKind;
    }
  | {
      type: 'uml.updateEndpoint';
      edgeId: string;
      end: 'start' | 'end';
      decoration: EndpointDecoration;
    };

export type VizionOperationPayload = UmlOperationPayload;

export interface ApplyOperationOutput {
  ok: boolean;
  error?: string;
  updatedText?: string;
  edits?: TextSpanEdit[];
  createdIds?: string[];
}

function generateCloneId(baseId: string, existingIds: Set<string>): string {
  const cleanBase = baseId.replace(/-copy(-\d+)?$/, '');
  let candidate = `${cleanBase}-copy`;
  let counter = 2;
  while (existingIds.has(candidate)) {
    candidate = `${cleanBase}-copy-${counter}`;
    counter++;
  }
  existingIds.add(candidate);
  return candidate;
}

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

  const doc: UmlDocument = parsed.document;
  const patches: JsonMutationPatch[] = [];
  const createdIds: string[] = [];

  switch (op.type) {
    case 'uml.updateMetadata': {
      if (op.title !== undefined && op.title.trim().length > 0) {
        patches.push({ path: ['title'], value: op.title.trim() });
      }
      if (op.purpose !== undefined) {
        patches.push({ path: ['ai', 'purpose'], value: op.purpose.trim() });
      }
      break;
    }

    case 'uml.addNode': {
      if (doc.nodes.some((n) => n.id === op.id)) {
        return { ok: false, error: `Node ID "${op.id}" already exists.` };
      }
      const descriptor = getUmlNodeKind(op.kind);
      const width = Math.max(60, Math.round(op.width ?? descriptor?.defaultWidth ?? 210));
      const height = Math.max(45, Math.round(op.height ?? descriptor?.defaultHeight ?? 140));

      const newNode: UmlNode = {
        id: op.id,
        kind: op.kind,
        name: op.name.trim() || 'NewEntity'
      };

      if (descriptor?.defaultStereotype) {
        newNode.stereotype = descriptor.defaultStereotype;
      }

      if (op.kind === 'note') {
        newNode.text = op.text ?? 'Design note...';
      } else if (op.kind === 'shape') {
        newNode.shape = op.shape ?? 'rectangle';
      } else if (descriptor?.hasCompartments !== false) {
        newNode.attributes = [
          {
            id: `${op.id}-attr-1`,
            visibility: '+',
            name: 'id',
            type: 'string'
          }
        ];
        newNode.operations = [
          {
            id: `${op.id}-op-1`,
            visibility: '+',
            name: 'validate',
            signature: '()',
            returnType: 'boolean',
            parameters: []
          }
        ];
      }

      const layoutBox: UmlNodeLayout = {
        x: Math.round(op.x),
        y: Math.round(op.y),
        width,
        height
      };

      patches.push({
        path: ['nodes', doc.nodes.length],
        value: newNode,
        isArrayInsertion: true
      });
      patches.push({
        path: ['layout', 'nodes', op.id],
        value: layoutBox
      });
      createdIds.push(op.id);
      break;
    }

    case 'uml.updateNode': {
      const idx = doc.nodes.findIndex((n) => n.id === op.nodeId);
      if (idx === -1) {
        return { ok: false, error: `Node "${op.nodeId}" not found.` };
      }
      const existingNode = doc.nodes[idx];
      if (!getUmlNodeKind(existingNode.kind)) {
        return {
          ok: false,
          error: `Node "${op.nodeId}" has unsupported kind "${existingNode.kind}" and is read-only.`
        };
      }

      if (op.name !== undefined) {
        patches.push({ path: ['nodes', idx, 'name'], value: op.name.trim() });
      }
      if (op.stereotype !== undefined) {
        patches.push({
          path: ['nodes', idx, 'stereotype'],
          value: op.stereotype.trim() || undefined
        });
      }
      if (op.text !== undefined) {
        patches.push({ path: ['nodes', idx, 'text'], value: op.text });
      }
      if (op.shape !== undefined) {
        patches.push({ path: ['nodes', idx, 'shape'], value: op.shape });
      }
      if (op.showAttributes !== undefined) {
        patches.push({ path: ['nodes', idx, 'showAttributes'], value: op.showAttributes });
      }
      if (op.showOperations !== undefined) {
        patches.push({ path: ['nodes', idx, 'showOperations'], value: op.showOperations });
      }
      if (op.attributes !== undefined) {
        patches.push({ path: ['nodes', idx, 'attributes'], value: op.attributes });
      }
      if (op.operations !== undefined) {
        patches.push({ path: ['nodes', idx, 'operations'], value: op.operations });
      }
      break;
    }

    case 'uml.moveResizeNodes': {
      for (const [nodeId, box] of Object.entries(op.updates)) {
        if (!doc.nodes.some((n) => n.id === nodeId)) {
          return { ok: false, error: `Cannot move non-existent node "${nodeId}".` };
        }
        const existingLayout = doc.layout.nodes[nodeId] ?? {};
        patches.push({
          path: ['layout', 'nodes', nodeId],
          value: {
            ...existingLayout,
            x: Math.round(box.x),
            y: Math.round(box.y),
            width: Math.max(60, Math.round(box.width)),
            height: Math.max(40, Math.round(box.height))
          }
        });
      }
      break;
    }

    case 'uml.deleteEntities': {
      const delNodes = new Set(op.nodeIds);
      const delEdges = new Set(op.edgeIds);

      // Automatically include incident relations when deleting a node (Section 9.3)
      for (const edge of doc.edges) {
        if (delNodes.has(edge.source.nodeId) || delNodes.has(edge.target.nodeId)) {
          delEdges.add(edge.id);
        }
      }

      if (delNodes.size > 0) {
        const remainingNodes = doc.nodes.filter((n) => !delNodes.has(n.id));
        patches.push({ path: ['nodes'], value: remainingNodes });
        for (const nodeId of delNodes) {
          if (nodeId in doc.layout.nodes) {
            patches.push({ path: ['layout', 'nodes', nodeId], value: undefined });
          }
        }
      }

      if (delEdges.size > 0) {
        const remainingEdges = doc.edges.filter((e) => !delEdges.has(e.id));
        patches.push({ path: ['edges'], value: remainingEdges });
        for (const edgeId of delEdges) {
          if (edgeId in doc.layout.edges) {
            patches.push({ path: ['layout', 'edges', edgeId], value: undefined });
          }
        }
      }
      break;
    }

    case 'uml.duplicateSelection': {
      const selectedNodeSet = new Set(op.nodeIds);
      const existingNodeIds = new Set(doc.nodes.map((n) => n.id));
      const existingEdgeIds = new Set(doc.edges.map((e) => e.id));
      const nodeIdMap = new Map<string, string>();

      const offsetX = op.offsetX ?? 40;
      const offsetY = op.offsetY ?? 40;
      const stripCustom = Boolean(op.stripCustomData);

      const clonedNodes: UmlNode[] = [];
      for (const node of doc.nodes) {
        if (!selectedNodeSet.has(node.id)) continue;
        const newId = generateCloneId(node.id, existingNodeIds);
        nodeIdMap.set(node.id, newId);
        createdIds.push(newId);

        const descriptor = getUmlNodeKind(node.kind);

        if (stripCustom) {
          const nextNum = doc.nodes.length + clonedNodes.length + 1;
          const freshNameMap: Record<string, string> = {
            class: `Class${nextNum}`,
            note: `Note ${nextNum}`,
            shape: `Shape ${nextNum}`
          };
          const freshId = `${node.kind}-${Date.now().toString(36).slice(-4)}-${clonedNodes.length + 1}`;
          existingNodeIds.delete(newId);
          existingNodeIds.add(freshId);
          nodeIdMap.set(node.id, freshId);
          createdIds[createdIds.length - 1] = freshId;

          const defaultNode: UmlNode = {
            id: freshId,
            kind: node.kind,
            name: freshNameMap[node.kind] ?? `Entity${nextNum}`
          };
          if (descriptor?.defaultStereotype) {
            defaultNode.stereotype = descriptor.defaultStereotype;
          }
          if (node.kind === 'note') {
            defaultNode.text = 'Design note...';
          } else if (node.kind === 'shape') {
            defaultNode.shape = node.shape ?? 'rectangle';
          } else if (descriptor?.hasCompartments !== false) {
            defaultNode.attributes = [
              {
                id: `${freshId}-attr-1`,
                visibility: '+',
                name: 'id',
                type: 'string'
              }
            ];
            defaultNode.operations = [
              {
                id: `${freshId}-op-1`,
                visibility: '+',
                name: 'validate',
                signature: '()',
                returnType: 'boolean',
                parameters: []
              }
            ];
          }
          clonedNodes.push(defaultNode);
        } else {
          const attrCopy = node.attributes?.map((attr, idx) => ({
            ...attr,
            id: `${newId}-attr-${idx + 1}`
          }));
          const opCopy = node.operations?.map((method, idx) => ({
            ...method,
            id: `${newId}-op-${idx + 1}`,
            ...(method.parameters
              ? {
                  parameters: method.parameters.map((p, pIdx) => ({
                    ...p,
                    id: `${newId}-op-${idx + 1}-param-${pIdx + 1}`
                  }))
                }
              : {})
          }));

          const clonedNode: UmlNode = {
            ...node,
            id: newId,
            name: `${node.name}Copy`
          };
          if (attrCopy) clonedNode.attributes = attrCopy;
          if (opCopy) clonedNode.operations = opCopy;
          clonedNodes.push(clonedNode);
        }

        const origLayout = doc.layout.nodes[node.id] ?? {
          x: 80,
          y: 80,
          width: descriptor?.defaultWidth ?? 220,
          height: descriptor?.defaultHeight ?? 140
        };
        const targetCloneId = nodeIdMap.get(node.id) ?? newId;
        patches.push({
          path: ['layout', 'nodes', targetCloneId],
          value: {
            x: Math.round((origLayout.x + offsetX) / 20) * 20,
            y: Math.round((origLayout.y + offsetY) / 20) * 20,
            width: stripCustom
              ? (descriptor?.defaultWidth ?? 210)
              : origLayout.width,
            height: stripCustom
              ? (descriptor?.defaultHeight ?? 140)
              : origLayout.height
          }
        });
      }

      if (clonedNodes.length > 0) {
        patches.push({
          path: ['nodes'],
          value: [...doc.nodes, ...clonedNodes]
        });
      }

      // Duplicate edges whose endpoints are either both in the duplicated node set (remapped to new node IDs)
      // or explicitly selected when no nodes were duplicated
      const selectedEdgeSet = new Set(op.edgeIds);
      const clonedEdges: UmlEdge[] = [];
      for (const edge of doc.edges) {
        const bothEndsCloned =
          nodeIdMap.has(edge.source.nodeId) && nodeIdMap.has(edge.target.nodeId);
        const explicitlySelected = selectedEdgeSet.has(edge.id);

        if (!bothEndsCloned && !explicitlySelected) continue;
        // If nodes were duplicated, only duplicate edges connecting the duplicated subset
        if (clonedNodes.length > 0 && !bothEndsCloned) continue;

        const newEdgeId = generateCloneId(edge.id, existingEdgeIds);
        createdIds.push(newEdgeId);
        const preset = getUmlRelationPreset(edge.kind);
        clonedEdges.push({
          ...(stripCustom ? {} : edge),
          id: newEdgeId,
          kind: edge.kind,
          source: {
            ...(stripCustom ? {} : edge.source),
            nodeId: nodeIdMap.get(edge.source.nodeId) ?? edge.source.nodeId
          },
          target: {
            ...(stripCustom ? {} : edge.target),
            nodeId: nodeIdMap.get(edge.target.nodeId) ?? edge.target.nodeId
          },
          ...(stripCustom
            ? {
                visual: {
                  line: preset?.line ?? 'solid',
                  routing: preset?.routing ?? 'bezier',
                  start: { ...(preset?.start ?? { shape: 'none', size: 10 }) },
                  end: { ...(preset?.end ?? { shape: 'none', size: 10 }) }
                }
              }
            : {})
        });
      }

      if (clonedEdges.length > 0) {
        patches.push({
          path: ['edges'],
          value: [...doc.edges, ...clonedEdges]
        });
      }
      break;
    }

    case 'uml.addEdge': {
      if (doc.edges.some((e) => e.id === op.id)) {
        return { ok: false, error: `Edge ID "${op.id}" already exists.` };
      }
      if (!doc.nodes.some((n) => n.id === op.sourceNodeId)) {
        return { ok: false, error: `Source node "${op.sourceNodeId}" does not exist.` };
      }
      if (!doc.nodes.some((n) => n.id === op.targetNodeId)) {
        return { ok: false, error: `Target node "${op.targetNodeId}" does not exist.` };
      }

      const preset = getUmlRelationPreset(op.kind);
      const newEdge: UmlEdge = {
        id: op.id,
        kind: op.kind,
        source: {
          nodeId: op.sourceNodeId
        },
        target: {
          nodeId: op.targetNodeId
        },
        ...(op.label ? { label: op.label } : {}),
        visual: {
          line: preset?.line ?? 'solid',
          routing: preset?.routing ?? 'bezier',
          start: { ...(preset?.start ?? { shape: 'none', size: 10 }) },
          end: { ...(preset?.end ?? { shape: 'none', size: 10 }) }
        }
      };

      patches.push({
        path: ['edges', doc.edges.length],
        value: newEdge,
        isArrayInsertion: true
      });
      createdIds.push(op.id);
      break;
    }

    case 'uml.updateEdge': {
      const idx = doc.edges.findIndex((e) => e.id === op.edgeId);
      if (idx === -1) {
        return { ok: false, error: `Edge "${op.edgeId}" not found.` };
      }
      const existing = doc.edges[idx];

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
        if (!doc.nodes.some((n) => n.id === op.sourceNodeId)) {
          return { ok: false, error: `Node "${op.sourceNodeId}" does not exist.` };
        }
        patches.push({
          path: ['edges', idx, 'source', 'nodeId'],
          value: op.sourceNodeId
        });
      }
      if (op.targetNodeId !== undefined) {
        if (!doc.nodes.some((n) => n.id === op.targetNodeId)) {
          return { ok: false, error: `Node "${op.targetNodeId}" does not exist.` };
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
      }
      if (op.line !== undefined) {
        patches.push({
          path: ['edges', idx, 'visual', 'line'],
          value: op.line
        });
      }
      if (op.routing !== undefined) {
        patches.push({
          path: ['edges', idx, 'visual', 'routing'],
          value: op.routing
        });
      }
      break;
    }

    case 'uml.updateEndpoint': {
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

      // Ensure `visual` object exists before patching nested endpoint
      if (!doc.edges[idx].visual) {
        const preset = getUmlRelationPreset(doc.edges[idx].kind);
        patches.push({
          path: ['edges', idx, 'visual'],
          value: {
            line: preset?.line ?? 'solid',
            routing: preset?.routing ?? 'bezier',
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
      break;
    }
  }

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
