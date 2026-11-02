import type { JsonMutationPatch } from '../documents/json-patch';
import type { UmlDocument, UmlEdge, UmlNode, UmlNodeLayout } from '../documents/types';
import { getUmlNodeKind, getUmlRelationPreset } from '../registry/uml-registry';
import type {
  OperationMutationResult,
  UmlAddNodePayload,
  UmlDeleteEntitiesPayload,
  UmlDuplicateSelectionPayload,
  UmlMoveResizeNodesPayload,
  UmlUpdateNodePayload
} from './types';

/**
 * Generates an incremental clone ID ensuring uniqueness across existing IDs.
 */
export function generateCloneId(baseId: string, existingIds: Set<string>): string {
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
 * Pure JSON mutation generator for adding a new UML node.
 */
export function applyAddNode(doc: UmlDocument, op: UmlAddNodePayload): OperationMutationResult {
  if (doc.nodes.some((n) => n.id === op.id)) {
    return { ok: false, error: `Node ID "${op.id}" already exists.` };
  }
  const descriptor = getUmlNodeKind(op.kind);
  const width = Math.max(60, Math.round(op.width ?? descriptor?.defaultWidth ?? 240));
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
  } else if (op.kind === 'frame') {
    newNode.children = op.children ?? [];
  } else if (descriptor?.hasCompartments !== false) {
    newNode.attributes = [
      {
        id: `${op.id}-attr-1`,
        visibility: '+',
        name: 'id',
        type: 'string'
      }
    ];
    newNode.operations = [];
  }

  const layoutBox: UmlNodeLayout = {
    x: Math.round(op.x),
    y: Math.round(op.y),
    width,
    height
  };

  const patches: JsonMutationPatch[] = [
    {
      path: ['nodes', doc.nodes.length],
      value: newNode,
      isArrayInsertion: true
    },
    {
      path: ['layout', 'nodes', op.id],
      value: layoutBox
    }
  ];

  return { ok: true, patches, createdIds: [op.id] };
}

/**
 * Pure JSON mutation generator for updating node properties.
 */
export function applyUpdateNode(doc: UmlDocument, op: UmlUpdateNodePayload): OperationMutationResult {
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

  const patches: JsonMutationPatch[] = [];

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
  if (op.children !== undefined) {
    patches.push({ path: ['nodes', idx, 'children'], value: op.children });
  }
  if (op.line !== undefined) {
    patches.push({ path: ['nodes', idx, 'line'], value: op.line === 'solid' ? undefined : op.line });
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

  return { ok: true, patches };
}

/**
 * Pure JSON mutation generator for batch node layout and frame containment updates.
 */
export function applyMoveResizeNodes(doc: UmlDocument, op: UmlMoveResizeNodesPayload): OperationMutationResult {
  const patches: JsonMutationPatch[] = [];
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
  if (op.frameChildrenUpdates) {
    for (const [frameId, children] of Object.entries(op.frameChildrenUpdates)) {
      const idx = doc.nodes.findIndex((n) => n.id === frameId);
      if (idx !== -1) {
        patches.push({
          path: ['nodes', idx, 'children'],
          value: children
        });
      }
    }
  }
  return { ok: true, patches };
}

/**
 * Pure JSON mutation generator for deleting nodes and relations (with incident edge cascading).
 */
export function applyDeleteEntities(doc: UmlDocument, op: UmlDeleteEntitiesPayload): OperationMutationResult {
  const patches: JsonMutationPatch[] = [];
  const delNodes = new Set(op.nodeIds);
  const delEdges = new Set(op.edgeIds);

  // Automatically include incident relations when deleting a node (Section 9.3)
  for (const edge of doc.edges) {
    if (delNodes.has(edge.source.nodeId) || delNodes.has(edge.target.nodeId)) {
      delEdges.add(edge.id);
    }
  }

  if (delNodes.size > 0) {
    const remainingNodes = doc.nodes
      .filter((n) => !delNodes.has(n.id))
      .map((n) => {
        if (n.kind === 'frame' && n.children) {
          const cleanedChildren = n.children.filter((cid) => !delNodes.has(cid));
          if (cleanedChildren.length !== n.children.length) {
            return { ...n, children: cleanedChildren };
          }
        }
        return n;
      });
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

  return { ok: true, patches };
}

/**
 * Pure JSON mutation generator for duplicating nodes and connecting edges.
 */
export function applyDuplicateSelection(doc: UmlDocument, op: UmlDuplicateSelectionPayload): OperationMutationResult {
  const patches: JsonMutationPatch[] = [];
  const createdIds: string[] = [];

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
        shape: `Shape ${nextNum}`,
        frame: `Frame ${nextNum}`
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
      if (node.children) {
        clonedNode.children = node.children
          .map((cid) => nodeIdMap.get(cid))
          .filter((cid): cid is string => Boolean(cid));
      }
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
        width: origLayout.width,
        height: origLayout.height
      }
    });
  }

  if (clonedNodes.length > 0) {
    patches.push({
      path: ['nodes'],
      value: [...doc.nodes, ...clonedNodes]
    });
  }

  const selectedEdgeSet = new Set(op.edgeIds);
  const clonedEdges: UmlEdge[] = [];
  for (const edge of doc.edges) {
    const bothEndsCloned =
      nodeIdMap.has(edge.source.nodeId) && nodeIdMap.has(edge.target.nodeId);
    const explicitlySelected = selectedEdgeSet.has(edge.id);

    if (!bothEndsCloned && !explicitlySelected) continue;
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
              routing: preset?.routing ?? 'default',
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

  return { ok: true, patches, createdIds };
}

// Generator aliases
export const generateAddNodePatches = applyAddNode;
export const generateUpdateNodePatches = applyUpdateNode;
export const generateMoveResizeNodesPatches = applyMoveResizeNodes;
export const generateDeleteEntitiesPatches = applyDeleteEntities;
export const generateDuplicateSelectionPatches = applyDuplicateSelection;
