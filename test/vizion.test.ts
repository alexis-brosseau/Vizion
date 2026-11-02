import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createDefaultUmlDocument,
  deriveDefaultTitle,
  isEmptyOrWhitespaceDocument,
  serializeDefaultDocument
} from '../src/shared/documents/templates';
import { EXTENSION_VERSION } from '../src/shared/documents/version';
import { isMigrationNeeded, isNewerVersionDocument, compareSemver, runDocumentMigrations } from '../src/shared/documents/migrations';
import { parseAndValidateDocument } from '../src/shared/documents/validator';
import {
  computeShapeBoundaryIntersection,
  computeUmlEdgeGeometry,
  getMultiplicityLabelPoint,
  normalizeDragRect,
  rectContainsRect,
  screenToWorld,
  simplifyStrokePoints,
  worldToScreen
} from '../src/shared/geometry';
import {
  applyUmlOperationToText,
  buildOperationSignature,
  extractOperationParameters,
  formatAttributesToText,
  formatOperationsToText,
  formatVisibilitySign,
  parseAttributesFromText,
  parseOperationsFromText
} from '../src/shared/operations';
import {
  getEndpointShape,
  listEndpointShapes,
  listUmlRelationPresets,
  registerEndpointShape,
  registerUmlNodeKind,
  UML_SHAPE_GEOMETRIES
} from '../src/shared/registry/uml-registry';

describe('Vizion Document Templates & Initialization Predicates', () => {
  it('generates default UML documents with version property matching extension version after format', () => {
    const uml = createDefaultUmlDocument('Domain');
    expect(uml.format).toBe('vizion');
    expect(uml.version).toBe(EXTENSION_VERSION);
    expect(uml.kind).toBe('uml');
    const keys = Object.keys(uml);
    expect(keys.indexOf('format')).toBe(0);
    expect(keys.indexOf('version')).toBe(1);
    expect(keys.indexOf('title')).toBe(3);
    expect(keys.indexOf('description')).toBe(4);
    expect(keys.indexOf('ai')).toBe(5);
    expect(keys.indexOf('defaultRouting')).toBe(6);
    expect(uml.description).toBeTruthy();
    expect(uml.ai.interpretation.length).toBeGreaterThan(0);
    expect(uml.ai.editingRules.length).toBeGreaterThan(0);
    expect(uml.ai.editingRules.some((rule) => rule.includes('10 grid cells'))).toBe(true);
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
        if (!res.ok) console.log('Validation issues in', file, res.issues);
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

  it('does not show error if version is missing or different (version is not validated)', () => {
    const withoutVersion = {
      format: 'vizion',
      kind: 'uml',
      title: 'No Version',
      ai: { purpose: 'p', interpretation: ['i'], editingRules: ['r'] },
      nodes: [],
      edges: [],
      layout: { nodes: {}, edges: {} }
    };
    const resNoVer = parseAndValidateDocument(JSON.stringify(withoutVersion), 'uml');
    expect(resNoVer.ok).toBe(true);
    expect(resNoVer.issues).toHaveLength(0);

    const mismatchVersion = {
      ...createDefaultUmlDocument('Domain'),
      version: '99.99.99'
    };
    const resMismatch = parseAndValidateDocument(JSON.stringify(mismatchVersion), 'uml');
    expect(resMismatch.ok).toBe(true);
    expect(resMismatch.issues).toHaveLength(0);
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
      description: 'Model payment processing workflows and inventory reserves.'
    });
    expect(updated.ok).toBe(true);
    const parsed = parseAndValidateDocument(updated.updatedText!, 'uml');
    expect(parsed.ok).toBe(true);
    expect(parsed.document?.title).toBe('Order Processing System');
    expect(parsed.document?.description).toBe('Model payment processing workflows and inventory reserves.');
    expect(parsed.document?.ai.interpretation.length).toBeGreaterThan(0);
    expect(parsed.document?.ai.editingRules.length).toBeGreaterThan(0);

    const updatedWithRouting = applyUmlOperationToText(updated.updatedText!, {
      type: 'uml.updateMetadata',
      defaultRouting: 'bezier'
    });
    expect(updatedWithRouting.ok).toBe(true);
    const parsedWithRouting = parseAndValidateDocument(updatedWithRouting.updatedText!, 'uml');
    expect(parsedWithRouting.ok).toBe(true);
    expect(parsedWithRouting.document?.defaultRouting).toBe('bezier');
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
    expect(edge.kind).toBe('other');
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

    const marquee = { x: 0, y: 0, width: 100, height: 100 };
    expect(rectContainsRect(marquee, { x: 10, y: 10, width: 50, height: 50 })).toBe(true);
    expect(rectContainsRect(marquee, { x: 0, y: 0, width: 100, height: 100 })).toBe(true);
    expect(rectContainsRect(marquee, { x: 60, y: 60, width: 50, height: 50 })).toBe(false);
    expect(rectContainsRect(marquee, { x: -1, y: 10, width: 20, height: 20 })).toBe(false);

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
    // Relation label is centered vertically and horizontally on the line (not hovering above)
    expect(geom.labelPoint).toEqual({ x: 200, y: 50 });

    // Test orthogonal routing with right-angle turns
    const orthoGeom = computeUmlEdgeGeometry(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 300, y: 100, width: 100, height: 100 },
      'orthogonal',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 }
    );
    expect(orthoGeom.startTip).toEqual({ x: 100, y: 60 });
    expect(orthoGeom.endTip).toEqual({ x: 300, y: 160 });
    // Grid-snapped orthogonal route: (100, 60) -> (200, 60) -> (200, 160) -> (300, 160)
    expect(orthoGeom.pathD).toBe('M 100 60 L 200 60 L 200 160 L 300 160');
    expect(orthoGeom.hitPathD).toBe('M 100 60 L 200 60 L 200 160 L 300 160');
    // Relation label sits on the middle segment (vertical, length 100 >= 28)
    expect(orthoGeom.labelPoint).toEqual({ x: 200, y: 110 });

    // When middle segment is too short to fit label height (e.g. length = 20 < 28), falls back to longest segment
    const tightOrthoGeom = computeUmlEdgeGeometry(
      { x: 0, y: 10, width: 100, height: 100 },
      { x: 300, y: 30, width: 100, height: 100 },
      'orthogonal',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 }
    );
    // Vertical middle segment has length 20 (from 60 to 80), too short -> sits on first segment
    expect(tightOrthoGeom.labelPoint).toEqual({ x: 150, y: 60 });

    // Test bezier (smooth) routing
    const bezierGeom = computeUmlEdgeGeometry(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 300, y: 0, width: 100, height: 100 },
      'bezier',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 }
    );
    expect(bezierGeom.labelPoint.y).toBeCloseTo(50, 1);

    // Test shape boundary intersection for geometric shapes (ellipse, rhombus)
    const box = { x: 0, y: 0, width: 100, height: 100 };
    // Rhombus corners act like flat borders with cardinal normals
    const rightCornerHit = computeShapeBoundaryIntersection(box, { x: 200, y: 50 }, 'rhombus');
    expect(rightCornerHit.point).toEqual({ x: 98, y: 50 });
    expect(rightCornerHit.normal).toEqual({ x: 1, y: 0 });

    const leftCornerHit = computeShapeBoundaryIntersection(box, { x: -100, y: 50 }, 'rhombus');
    expect(leftCornerHit.point).toEqual({ x: 2, y: 50 });
    expect(leftCornerHit.normal).toEqual({ x: -1, y: 0 });

    const topCornerHit = computeShapeBoundaryIntersection(box, { x: 50, y: -100 }, 'rhombus');
    expect(topCornerHit.point).toEqual({ x: 50, y: 2 });
    expect(topCornerHit.normal).toEqual({ x: 0, y: -1 });

    const bottomCornerHit = computeShapeBoundaryIntersection(box, { x: 50, y: 200 }, 'rhombus');
    expect(bottomCornerHit.point).toEqual({ x: 50, y: 98 });
    expect(bottomCornerHit.normal).toEqual({ x: 0, y: 1 });

    // Smooth routing goes straight to a rhombus corner when aligned
    const smoothRhombusGeom = computeUmlEdgeGeometry(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 300, y: 0, width: 100, height: 100 },
      'bezier',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 },
      0,
      undefined,
      undefined,
      'rectangle',
      'rhombus'
    );
    expect(smoothRhombusGeom.startTip).toEqual({ x: 100, y: 50 });
    expect(smoothRhombusGeom.endTip).toEqual({ x: 302, y: 50 });
    // Path control points stay on y = 50 because rhombus left corner acts like a flat border (normal -1, 0)
    expect(smoothRhombusGeom.pathD).toMatch(/^M 100 50 C \d+(\.\d+)? 50, \d+(\.\d+)? 50, 302 50$/);
    // Rhombus top-right diagonal intersection (toward 200, 200)
    const rhombusHit = computeShapeBoundaryIntersection(box, { x: 200, y: 200 }, 'rhombus');
    // Bounding box corner would be (100, 100), but rhombus diamond edge is at (73.5, 73.5)
    expect(rhombusHit.point.x).toBeLessThan(100);
    expect(rhombusHit.point.y).toBeLessThan(100);
    expect(Math.round(rhombusHit.point.x)).toBe(74);
    expect(Math.round(rhombusHit.point.y)).toBe(74);

    // Ellipse diagonal intersection (toward 200, 200)
    const ellipseHit = computeShapeBoundaryIntersection(box, { x: 200, y: 200 }, 'ellipse');
    expect(Math.round(ellipseHit.point.x)).toBe(84);
    expect(Math.round(ellipseHit.point.y)).toBe(84);

    // computeUmlEdgeGeometry with shapes connects directly to the shape boundary
    const shapeGeom = computeUmlEdgeGeometry(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 200, y: 200, width: 100, height: 100 },
      'straight',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 },
      0,
      undefined,
      undefined,
      'rhombus',
      'ellipse'
    );
    expect(Math.round(shapeGeom.startTip.x)).toBe(74);
    expect(Math.round(shapeGeom.startTip.y)).toBe(74);
    expect(Math.round(shapeGeom.endTip.x)).toBe(216);
    expect(Math.round(shapeGeom.endTip.y)).toBe(216);

    // Multiplicity label is at a fixed distance from its side to the line (never overlaps)
    const tip = { x: 100, y: 200 };
    const verticalAngle = 90; // line along vertical axis (x = 100)
    const shortMult = getMultiplicityLabelPoint(tip, verticalAngle, '1');
    const longMult = getMultiplicityLabelPoint(tip, verticalAngle, '0..*');
    const shortHalfW = (1 * 7.6 + 12) / 2;
    const longHalfW = (4 * 7.6 + 12) / 2;
    // Both labels' nearest side is exactly 5px away from the relation line at x = 100
    expect(shortMult.x - shortHalfW).toBeCloseTo(105, 1);
    expect(longMult.x - longHalfW).toBeCloseTo(105, 1);
  });

  it('parses and formats attributes and operations line-by-line while removing non-matching lines', () => {
    const rawAttrs = `
      + id: string
      - isSecret: boolean
      # count: number
      ~ internalTag
      plainName: any
      // this is a comment line that should be discarded
      invalid???line!
    `;
    const parsedAttrs = parseAttributesFromText(rawAttrs, 'node-1');
    expect(parsedAttrs).toHaveLength(5);
    expect(parsedAttrs[0]).toMatchObject({ visibility: '+', name: 'id', type: 'string' });
    expect(parsedAttrs[1]).toMatchObject({ visibility: '-', name: 'isSecret', type: 'boolean' });
    expect(parsedAttrs[2]).toMatchObject({ visibility: '#', name: 'count', type: 'number' });
    expect(parsedAttrs[3]).toMatchObject({ visibility: '~', name: 'internalTag' });
    expect(parsedAttrs[4]).toMatchObject({ visibility: '+', name: 'plainName', type: 'any' });

    const formattedAttrs = formatAttributesToText(parsedAttrs);
    expect(formattedAttrs).toBe(
      '+ id: string\n- isSecret: boolean\n# count: number\n~ internalTag\n+ plainName: any'
    );

    const rawOps = `
      + save(item: Item, count: number): boolean
      - reset()
      # log(msg: string)
      render(): void
      init
      -- not an operation
      /* another invalid line */
    `;
    const parsedOps = parseOperationsFromText(rawOps, 'node-1');
    expect(parsedOps).toHaveLength(5);
    expect(parsedOps[0]).toMatchObject({
      visibility: '+',
      name: 'save',
      returnType: 'boolean',
      signature: '(item: Item, count: number)'
    });
    expect(parsedOps[0].parameters).toHaveLength(2);
    expect(parsedOps[0].parameters![0]).toMatchObject({ name: 'item', type: 'Item' });
    expect(parsedOps[0].parameters![1]).toMatchObject({ name: 'count', type: 'number' });

    expect(parsedOps[1]).toMatchObject({ visibility: '-', name: 'reset', signature: '()' });
    expect(parsedOps[2]).toMatchObject({ visibility: '#', name: 'log', signature: '(msg: string)' });
    expect(parsedOps[3]).toMatchObject({ visibility: '+', name: 'render', returnType: 'void', signature: '()' });
    expect(parsedOps[4]).toMatchObject({ visibility: '+', name: 'init', signature: '()' });

    const formattedOps = formatOperationsToText(parsedOps);
    expect(formattedOps).toContain('+ save(item: Item, count: number): boolean');
    expect(formattedOps).toContain('- reset()');
    expect(formattedOps).toContain('# log(msg: string)');
    expect(formattedOps).toContain('+ render(): void');
    expect(formattedOps).toContain('+ init()');
  });

  it('keeps custom node dimensions when duplicating with stripCustomData (Paste as new)', () => {
    let text = serializeDefaultDocument('uml', 'paste-as-new.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'custom-node',
      kind: 'class',
      name: 'CustomClass',
      x: 60,
      y: 60,
      width: 380,
      height: 260
    }).updatedText!;

    // Duplicate with stripCustomData = true ("Paste as new")
    const dupRes = applyUmlOperationToText(text, {
      type: 'uml.duplicateSelection',
      nodeIds: ['custom-node'],
      edgeIds: [],
      offsetX: 40,
      offsetY: 40,
      stripCustomData: true
    });
    expect(dupRes.ok).toBe(true);

    const doc = parseAndValidateDocument(dupRes.updatedText!, 'uml').document!;
    expect(doc.nodes).toHaveLength(2);
    const pastedNode = doc.nodes.find((n) => n.id !== 'custom-node')!;
    const pastedLayout = doc.layout.nodes[pastedNode.id];

    // Must keep original resized width and height
    expect(pastedLayout).toBeDefined();
    expect(pastedLayout.width).toBe(380);
    expect(pastedLayout.height).toBe(260);
    expect(pastedLayout.x).toBe(100);
    expect(pastedLayout.y).toBe(100);
  });

  it('handles semantic relation presets, none default, automatic detection, and line style reset', () => {
    let text = serializeDefaultDocument('uml', 'relations.viz');
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'node-a',
      kind: 'class',
      name: 'ClassA',
      x: 40,
      y: 40
    }).updatedText!;

    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'node-b',
      kind: 'class',
      name: 'ClassB',
      x: 300,
      y: 40
    }).updatedText!;

    // 1. Add edge with default kind (between classes -> association)
    const addRes = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-ab',
      sourceNodeId: 'node-a',
      targetNodeId: 'node-b'
    });
    expect(addRes.ok).toBe(true);
    let doc = parseAndValidateDocument(addRes.updatedText!, 'uml').document!;
    let edge = doc.edges[0];
    expect(edge.kind).toBe('association');
    expect(edge.visual?.line).toBe('solid');
    expect(edge.visual?.routing).toBe('default');

    // Test updating edge routing explicitly and resetting to default
    const straightRes = applyUmlOperationToText(addRes.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      routing: 'straight'
    });
    expect(straightRes.ok).toBe(true);
    let straightDoc = parseAndValidateDocument(straightRes.updatedText!, 'uml').document!;
    expect(straightDoc.edges[0].visual?.routing).toBe('straight');

    const defaultRes = applyUmlOperationToText(straightRes.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      routing: 'default'
    });
    expect(defaultRes.ok).toBe(true);
    let defaultDoc = parseAndValidateDocument(defaultRes.updatedText!, 'uml').document!;
    expect(defaultDoc.edges[0].visual?.routing).toBe('default');

    // 2. Change kind to 'dependency' (dashed preset)
    const depRes = applyUmlOperationToText(addRes.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      kind: 'dependency'
    });
    expect(depRes.ok).toBe(true);
    doc = parseAndValidateDocument(depRes.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('dependency');
    expect(edge.visual?.line).toBe('dashed');

    // 3. Change kind to 'association' -> line must switch from dashed to solid
    const assocRes = applyUmlOperationToText(depRes.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      kind: 'association'
    });
    expect(assocRes.ok).toBe(true);
    doc = parseAndValidateDocument(assocRes.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('association');
    expect(edge.visual?.line).toBe('solid');

    // 4. Update endpoint to a shape not matching any preset (circle) -> kind becomes 'other'
    const circleRes = applyUmlOperationToText(assocRes.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'start',
      decoration: { shape: 'circle', size: 10 }
    });
    expect(circleRes.ok).toBe(true);
    doc = parseAndValidateDocument(circleRes.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('other');

    // 5. From 'other', reset start to 'none' and set end to 'triangle' (solid) -> automatically matches 'generalization'
    const resetStart = applyUmlOperationToText(circleRes.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'start',
      decoration: { shape: 'none', size: 10 }
    });
    const setTriangle = applyUmlOperationToText(resetStart.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'end',
      decoration: { shape: 'triangle', fill: 'hollow', size: 12 }
    });
    expect(setTriangle.ok).toBe(true);
    doc = parseAndValidateDocument(setTriangle.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('generalization');

    // 6. Change line to dashed with hollow triangle -> automatically matches 'realization'
    const dashedRes = applyUmlOperationToText(setTriangle.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      line: 'dashed'
    });
    expect(dashedRes.ok).toBe(true);
    doc = parseAndValidateDocument(dashedRes.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('realization');

    // 7. Test directional and bidirectional associations with open arrows on solid lines
    // Set line back to solid and end to open-arrow -> directional association
    const solidDirected = applyUmlOperationToText(dashedRes.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      line: 'solid'
    });
    const openArrowEnd = applyUmlOperationToText(solidDirected.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'end',
      decoration: { shape: 'open-arrow', size: 11 }
    });
    expect(openArrowEnd.ok).toBe(true);
    doc = parseAndValidateDocument(openArrowEnd.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('association');

    // Set start to open-arrow as well -> bidirectional association (both ends open-arrow)
    const openArrowBoth = applyUmlOperationToText(openArrowEnd.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'start',
      decoration: { shape: 'open-arrow', size: 11 }
    });
    expect(openArrowBoth.ok).toBe(true);
    doc = parseAndValidateDocument(openArrowBoth.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('association');

    // Set end to none -> reverse directional association
    const openArrowStartOnly = applyUmlOperationToText(openArrowBoth.updatedText!, {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-ab',
      end: 'end',
      decoration: { shape: 'none', size: 10 }
    });
    expect(openArrowStartOnly.ok).toBe(true);
    doc = parseAndValidateDocument(openArrowStartOnly.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('association');

    // Dashed line with open-arrow at end matches dependency
    const dashedDependency = applyUmlOperationToText(openArrowEnd.updatedText!, {
      type: 'uml.updateEdge',
      edgeId: 'edge-ab',
      line: 'dashed'
    });
    expect(dashedDependency.ok).toBe(true);
    doc = parseAndValidateDocument(dashedDependency.updatedText!, 'uml').document!;
    edge = doc.edges[0];
    expect(edge.kind).toBe('dependency');

    // 8. Verify relation presets list ends with 'other'
    const presets = listUmlRelationPresets();
    const lastPreset = presets[presets.length - 1];
    expect(lastPreset.kind).toBe('other');
    expect(lastPreset.label).toBe('Other');
  });

  it('supports Frame container nodes and manages contained children', () => {
    let text = serializeDefaultDocument('uml', 'test-frame');

    // Add Frame node
    const addFrameRes = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'frame-1',
      kind: 'frame',
      name: 'System Boundary',
      x: 100,
      y: 100,
      width: 260,
      height: 180
    });
    expect(addFrameRes.ok).toBe(true);
    text = addFrameRes.updatedText!;

    // Add a child class inside the frame
    const addClassRes = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'class-1',
      kind: 'class',
      name: 'AuthService',
      x: 130,
      y: 150
    });
    expect(addClassRes.ok).toBe(true);
    text = addClassRes.updatedText!;

    // Verify class has no default operations and has larger default width (240)
    const docAfterClass = JSON.parse(text);
    const classNode = docAfterClass.nodes.find((n: any) => n.id === 'class-1');
    expect(classNode.operations).toEqual([]);
    expect(docAfterClass.layout.nodes['class-1'].width).toBe(240);

    // Associate child with frame
    const updateFrameRes = applyUmlOperationToText(text, {
      type: 'uml.updateNode',
      nodeId: 'frame-1',
      children: ['class-1']
    });
    expect(updateFrameRes.ok).toBe(true);
    text = updateFrameRes.updatedText!;

    let doc = parseAndValidateDocument(text, 'uml').document!;
    const frameNode = doc.nodes.find((n) => n.id === 'frame-1');
    expect(frameNode).toBeDefined();
    expect(frameNode?.kind).toBe('frame');
    expect(frameNode?.children).toEqual(['class-1']);

    // Verify atomic moveResizeNodes updates both layouts and frame children in one operation
    const moveResizeRes = applyUmlOperationToText(text, {
      type: 'uml.moveResizeNodes',
      updates: {
        'frame-1': { x: 120, y: 120, width: 300, height: 200 }
      },
      frameChildrenUpdates: {
        'frame-1': ['class-1']
      }
    });
    expect(moveResizeRes.ok).toBe(true);
    text = moveResizeRes.updatedText!;
    doc = parseAndValidateDocument(text, 'uml').document!;
    expect(doc.layout.nodes['frame-1']).toEqual({ x: 120, y: 120, width: 300, height: 200 });
    expect(doc.nodes.find((n) => n.id === 'frame-1')?.children).toEqual(['class-1']);

    // Deleting the contained node automatically cleans it up from the frame's children
    const deleteChildRes = applyUmlOperationToText(text, {
      type: 'uml.deleteEntities',
      nodeIds: ['class-1'],
      edgeIds: []
    });
    expect(deleteChildRes.ok).toBe(true);
    doc = parseAndValidateDocument(deleteChildRes.updatedText!, 'uml').document!;
    const frameAfterDelete = doc.nodes.find((n) => n.id === 'frame-1');
    expect(frameAfterDelete?.children).toEqual([]);
  });

  it('rejects creating or updating relations that connect to a frame', () => {
    let text = serializeDefaultDocument('uml', 'test-frame-relations.viz');

    // Add a class and a frame
    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'class-a',
      kind: 'class',
      name: 'ClassA',
      x: 100,
      y: 100
    }).updatedText!;

    text = applyUmlOperationToText(text, {
      type: 'uml.addNode',
      id: 'frame-box',
      kind: 'frame',
      name: 'Subsystem',
      x: 400,
      y: 100
    }).updatedText!;

    // Attempting to add edge with frame as source
    const addSrcRes = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-bad-1',
      sourceNodeId: 'frame-box',
      targetNodeId: 'class-a'
    });
    expect(addSrcRes.ok).toBe(false);
    expect(addSrcRes.error).toBe('Frames cannot have relationships.');

    // Attempting to add edge with frame as target
    const addTgtRes = applyUmlOperationToText(text, {
      type: 'uml.addEdge',
      id: 'edge-bad-2',
      sourceNodeId: 'class-a',
      targetNodeId: 'frame-box'
    });
    expect(addTgtRes.ok).toBe(false);
    expect(addTgtRes.error).toBe('Frames cannot have relationships.');
  });

  it('detects when migration is needed and migrates legacy ai.purpose, rules, and version via uml.migrateDocument', () => {
    // Construct a legacy document with version 0.1.0 and ai.purpose
    const legacyDoc = {
      format: 'vizion',
      version: '0.1.0',
      kind: 'uml',
      title: 'Legacy Domain',
      ai: {
        purpose: 'Legacy architecture purpose description.',
        interpretation: ['Old interpretation rule.'],
        editingRules: ['Old editing rule.']
      },
      nodes: [],
      edges: [],
      layout: { nodes: {}, edges: {} }
    };

    expect(isMigrationNeeded(legacyDoc as any)).toBe(true);

    const legacyText = JSON.stringify(legacyDoc, null, 2);
    const migrateRes = applyUmlOperationToText(legacyText, {
      type: 'uml.migrateDocument'
    });
    expect(migrateRes.ok).toBe(true);

    const parsed = parseAndValidateDocument(migrateRes.updatedText!, 'uml');
    expect(parsed.ok).toBe(true);
    const migrated = parsed.document!;
    expect(migrated.version).toBe(EXTENSION_VERSION);
    expect(migrated.description).toBe('Legacy architecture purpose description.');
    expect(migrated.ai.purpose).toBeUndefined();
    expect(migrated.ai.interpretation.length).toBeGreaterThan(1);
    expect(migrated.ai.editingRules.length).toBeGreaterThan(1);

    // After migration, no migration should be needed
    expect(isMigrationNeeded(migrated)).toBe(false);
  });

  it('correctly compares semver and identifies newer version documents without prompting migration', () => {
    expect(compareSemver('0.2.0', '0.2.0')).toBe(0);
    expect(compareSemver('0.3.0', '0.2.0')).toBe(1);
    expect(compareSemver('1.0.0', '0.2.0')).toBe(1);
    expect(compareSemver('0.1.2', '0.2.0')).toBe(-1);
    expect(compareSemver('0.2.1', '0.2.0')).toBe(1);

    const futureDoc = {
      format: 'vizion',
      version: '0.4.0',
      kind: 'uml',
      title: 'Future Architecture',
      ai: {
        interpretation: [],
        editingRules: []
      },
      nodes: [],
      edges: [],
      layout: { nodes: {}, edges: {} }
    };

    // A document with a newer version than EXTENSION_VERSION should be recognized as newer
    expect(isNewerVersionDocument(futureDoc as any)).toBe(true);
    // And it should NOT be flagged for migration (which would downgrade it)
    expect(isMigrationNeeded(futureDoc as any)).toBe(false);

    // Current version is not newer
    const currentDoc = { ...futureDoc, version: EXTENSION_VERSION };
    expect(isNewerVersionDocument(currentDoc as any)).toBe(false);

    // Older version is not newer
    const olderDoc = { ...futureDoc, version: '0.1.2' };
    expect(isNewerVersionDocument(olderDoc as any)).toBe(false);
    expect(isMigrationNeeded(olderDoc as any)).toBe(true);
  });
});
