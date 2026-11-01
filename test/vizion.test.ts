import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createDefaultUmlDocument,
  deriveDefaultTitle,
  isEmptyOrWhitespaceDocument,
  serializeDefaultDocument
} from '../src/shared/documents/templates';
import { parseAndValidateDocument } from '../src/shared/documents/validator';
import {
  computeUmlEdgeGeometry,
  normalizeDragRect,
  screenToWorld,
  simplifyStrokePoints,
  worldToScreen
} from '../src/shared/geometry';
import {
  applyUmlOperationToText,
  buildOperationSignature,
  extractOperationParameters,
  formatVisibilitySign
} from '../src/shared/operations';
import {
  getEndpointShape,
  listEndpointShapes,
  registerEndpointShape,
  registerUmlNodeKind,
  UML_SHAPE_GEOMETRIES
} from '../src/shared/registry/uml-registry';

describe('Vizion Document Templates & Initialization Predicates', () => {
  it('generates unversioned default UML documents with embedded AI guidance', () => {
    const uml = createDefaultUmlDocument('Domain');
    expect(uml.format).toBe('vizion');
    expect(uml.kind).toBe('uml');
    expect(uml.ai.purpose).toBeTruthy();
    expect(uml.ai.interpretation.length).toBeGreaterThan(0);
    expect(uml.ai.editingRules.length).toBeGreaterThan(0);
    expect('version' in uml).toBe(false);
    expect('schemaVersion' in uml).toBe(false);
  });

  it('derives clean titles from .viz filenames', () => {
    expect(deriveDefaultTitle('/workspace/.vizion/order-domain.viz', 'uml')).toBe(
      'Order Domain'
    );
    expect(deriveDefaultTitle('.viz', 'uml')).toBe('Domain');
    expect(deriveDefaultTitle('/workspace/.vizion/order-domain.uml.viz', 'uml')).toBe(
      'Order Domain'
    );
  });

  it('distinguishes empty/whitespace-only documents from {}, [], null, or strings (Section 5.1)', () => {
    expect(isEmptyOrWhitespaceDocument('')).toBe(true);
    expect(isEmptyOrWhitespaceDocument('   \n\t  ')).toBe(true);
    expect(isEmptyOrWhitespaceDocument('\uFEFF   \n')).toBe(true);
    expect(isEmptyOrWhitespaceDocument('{}')).toBe(false);
    expect(isEmptyOrWhitespaceDocument('[]')).toBe(false);
    expect(isEmptyOrWhitespaceDocument('null')).toBe(false);
    expect(isEmptyOrWhitespaceDocument('"hello"')).toBe(false);
  });
});

describe('Vizion Schema & Cross-Reference Validator', () => {
  it('validates newly serialized default UML documents and demo .vizion architecture files', () => {
    const umlJson = serializeDefaultDocument('uml', 'domain.viz');
    const umlRes = parseAndValidateDocument(umlJson, 'uml');
    expect(umlRes.ok).toBe(true);
    expect(umlRes.issues).toHaveLength(0);

    const archDir = path.resolve(__dirname, '../.vizion/architecture');
    if (fs.existsSync(archDir)) {
      const demoFiles = fs.readdirSync(archDir).filter((f) => f.endsWith('.viz'));
      expect(demoFiles.length).toBeGreaterThan(0);
      for (const file of demoFiles) {
        const content = fs.readFileSync(path.resolve(archDir, file), 'utf8');
        const res = parseAndValidateDocument(content, 'uml');
        expect(res.ok).toBe(true);
      }
    }

    const vizionDir = path.resolve(__dirname, '../.vizion');
    if (fs.existsSync(vizionDir)) {
      const demoFiles = fs.readdirSync(vizionDir).filter((f) => f.endsWith('.viz'));
      expect(demoFiles.length).toBeGreaterThan(0);
      for (const file of demoFiles) {
        const content = fs.readFileSync(path.resolve(vizionDir, file), 'utf8');
        const res = parseAndValidateDocument(content, 'uml');
        expect(res.ok).toBe(true);
      }
    }
  });

  it('rejects documents containing forbidden version fields (Section 3.2)', () => {
    const doc = {
      ...createDefaultUmlDocument('Domain'),
      schemaVersion: 1
    };
    const res = parseAndValidateDocument(JSON.stringify(doc), 'uml');
    expect(res.ok).toBe(false);
    expect(res.issues.some((i) => i.path === 'schemaVersion')).toBe(true);
  });

  it('reports line and column for invalid JSON syntax without overwriting', () => {
    const broken = '{\n  "format": "vizion",\n  "kind": "uml",\n  invalid_token\n}';
    const res = parseAndValidateDocument(broken, 'uml');
    expect(res.ok).toBe(false);
    expect(res.issues[0].line).toBe(4);
  });

  it('rejects broken edge node references (Section 5.4)', () => {
    const uml = createDefaultUmlDocument('Domain');
    uml.edges.push({
      id: 'edge-1',
      kind: 'association',
      source: { nodeId: 'missing-source' },
      target: { nodeId: 'missing-target' }
    });
    const brokenRef = parseAndValidateDocument(JSON.stringify(uml), 'uml');
    expect(brokenRef.ok).toBe(false);
    expect(brokenRef.issues.some((i) => i.path === 'edges[0].source.nodeId')).toBe(true);
    expect(brokenRef.issues.some((i) => i.path === 'edges[0].target.nodeId')).toBe(true);
  });
});

describe('UML Operations, Shape Nodes, Operation Parameters, and Multiplicities', () => {
  it('updates document metadata and purpose via uml.updateMetadata', () => {
    const text = serializeDefaultDocument('uml', 'domain.viz');
    const updated = applyUmlOperationToText(text, {
      type: 'uml.updateMetadata',
      title: 'Order Processing System',
      purpose: 'Model payment processing workflows and inventory reserves.'
    });
    expect(updated.ok).toBe(true);
    const parsed = parseAndValidateDocument(updated.updatedText!, 'uml');
    expect(parsed.ok).toBe(true);
    expect(parsed.document?.title).toBe('Order Processing System');
    expect(parsed.document?.ai.purpose).toBe('Model payment processing workflows and inventory reserves.');
    expect(parsed.document?.ai.interpretation.length).toBeGreaterThan(0);
    expect(parsed.document?.ai.editingRules.length).toBeGreaterThan(0);
  });

  it('preserves unknown top-level and nested properties and 4-space indentation across edits (DOC-05)', () => {
    const customDoc = {
      ...createDefaultUmlDocument('CustomDomain'),
      customRootMetadata: { owner: 'architecture-team', tags: ['core'] }
    };
    const formattedFourSpaces = JSON.stringify(customDoc, null, 4) + '\n';

    const addCustomer = applyUmlOperationToText(formattedFourSpaces, {
      type: 'uml.addNode',
      id: 'customer',
      kind: 'class',
      name: 'Customer',
      x: 100,
      y: 120
    });
    expect(addCustomer.ok).toBe(true);
    expect(addCustomer.updatedText).toContain('"customRootMetadata"');
    expect(addCustomer.updatedText).toContain('"architecture-team"');

    const addOrder = applyUmlOperationToText(addCustomer.updatedText!, {
      type: 'uml.addNode',
      id: 'order',
      kind: 'class',
      name: 'Order',
      x: 420,
      y: 120
    });
    expect(addOrder.ok).toBe(true);

    // Add relation and independently customize start/end shapes and multiplicities
    const addEdge = applyUmlOperationToText(addOrder.updatedText!, {
      type: 'uml.addEdge',
      id: 'edge-order-customer',
      kind: 'association',
      sourceNodeId: 'order',
      targetNodeId: 'customer',
      label: 'belongs to'
    });
    expect(addEdge.ok).toBe(true);

    const withMult = applyUmlOperationToText(addEdge.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-order-customer',
      sourceMultiplicity: '1..*',
      targetMultiplicity: '1'
    });
    expect(withMult.ok).toBe(true);

    const custStart = applyUmlOperationToText(withMult.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-order-customer',
      end: 'start',
      decoration: { shape: 'circle', fill: 'hollow', size: 10 }
    });
    expect(custStart.ok).toBe(true);

    const custEnd = applyUmlOperationToText(custStart.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-order-customer',
      end: 'end',
      decoration: { shape: 'diamond', fill: 'filled', size: 12 }
    });
    expect(custEnd.ok).toBe(true);

    const parsed = parseAndValidateDocument(custEnd.updatedText!, 'uml');
    expect(parsed.ok).toBe(true);
    const edge = parsed.document!.edges[0];
    expect(edge.kind).toBe('association');
    expect(edge.source.multiplicity).toBe('1..*');
    expect(edge.target.multiplicity).toBe('1');
    expect(edge.visual?.start).toEqual({ shape: 'circle', fill: 'hollow', size: 10 });
    expect(edge.visual?.end).toEqual({ shape: 'diamond', fill: 'filled', size: 12 });
  });

  it('supports Shape nodes (ellipse, rectangle, rhombus, trapezoid, parallelogram) and operation parameters', () => {
    expect(UML_SHAPE_GEOMETRIES.map((g) => g.kind)).toEqual([
      'ellipse',
      'rectangle',
      'rhombus',
      'trapezoid',
      'parallelogram'
    ]);

    let text = serializeDefaultDocument('uml', 'shapes.viz');
    const addRhombus = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'decision-1',
      kind: 'shape',
      shape: 'rhombus',
      name: 'Is Valid?',
      x: 120,
      y: 100
    });
    expect(addRhombus.ok).toBe(true);

    const changeShape = applyUmlOperationToText(addRhombus.updatedText!, {
      type: 'uml.updateNode',
      nodeId: 'decision-1',
      shape: 'parallelogram'
    });
    expect(changeShape.ok).toBe(true);
    const doc = parseAndValidateDocument(changeShape.updatedText!, 'uml').document!;
    expect(doc.nodes[0].kind).toBe('shape');
    expect(doc.nodes[0].shape).toBe('parallelogram');
    expect(doc.nodes[0].attributes).toBeUndefined();

    // Verify operation parameter extraction and signature building
    const params = extractOperationParameters({
      id: 'op-1',
      name: 'placeOrder',
      signature: '(items: LineItem[], discount: number)'
    });
    expect(params).toHaveLength(2);
    expect(params[0]).toMatchObject({ name: 'items', type: 'LineItem[]' });
    expect(params[1]).toMatchObject({ name: 'discount', type: 'number' });
    expect(buildOperationSignature(params)).toBe('(items: LineItem[], discount: number)');
    expect(formatVisibilitySign('+')).toBe('＋');
    expect(formatVisibilitySign('-')).toBe('－');
    expect(formatVisibilitySign('#')).toBe('#');
    expect(formatVisibilitySign('~')).toBe('~');
  });

  it('supports section visibility toggles and relation direction switching (B -> A)', () => {
    let text = serializeDefaultDocument('uml', 'services.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'service-a',
      kind: 'class',
      name: 'ServiceA',
      x: 80,
      y: 80
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'service-b',
      kind: 'class',
      name: 'ServiceB',
      x: 420,
      y: 80
    }).updatedText!;

    // Toggle Attributes / Operations visibility on ServiceA
    text = applyUmlOperationToText(text, {
      type: 'uml.updateNode',
      nodeId: 'service-a',
      showAttributes: false,
      showOperations: true
    }).updatedText!;

    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-ab',
      kind: 'dependency',
      sourceNodeId: 'service-a',
      targetNodeId: 'service-b'
    }).updatedText!;

    let doc = parseAndValidateDocument(text, 'uml').document!;
    expect(doc.nodes[0].showAttributes).toBe(false);
    expect(doc.nodes[0].showOperations).toBe(true);
    expect(doc.edges[0].source.nodeId).toBe('service-a');
    expect(doc.edges[0].target.nodeId).toBe('service-b');

    // Switch relation direction (A -> B becomes B -> A)
    const reversed = applyUmlOperationToText(text, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      reverseDirection: true
    });
    expect(reversed.ok).toBe(true);
    doc = parseAndValidateDocument(reversed.updatedText!, 'uml').document!;
    expect(doc.edges[0].source.nodeId).toBe('service-b');
    expect(doc.edges[0].target.nodeId).toBe('service-a');
  });

  it('defaults relations connected to a Note to dashed', () => {
    let text = serializeDefaultDocument('uml', 'notes.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'class-1',
      kind: 'class',
      name: 'Order',
      x: 100,
      y: 100
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'class-2',
      kind: 'class',
      name: 'Customer',
      x: 400,
      y: 100
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'note-1',
      kind: 'note',
      name: 'Order Note',
      x: 100,
      y: 300
    }).updatedText!;

    // Non-note to non-note association defaults to solid
    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-class-class',
      kind: 'association',
      sourceNodeId: 'class-1',
      targetNodeId: 'class-2'
    }).updatedText!;

    // Note to class association defaults to dashed
    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-note-class',
      kind: 'association',
      sourceNodeId: 'note-1',
      targetNodeId: 'class-1'
    }).updatedText!;

    // Class to note association defaults to dashed
    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-class-note',
      kind: 'association',
      sourceNodeId: 'class-2',
      targetNodeId: 'note-1'
    }).updatedText!;

    const doc = parseAndValidateDocument(text, 'uml').document!;
    const edgeClassClass = doc.edges.find((e) => e.id === 'edge-class-class');
    const edgeNoteClass = doc.edges.find((e) => e.id === 'edge-note-class');
    const edgeClassNote = doc.edges.find((e) => e.id === 'edge-class-note');

    expect(edgeClassClass?.visual?.line).toBe('solid');
    expect(edgeNoteClass?.visual?.line).toBe('dashed');
    expect(edgeClassNote?.visual?.line).toBe('dashed');
  });

  it('allows setting node name, stereotype, relation label, and multiplicity to blank and saves cleanly', () => {
    let text = serializeDefaultDocument('uml', 'blank-test.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'node-1',
      kind: 'class',
      name: 'InitialName',
      x: 100,
      y: 100
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'node-2',
      kind: 'class',
      name: 'TargetNode',
      x: 350,
      y: 100
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-1',
      kind: 'association',
      sourceNodeId: 'node-1',
      targetNodeId: 'node-2',
      label: 'initialLabel'
    }).updatedText!;

    // Set initial stereotype & multiplicity
    text = applyUmlOperationToText(text, {
      type: 'uml.updateNode',
      nodeId: 'node-1',
      stereotype: 'service'
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.updateEdge',
      edgeId: 'edge-1',
      sourceMultiplicity: '1..*'
    }).updatedText!;

    let doc = parseAndValidateDocument(text, 'uml').document!;
    expect(doc.nodes[0].name).toBe('InitialName');
    expect(doc.nodes[0].stereotype).toBe('service');
    expect(doc.edges[0].label).toBe('initialLabel');
    expect(doc.edges[0].source.multiplicity).toBe('1..*');

    // Blank out name, stereotype, label, and multiplicity
    text = applyUmlOperationToText(text, {
      type: 'uml.updateNode',
      nodeId: 'node-1',
      name: '',
      stereotype: ''
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.updateEdge',
      edgeId: 'edge-1',
      label: '',
      sourceMultiplicity: ''
    }).updatedText!;

    const validated = parseAndValidateDocument(text, 'uml');
    expect(validated.ok).toBe(true);
    doc = validated.document!;
    expect(doc.nodes[0].name).toBe('');
    expect(doc.nodes[0].stereotype).toBeUndefined();
    expect(doc.edges[0].label).toBeUndefined();
    expect(doc.edges[0].source.multiplicity).toBeUndefined();
  });

  it('automatically removes incident edges when deleting a node and remaps IDs on duplicate (Section 9.3)', () => {
    let text = serializeDefaultDocument('uml', 'domain.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'a',
      kind: 'class',
      name: 'NodeA',
      x: 50,
      y: 50
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'b',
      kind: 'class',
      name: 'NodeB',
      x: 350,
      y: 50
    }).updatedText!;
    text = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-ab',
      kind: 'dependency',
      sourceNodeId: 'a',
      targetNodeId: 'b'
    }).updatedText!;

    // Duplicate both nodes and verify cloned edge connects the cloned nodes
    const dupRes = applyUmlOperationToText(text, {
      type: 'uml.duplicateSelection',
      nodeIds: ['a', 'b'],
      edgeIds: ['edge-ab']
    });
    expect(dupRes.ok).toBe(true);
    const dupDoc = parseAndValidateDocument(dupRes.updatedText!, 'uml').document!;
    expect(dupDoc.nodes).toHaveLength(4);
    expect(dupDoc.edges).toHaveLength(2);
    const clonedEdge = dupDoc.edges.find((e) => e.id !== 'edge-ab')!;
    expect(clonedEdge.source.nodeId).toBe('a-copy');
    expect(clonedEdge.target.nodeId).toBe('b-copy');

    // Delete original node 'a' and verify 'edge-ab' is cleaned up atomically while cloned edge remains valid
    const delRes = applyUmlOperationToText(dupRes.updatedText!, {
      type: 'uml.deleteEntities',
      nodeIds: ['a'],
      edgeIds: []
    });
    expect(delRes.ok).toBe(true);
    const afterDel = parseAndValidateDocument(delRes.updatedText!, 'uml').document!;
    expect(afterDel.edges).toHaveLength(1);
    expect(afterDel.edges[0].id).toBe(clonedEdge.id);
  });

  it('proves registry extensibility without changing persistence or gesture code (UML-05)', () => {
    registerEndpointShape({
      kind: 'chevrons',
      label: 'Double Chevron',
      description: 'Custom registered test endpoint shape',
      supportsFill: false,
      defaultSize: 12,
      trimMultiplier: 0.5,
      buildLocalPath: (s) => `M -${s} -4 L 0 0 L -${s} 4`
    });
    registerUmlNodeKind({
      kind: 'component',
      label: 'Component',
      description: 'Custom registered UML component',
      defaultWidth: 200,
      defaultHeight: 120,
      hasCompartments: true,
      defaultStereotype: 'component'
    });

    expect(getEndpointShape('chevrons')?.label).toBe('Double Chevron');
    expect(listEndpointShapes().some((s) => s.kind === 'chevrons')).toBe(true);

    const text = serializeDefaultDocument('uml', 'ext.viz');
    const addComp = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'comp-1',
      kind: 'component',
      name: 'AuthService',
      x: 100,
      y: 100
    });
    expect(addComp.ok).toBe(true);
  });

  it('computes reversible viewport transforms, normalized drag rectangles, and trimmed edge paths', () => {
    const vp = { panX: 50, panY: -30, zoom: 1.5 };
    const world = screenToWorld(200, 120, vp);
    const screen = worldToScreen(world.x, world.y, vp);
    expect(screen.x).toBeCloseTo(200, 1);
    expect(screen.y).toBeCloseTo(120, 1);

    const norm = normalizeDragRect({ x: 100, y: 200 }, { x: 40, y: 80 });
    expect(norm).toEqual({ x: 40, y: 80, width: 60, height: 120 });

    const simplified = simplifyStrokePoints(
      [
        [0, 0],
        [10, 0.1],
        [20, -0.1],
        [30, 0],
        [30, 40]
      ],
      1.0
    );
    expect(simplified[0]).toEqual([0, 0]);
    expect(simplified[simplified.length - 1]).toEqual([30, 40]);
    expect(simplified.length).toBeLessThan(5);

    const geom = computeUmlEdgeGeometry(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 300, y: 0, width: 100, height: 100 },
      'straight',
      { shape: 'diamond', fill: 'hollow', size: 12 },
      { shape: 'triangle', fill: 'hollow', size: 12 }
    );
    expect(geom.startTip.x).toBe(100);
    expect(geom.endTip.x).toBe(300);
    // Path must be trimmed inward from both hollow endpoints (112 to 288)
    expect(geom.pathD).toBe('M 112 50 L 288 50');
  });
});
