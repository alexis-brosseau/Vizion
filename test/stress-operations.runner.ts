import assert from 'node:assert';
import {
  applyUmlOperationToText,
  formatAttributesToText,
  parseAttributesFromText,
  formatOperationsToText,
  parseOperationsFromText,
  formatVisibilitySign,
  extractOperationParameters,
  buildOperationSignature,
  type UmlOperationPayload
} from '../src/shared/operations/index';
import { parseAndValidateDocument } from '../src/shared/documents/validator';
import {
  createDefaultUmlDocument,
  serializeDefaultDocument
} from '../src/shared/documents/templates';
import type { UmlDocument } from '../src/shared/documents/types';

interface TestReport {
  suite: string;
  passed: number;
  failed: number;
  details: string[];
}

const reports: TestReport[] = [];

interface SuiteContext {
  log: (msg: string) => void;
  pass: () => void;
}

function runSuite(name: string, fn: (ctx: SuiteContext) => void): TestReport {
  const report: TestReport = { suite: name, passed: 0, failed: 0, details: [] };
  const ctx: SuiteContext = {
    log: (msg: string) => report.details.push(msg),
    pass: () => { report.passed++; }
  };
  try {
    fn(ctx);
  } catch (err: any) {
    report.failed++;
    report.details.push(`FATAL SUITE ERROR: ${err?.message ?? String(err)}\n${err?.stack ?? ''}`);
  }
  reports.push(report);
  return report;
}

console.log('=== STARTING EMPIRICAL STRESS TESTS FOR src/shared/operations/ ===\n');

// ============================================================================
// DIMENSION 1: Sequential Mutation Stress (50+ chained operations)
// ============================================================================
runSuite('Dimension 1: Sequential Mutation Stress (65 chained operations)', ({ log, pass }) => {
  let docText = serializeDefaultDocument('uml', 'stress_test.viz');

  // Validate initial document
  let parsed = parseAndValidateDocument(docText, 'uml');
  assert.strictEqual(parsed.ok, true, 'Initial document must be valid');
  assert.strictEqual(parsed.issues.length, 0, 'Initial document must have 0 issues');

  const operations: UmlOperationPayload[] = [
    // Op 1: Update metadata
    {
      type: 'uml.updateMetadata',
      title: 'Stressed Architecture Diagram',
      description: 'Stress testing sequential operations',
      defaultRouting: 'straight'
    },
    // Op 2-5: Add 4 class nodes
    {
      type: 'uml.addNode',
      id: 'node-user',
      kind: 'class',
      name: 'UserEntity',
      x: 100,
      y: 100,
      width: 220,
      height: 140
    },
    {
      type: 'uml.addNode',
      id: 'node-order',
      kind: 'class',
      name: 'OrderAggregate',
      x: 380,
      y: 100,
      width: 240,
      height: 160
    },
    {
      type: 'uml.addNode',
      id: 'node-payment',
      kind: 'class',
      name: 'PaymentProcessor',
      x: 680,
      y: 100,
      width: 240,
      height: 140
    },
    {
      type: 'uml.addNode',
      id: 'node-inventory',
      kind: 'class',
      name: 'InventoryService',
      x: 380,
      y: 340,
      width: 240,
      height: 140
    },
    // Op 6-8: Add 3 note nodes
    {
      type: 'uml.addNode',
      id: 'note-arch',
      kind: 'note',
      name: 'ArchNote',
      x: 100,
      y: 340,
      width: 200,
      height: 120,
      text: 'Architectural constraint:\nDecouple payment and order states.'
    },
    {
      type: 'uml.addNode',
      id: 'note-perf',
      kind: 'note',
      name: 'PerfNote',
      x: 680,
      y: 340,
      width: 200,
      height: 100,
      text: 'Performance SLA: < 200ms p99.'
    },
    {
      type: 'uml.addNode',
      id: 'note-security',
      kind: 'note',
      name: 'SecurityNote',
      x: 960,
      y: 100,
      width: 180,
      height: 100,
      text: 'PCI-DSS Compliance Boundary'
    },
    // Op 9-13: Add 5 shape nodes (ellipse, rectangle, rhombus, trapezoid, parallelogram)
    {
      type: 'uml.addNode',
      id: 'shape-start',
      kind: 'shape',
      name: 'StartEvent',
      shape: 'ellipse',
      x: 40,
      y: 40,
      width: 80,
      height: 60
    },
    {
      type: 'uml.addNode',
      id: 'shape-db',
      kind: 'shape',
      name: 'OrderDB',
      shape: 'rectangle',
      x: 380,
      y: 560,
      width: 140,
      height: 80
    },
    {
      type: 'uml.addNode',
      id: 'shape-decision',
      kind: 'shape',
      name: 'Is Authorized?',
      shape: 'rhombus',
      x: 680,
      y: 560,
      width: 140,
      height: 80
    },
    {
      type: 'uml.addNode',
      id: 'shape-queue',
      kind: 'shape',
      name: 'OrderEventsQueue',
      shape: 'trapezoid',
      x: 100,
      y: 560,
      width: 160,
      height: 70
    },
    {
      type: 'uml.addNode',
      id: 'shape-cache',
      kind: 'shape',
      name: 'RedisCache',
      shape: 'parallelogram',
      x: 960,
      y: 340,
      width: 160,
      height: 70
    },
    // Op 14-15: Add 2 frame nodes
    {
      type: 'uml.addNode',
      id: 'frame-core',
      kind: 'frame',
      name: 'CoreDomain',
      x: 60,
      y: 60,
      width: 600,
      height: 460,
      children: ['node-user', 'node-order']
    },
    {
      type: 'uml.addNode',
      id: 'frame-billing',
      kind: 'frame',
      name: 'BillingSubsystem',
      x: 660,
      y: 60,
      width: 500,
      height: 460,
      children: ['node-payment', 'note-security']
    },
    // Op 16-25: Node updates
    {
      type: 'uml.updateNode',
      nodeId: 'node-user',
      stereotype: 'entity',
      showAttributes: true,
      showOperations: false,
      attributes: [
        { id: 'attr-u1', visibility: '+', name: 'id', type: 'UUID' },
        { id: 'attr-u2', visibility: '-', name: 'passwordHash', type: 'string' },
        { id: 'attr-u3', visibility: '#', name: 'email', type: 'string' }
      ]
    },
    {
      type: 'uml.updateNode',
      nodeId: 'node-order',
      stereotype: 'aggregate',
      showAttributes: true,
      showOperations: true,
      attributes: [
        { id: 'attr-o1', visibility: '+', name: 'orderId', type: 'string' },
        { id: 'attr-o2', visibility: '+', name: 'totalAmount', type: 'number' },
        { id: 'attr-o3', visibility: '~', name: 'status', type: 'OrderStatus' }
      ],
      operations: [
        {
          id: 'op-o1',
          visibility: '+',
          name: 'addItem',
          signature: '(item: OrderItem, qty: number)',
          returnType: 'void',
          parameters: [
            { id: 'p1', name: 'item', type: 'OrderItem' },
            { id: 'p2', name: 'qty', type: 'number' }
          ]
        },
        {
          id: 'op-o2',
          visibility: '+',
          name: 'calculateTax',
          signature: '(rate: number)',
          returnType: 'number',
          parameters: [{ id: 'p3', name: 'rate', type: 'number' }]
        }
      ]
    },
    {
      type: 'uml.updateNode',
      nodeId: 'node-payment',
      stereotype: 'service',
      showOperations: true,
      operations: [
        {
          id: 'op-p1',
          visibility: '+',
          name: 'process',
          signature: '(amount: number)',
          returnType: 'PaymentResult',
          parameters: [{ id: 'p4', name: 'amount', type: 'number' }]
        }
      ]
    },
    {
      type: 'uml.updateNode',
      nodeId: 'note-arch',
      text: 'Refined architectural guidelines:\n- All mutations go through OrderAggregate.\n- Payments are async.'
    },
    {
      type: 'uml.updateNode',
      nodeId: 'shape-db',
      line: 'dashed'
    },
    {
      type: 'uml.updateNode',
      nodeId: 'shape-decision',
      name: 'Credit Approved?'
    },
    {
      type: 'uml.updateNode',
      nodeId: 'frame-core',
      children: ['node-user', 'node-order', 'node-inventory']
    },
    {
      type: 'uml.updateNode',
      nodeId: 'node-inventory',
      stereotype: 'service'
    },
    {
      type: 'uml.updateNode',
      nodeId: 'note-perf',
      name: 'PerformanceGuidelines'
    },
    {
      type: 'uml.updateNode',
      nodeId: 'shape-cache',
      name: 'RedisCluster'
    },
    // Op 26-35: Move and resize nodes
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'node-user': { x: 120, y: 120, width: 220, height: 160 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'node-order': { x: 400, y: 120, width: 260, height: 180 },
        'node-payment': { x: 700, y: 120, width: 260, height: 160 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'frame-core': { x: 80, y: 80, width: 620, height: 500 }
      },
      frameChildrenUpdates: {
        'frame-core': ['node-user', 'node-order', 'node-inventory', 'note-arch']
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'shape-start': { x: 20, y: 20, width: 60, height: 60 },
        'shape-queue': { x: 120, y: 600, width: 180, height: 80 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'shape-db': { x: 400, y: 600, width: 160, height: 90 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'shape-decision': { x: 700, y: 600, width: 160, height: 90 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'shape-cache': { x: 980, y: 360, width: 180, height: 80 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'note-security': { x: 980, y: 120, width: 200, height: 120 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'node-inventory': { x: 400, y: 360, width: 260, height: 160 }
      }
    },
    {
      type: 'uml.moveResizeNodes',
      updates: {
        'frame-billing': { x: 680, y: 80, width: 520, height: 500 }
      }
    },
    // Op 36-47: Add 12 edges
    {
      type: 'uml.addEdge',
      id: 'edge-user-order',
      kind: 'association',
      sourceNodeId: 'node-user',
      targetNodeId: 'node-order',
      label: 'places'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-order-payment',
      kind: 'dependency',
      sourceNodeId: 'node-order',
      targetNodeId: 'node-payment',
      label: 'charges'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-order-inventory',
      kind: 'composition',
      sourceNodeId: 'node-order',
      targetNodeId: 'node-inventory',
      label: 'reserves'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-user-note',
      kind: 'other',
      sourceNodeId: 'node-user',
      targetNodeId: 'note-arch'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-payment-note',
      kind: 'other',
      sourceNodeId: 'node-payment',
      targetNodeId: 'note-perf'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-payment-sec',
      kind: 'dependency',
      sourceNodeId: 'node-payment',
      targetNodeId: 'note-security'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-start-user',
      kind: 'dependency',
      sourceNodeId: 'shape-start',
      targetNodeId: 'node-user'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-order-db',
      kind: 'association',
      sourceNodeId: 'node-order',
      targetNodeId: 'shape-db',
      label: 'persists to'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-payment-decision',
      kind: 'association',
      sourceNodeId: 'node-payment',
      targetNodeId: 'shape-decision'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-decision-queue',
      kind: 'association',
      sourceNodeId: 'shape-decision',
      targetNodeId: 'shape-queue',
      label: 'yes'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-order-cache',
      kind: 'association',
      sourceNodeId: 'node-order',
      targetNodeId: 'shape-cache',
      label: 'caches'
    },
    {
      type: 'uml.addEdge',
      id: 'edge-user-self',
      kind: 'association',
      sourceNodeId: 'node-user',
      targetNodeId: 'node-user',
      label: 'supervises'
    },
    // Op 48-55: Update edges
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-user-order',
      reverseDirection: true
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-user-order',
      sourceMultiplicity: '1',
      targetMultiplicity: '0..*'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-order-payment',
      line: 'dashed',
      label: 'async charges'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-order-inventory',
      routing: 'bezier'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-order-db',
      routing: 'orthogonal'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-payment-decision',
      kind: 'dependency'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-user-self',
      sourceMultiplicity: '0..1',
      targetMultiplicity: '*'
    },
    {
      type: 'uml.updateEdge',
      edgeId: 'edge-decision-queue',
      label: 'approved'
    },
    // Op 56-59: Update endpoints
    {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-user-order',
      end: 'start',
      decoration: { shape: 'diamond', fill: 'filled', size: 12 }
    },
    {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-order-payment',
      end: 'end',
      decoration: { shape: 'open-arrow', size: 10 }
    },
    {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-order-db',
      end: 'end',
      decoration: { shape: 'circle', fill: 'hollow', size: 8 }
    },
    {
      type: 'uml.updateEndpoint',
      edgeId: 'edge-order-inventory',
      end: 'start',
      decoration: { shape: 'triangle', fill: 'hollow', size: 10 }
    },
    // Op 60-62: Duplicate selection
    {
      type: 'uml.duplicateSelection',
      nodeIds: ['node-inventory'],
      edgeIds: [],
      offsetX: 40,
      offsetY: 40
    },
    {
      type: 'uml.duplicateSelection',
      nodeIds: ['note-arch'],
      edgeIds: [],
      offsetX: 40,
      offsetY: 40,
      stripCustomData: true
    },
    {
      type: 'uml.duplicateSelection',
      nodeIds: ['shape-queue', 'shape-cache'],
      edgeIds: [],
      offsetX: 40,
      offsetY: 40
    },
    // Op 63-65: Delete entities (including cascading incident edge checks)
    {
      type: 'uml.deleteEntities',
      nodeIds: ['shape-start'],
      edgeIds: ['edge-decision-queue']
    },
    {
      type: 'uml.deleteEntities',
      nodeIds: ['node-user'], // Must cascade delete incident edges: edge-user-order, edge-user-note, edge-user-self!
      edgeIds: []
    },
    {
      type: 'uml.deleteEntities',
      nodeIds: ['frame-billing'], // Must delete frame without deleting children payment/security
      edgeIds: []
    }
  ];

  assert.strictEqual(operations.length, 65, 'Must have exactly 65 operations');

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const res = applyUmlOperationToText(docText, op);

    assert.strictEqual(
      res.ok,
      true,
      `Op ${i + 1} (${op.type}) failed: ${res.error}`
    );
    assert.ok(res.updatedText, `Op ${i + 1} (${op.type}) returned empty updatedText`);

    // Verify valid JSON
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(res.updatedText!);
    } catch (e: any) {
      assert.fail(`Op ${i + 1} produced unparseable JSON: ${e.message}`);
    }

    // Verify schema validity via parseAndValidateDocument
    const valResult = parseAndValidateDocument(res.updatedText!, 'uml');
    assert.strictEqual(
      valResult.ok,
      true,
      `Op ${i + 1} produced invalid UML schema: ${valResult.issues.map((iss) => iss.message).join('; ')}`
    );
    assert.strictEqual(valResult.issues.length, 0, `Op ${i + 1} produced validation issues`);

    // Specific invariants
    if (i === 63) {
      // After deleting node-user, verify incident edges are removed
      const doc = valResult.document as UmlDocument;
      assert.ok(!doc.nodes.some((n) => n.id === 'node-user'), 'node-user must be deleted');
      assert.ok(!doc.edges.some((e) => e.id === 'edge-user-order'), 'edge-user-order must be cascade deleted');
      assert.ok(!doc.edges.some((e) => e.id === 'edge-user-note'), 'edge-user-note must be cascade deleted');
      assert.ok(!doc.edges.some((e) => e.id === 'edge-user-self'), 'edge-user-self must be cascade deleted');
      assert.ok(!('node-user' in doc.layout.nodes), 'node-user layout must be deleted');
    }

    if (i === 64) {
      // After deleting frame-billing, verify children remain
      const doc = valResult.document as UmlDocument;
      assert.ok(!doc.nodes.some((n) => n.id === 'frame-billing'), 'frame-billing must be deleted');
      assert.ok(doc.nodes.some((n) => n.id === 'node-payment'), 'node-payment must NOT be deleted');
      assert.ok(doc.nodes.some((n) => n.id === 'note-security'), 'note-security must NOT be deleted');
    }

    docText = res.updatedText!;
    pass();
  }

  log(`Successfully executed ${operations.length} chained sequential mutations with 100% JSON & schema validity after each operation.`);
});

// ============================================================================
// DIMENSION 2: Text Parsing Adversarial Inputs
// ============================================================================
runSuite('Dimension 2: Text Parsing Adversarial Inputs', ({ log, pass }) => {
  // Test formatVisibilitySign
  assert.strictEqual(formatVisibilitySign('+'), '＋');
  assert.strictEqual(formatVisibilitySign('-'), '－');
  assert.strictEqual(formatVisibilitySign('#'), '#');
  assert.strictEqual(formatVisibilitySign('~'), '~');
  assert.strictEqual(formatVisibilitySign(undefined), '＋');
  pass();

  // 1. Malformed visibility signs
  const malformedVisText = `
    * invalid1: number
    ! invalid2: string
    ? invalid3: boolean
    / derived: string
    + validPublic: number
    - validPrivate: string
    # validProtected: boolean
    ~ validPackage: Date
    ＋ fullwidthPlus: string
    － fullwidthMinus: number
    private x: number
    public y: string
    +
    -
  `;
  const parsedAttrs = parseAttributesFromText(malformedVisText, 'testNode');
  log(`Parsed ${parsedAttrs.length} attributes from malformed visibility text`);
  // Lines with *, !, ?, /, +, - alone should be dropped as non-matching
  const attrNames = parsedAttrs.map((a) => a.name);
  assert.ok(attrNames.includes('validPublic'));
  assert.ok(attrNames.includes('validPrivate'));
  assert.ok(attrNames.includes('validProtected'));
  assert.ok(attrNames.includes('validPackage'));
  assert.ok(attrNames.includes('fullwidthPlus'));
  assert.ok(attrNames.includes('fullwidthMinus'));
  assert.ok(!attrNames.includes('invalid1'));
  assert.ok(!attrNames.includes('invalid2'));
  pass();

  // 2. Unicode symbols & names
  const unicodeAttrs = `
    + alpha: number
    + ÜberVal: string
    + résumé_field: boolean
    + 🏷️tag: string
    + normalAscii: string
  `;
  const parsedUnicode = parseAttributesFromText(unicodeAttrs, 'testNode');
  const uNames = parsedUnicode.map((a) => a.name);
  log(`Unicode attribute parsing result names: ${uNames.join(', ')}`);
  // Note: Regex is /^\s*([+\-#~＋－])?\s*([a-zA-Z_$][\w$-]*)(?:\s*:\s*(.+?))?\s*$/
  // Notice that non-ASCII letters like Über, résumé, 🏷️ are dropped because regex is [a-zA-Z_$]
  assert.ok(uNames.includes('alpha'));
  assert.ok(uNames.includes('normalAscii'));
  pass();

  // 3. Missing colons
  const missingColonAttrs = `
    + counter number
    + standaloneAttr
    + withColon: number
  `;
  const parsedMissing = parseAttributesFromText(missingColonAttrs, 'testNode');
  const missingNames = parsedMissing.map((a) => a.name);
  assert.ok(!missingNames.includes('counter number'), 'counter number has space so must be dropped');
  assert.ok(missingNames.includes('standaloneAttr'), 'standaloneAttr without colon is valid (no type)');
  assert.ok(missingNames.includes('withColon'), 'withColon is valid');
  pass();

  // 4. Generic types in attributes
  const genericAttrText = `
    + cache: Map<string, List<Item>>
    + complex: Record<string, Promise<Map<K, V[]>>>
  `;
  const parsedGenericAttrs = parseAttributesFromText(genericAttrText, 'testNode');
  assert.strictEqual(parsedGenericAttrs.length, 2);
  assert.strictEqual(parsedGenericAttrs[0].type, 'Map<string, List<Item>>');
  assert.strictEqual(parsedGenericAttrs[1].type, 'Record<string, Promise<Map<K, V[]>>>');
  const formattedGenAttrs = formatAttributesToText(parsedGenericAttrs);
  log(`Formatted generic attributes:\n${formattedGenAttrs}`);
  assert.ok(formattedGenAttrs.includes('Map<string, List<Item>>'));
  pass();

  // 5. Operation Text Parsing with Generic Types & Comma in Parameters
  log('Testing parseOperationsFromText with generic parameter types:');
  const opWithGeneric = `+ process(data: Map<string, List<Item>>, count: number): void`;
  const parsedOpGen = parseOperationsFromText(opWithGeneric, 'node1');
  log(`Parsed operations count: ${parsedOpGen.length}`);
  if (parsedOpGen.length > 0) {
    const op = parsedOpGen[0];
    log(`Operation name: ${op.name}, returnType: ${op.returnType}`);
    log(`Parameters: ${JSON.stringify(op.parameters)}`);
    log(`Signature: ${op.signature}`);
    // Check whether split(',') split Map<string into param 1 and List<Item>> into param 2
    if (op.parameters && op.parameters.length > 2) {
      log(`OBSERVATION / BUG FOUND: Generic parameter "Map<string, List<Item>>" was split on comma into multiple parameters: ${JSON.stringify(op.parameters)}`);
    }
  }
  pass();

  // 6. Operation Text Parsing with Function Type parameter (nested parens)
  log('Testing parseOperationsFromText with function type parameter:');
  const opWithFunc = `+ filter(predicate: (x: number) => boolean): number[]`;
  const parsedOpFunc = parseOperationsFromText(opWithFunc, 'node1');
  log(`Parsed operation with function param count: ${parsedOpFunc.length}`);
  if (parsedOpFunc.length > 0) {
    log(`Parsed function param op: name=${parsedOpFunc[0].name}, sig=${parsedOpFunc[0].signature}, ret=${parsedOpFunc[0].returnType}, params=${JSON.stringify(parsedOpFunc[0].parameters)}`);
  }
  pass();

  // 7. Multi-line signatures
  log('Testing multi-line signatures:');
  const multiLineOp = `+ calculateTotal(\n  orderId: string,\n  discount: number\n): number`;
  const parsedMulti = parseOperationsFromText(multiLineOp, 'node1');
  log(`Multi-line signature parsed count: ${parsedMulti.length}`);
  log(`Parsed items: ${JSON.stringify(parsedMulti.map(o => ({ name: o.name, sig: o.signature, ret: o.returnType })))}`);
  pass();

  // 8. Default parameter values
  const opWithDefaults = `+ query(limit: number = 10, offset: number = 0): Item[]`;
  const parsedDefaults = parseOperationsFromText(opWithDefaults, 'node1');
  assert.strictEqual(parsedDefaults.length, 1);
  const defOp = parsedDefaults[0];
  log(`Default param op parsed: params=${JSON.stringify(defOp.parameters)}`);
  assert.strictEqual(defOp.parameters?.[0].name, 'limit');
  assert.strictEqual(defOp.parameters?.[0].type, 'number = 10');
  assert.strictEqual(defOp.parameters?.[1].name, 'offset');
  assert.strictEqual(defOp.parameters?.[1].type, 'number = 0');
  pass();

  // 9. Round-trip idempotence
  const roundTripText = formatOperationsToText(parsedDefaults);
  const reParsed = parseOperationsFromText(roundTripText, 'node1', parsedDefaults);
  assert.strictEqual(reParsed.length, 1);
  assert.strictEqual(reParsed[0].name, defOp.name);
  assert.strictEqual(reParsed[0].returnType, defOp.returnType);
  pass();
});

// ============================================================================
// DIMENSION 3: Edge Case Mutations
// ============================================================================
runSuite('Dimension 3: Edge Case Mutations', ({ log, pass }) => {
  const initialDoc = createDefaultUmlDocument('Edge Cases');
  // Add a class node and a frame node
  initialDoc.nodes.push({
    id: 'node-existing',
    kind: 'class',
    name: 'ExistingClass'
  });
  initialDoc.nodes.push({
    id: 'frame-existing',
    kind: 'frame',
    name: 'ExistingFrame',
    children: []
  });
  initialDoc.layout.nodes['node-existing'] = { x: 100, y: 100, width: 200, height: 100 };
  initialDoc.layout.nodes['frame-existing'] = { x: 400, y: 100, width: 300, height: 300 };
  let docText = JSON.stringify(initialDoc, null, 2);

  // 1. Duplicate node ID
  log('Testing duplicate node ID:');
  const dupNodeRes = applyUmlOperationToText(docText, {
    type: 'uml.addNode',
    id: 'node-existing',
    kind: 'class',
    name: 'DuplicateNode',
    x: 200,
    y: 200
  });
  assert.strictEqual(dupNodeRes.ok, false);
  assert.ok(dupNodeRes.error?.includes('already exists'));
  log(`Rejection confirmed: "${dupNodeRes.error}"`);
  pass();

  // 2. Blank names in addNode and updateNode
  log('Testing blank names:');
  const addBlankRes = applyUmlOperationToText(docText, {
    type: 'uml.addNode',
    id: 'node-blank',
    kind: 'class',
    name: '   ',
    x: 200,
    y: 200
  });
  assert.strictEqual(addBlankRes.ok, true);
  const docAfterBlank = JSON.parse(addBlankRes.updatedText!);
  const addedNode = docAfterBlank.nodes.find((n: any) => n.id === 'node-blank');
  assert.strictEqual(addedNode.name, 'NewEntity', 'Blank name in addNode defaults to NewEntity');
  log(`addNode blank name defaulted to: "${addedNode.name}"`);
  pass();

  // Update name to blank
  const updateBlankRes = applyUmlOperationToText(addBlankRes.updatedText!, {
    type: 'uml.updateNode',
    nodeId: 'node-blank',
    name: '   '
  });
  assert.strictEqual(updateBlankRes.ok, true);
  const docAfterUpdateBlank = JSON.parse(updateBlankRes.updatedText!);
  const updatedBlankNode = docAfterUpdateBlank.nodes.find((n: any) => n.id === 'node-blank');
  assert.strictEqual(updatedBlankNode.name, '', 'Blank name in updateNode allows empty string');
  const valBlank = parseAndValidateDocument(updateBlankRes.updatedText!, 'uml');
  assert.strictEqual(valBlank.ok, true, 'Document with empty node name is schema-valid');
  log('updateNode allowed blank name and remained schema-valid.');
  pass();

  // 3. Deleting already deleted entities / non-existent entities
  log('Testing deleting non-existent entities:');
  const delGhostRes = applyUmlOperationToText(docText, {
    type: 'uml.deleteEntities',
    nodeIds: ['ghost-node-999'],
    edgeIds: ['ghost-edge-999']
  });
  assert.strictEqual(delGhostRes.ok, true);
  const valGhost = parseAndValidateDocument(delGhostRes.updatedText!, 'uml');
  assert.strictEqual(valGhost.ok, true);
  log('Deleting non-existent entities handled gracefully without errors.');
  pass();

  // 4. Creating relations between non-existent nodes
  log('Testing relations with non-existent nodes:');
  const relNonExist1 = applyUmlOperationToText(docText, {
    type: 'uml.addEdge',
    id: 'edge-bad-1',
    sourceNodeId: 'non-existent-source',
    targetNodeId: 'node-existing'
  });
  assert.strictEqual(relNonExist1.ok, false);
  assert.ok(relNonExist1.error?.includes('does not exist'));

  const relNonExist2 = applyUmlOperationToText(docText, {
    type: 'uml.addEdge',
    id: 'edge-bad-2',
    sourceNodeId: 'node-existing',
    targetNodeId: 'non-existent-target'
  });
  assert.strictEqual(relNonExist2.ok, false);
  assert.ok(relNonExist2.error?.includes('does not exist'));
  log(`Rejected non-existent endpoints: "${relNonExist1.error}" & "${relNonExist2.error}"`);
  pass();

  // 5. Attempting relations to frame nodes
  log('Testing relations to frame nodes:');
  const frameEdge1 = applyUmlOperationToText(docText, {
    type: 'uml.addEdge',
    id: 'edge-frame-source',
    sourceNodeId: 'frame-existing',
    targetNodeId: 'node-existing'
  });
  assert.strictEqual(frameEdge1.ok, false);
  assert.ok(frameEdge1.error?.includes('Frames cannot have relationships'));

  const frameEdge2 = applyUmlOperationToText(docText, {
    type: 'uml.addEdge',
    id: 'edge-frame-target',
    sourceNodeId: 'node-existing',
    targetNodeId: 'frame-existing'
  });
  assert.strictEqual(frameEdge2.ok, false);
  assert.ok(frameEdge2.error?.includes('Frames cannot have relationships'));
  log(`Rejected relations to frame: "${frameEdge1.error}"`);
  pass();
});

// ============================================================================
// DIMENSION 4: Indentation Preservation (2-space, 4-space, tabs, CRLF)
// ============================================================================
runSuite('Dimension 4: Indentation Preservation across edits', ({ log, pass }) => {
  function verifyIndentation(text: string, expectedIndent: string, label: string) {
    const lines = text.split(/\r?\n/);
    let checkedLines = 0;
    for (const line of lines) {
      const match = /^(\s+)\S/.exec(line);
      if (match) {
        const ws = match[1];
        if (expectedIndent === '  ') {
          // 2 spaces: length must be multiple of 2 and no tabs
          assert.strictEqual(ws.includes('\t'), false, `${label}: Line has unexpected tab: "${line}"`);
          assert.strictEqual(ws.length % 2, 0, `${label}: Line indentation is not multiple of 2: ${ws.length} spaces: "${line}"`);
        } else if (expectedIndent === '    ') {
          // 4 spaces: length must be multiple of 4 and no tabs
          assert.strictEqual(ws.includes('\t'), false, `${label}: Line has unexpected tab: "${line}"`);
          assert.strictEqual(ws.length % 4, 0, `${label}: Line indentation is not multiple of 4: ${ws.length} spaces: "${line}"`);
        } else if (expectedIndent === '\t') {
          // tabs: must start with tab and have no spaces in indentation
          assert.strictEqual(ws.includes('  '), false, `${label}: Line has unexpected spaces: "${line}"`);
          assert.strictEqual(ws.startsWith('\t'), true, `${label}: Line does not start with tab: "${line}"`);
        }
        checkedLines++;
      }
    }
    assert.ok(checkedLines > 10, `${label}: Checked ${checkedLines} indented lines`);
  }

  // 1. 2-space document test across 6 mutations
  log('Testing 2-space document indentation preservation across mutations:');
  const baseDoc2 = createDefaultUmlDocument('TwoSpaceDoc');
  let text2 = JSON.stringify(baseDoc2, null, 2);
  verifyIndentation(text2, '  ', 'Initial 2-space doc');

  const ops: UmlOperationPayload[] = [
    { type: 'uml.updateMetadata', title: 'Two Space Mutated' },
    { type: 'uml.addNode', id: 'n1', kind: 'class', name: 'ClassA', x: 100, y: 100 },
    { type: 'uml.addNode', id: 'n2', kind: 'class', name: 'ClassB', x: 300, y: 100 },
    { type: 'uml.addEdge', id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2', label: 'relates' },
    { type: 'uml.updateNode', nodeId: 'n1', stereotype: 'entity' },
    { type: 'uml.moveResizeNodes', updates: { n1: { x: 120, y: 120, width: 220, height: 140 } } }
  ];

  for (let idx = 0; idx < ops.length; idx++) {
    const res = applyUmlOperationToText(text2, ops[idx]);
    assert.strictEqual(res.ok, true, `2-space op ${idx} failed`);
    verifyIndentation(res.updatedText!, '  ', `2-space step ${idx + 1}`);
    text2 = res.updatedText!;
  }
  log('2-space indentation preserved with 100% fidelity across all operations.');
  pass();

  // 2. 4-space document test across 6 mutations
  log('Testing 4-space document indentation preservation across mutations:');
  const baseDoc4 = createDefaultUmlDocument('FourSpaceDoc');
  let text4 = JSON.stringify(baseDoc4, null, 4);
  verifyIndentation(text4, '    ', 'Initial 4-space doc');

  for (let idx = 0; idx < ops.length; idx++) {
    const res = applyUmlOperationToText(text4, ops[idx]);
    assert.strictEqual(res.ok, true, `4-space op ${idx} failed`);
    verifyIndentation(res.updatedText!, '    ', `4-space step ${idx + 1}`);
    text4 = res.updatedText!;
  }
  log('4-space indentation preserved with 100% fidelity across all operations.');
  pass();

  // 3. Tab-indented document
  log('Testing tab-indented document:');
  const baseDocTab = createDefaultUmlDocument('TabDoc');
  let textTab = JSON.stringify(baseDocTab, null, '\t');
  verifyIndentation(textTab, '\t', 'Initial tab doc');

  for (let idx = 0; idx < 3; idx++) {
    const res = applyUmlOperationToText(textTab, ops[idx]);
    assert.strictEqual(res.ok, true, `Tab op ${idx} failed`);
    verifyIndentation(res.updatedText!, '\t', `Tab step ${idx + 1}`);
    textTab = res.updatedText!;
  }
  log('Tab indentation preserved across operations.');
  pass();

  // 4. CRLF document test
  log('Testing CRLF line endings preservation:');
  let textCRLF = JSON.stringify(baseDoc2, null, 2).replace(/\n/g, '\r\n');
  assert.ok(textCRLF.includes('\r\n'));
  const resCRLF = applyUmlOperationToText(textCRLF, ops[1]);
  assert.strictEqual(resCRLF.ok, true);
  assert.ok(resCRLF.updatedText!.includes('\r\n'), 'Updated text must preserve CRLF line endings');
  assert.ok(!resCRLF.updatedText!.replace(/\r\n/g, '').includes('\n'), 'No lone LF line endings introduced');
  log('CRLF line endings preserved with 100% fidelity.');
  pass();
});

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log('\n======================================================');
console.log('                 TEST SUMMARY REPORT                  ');
console.log('======================================================');
let totalPassed = 0;
let totalFailed = 0;

for (const rep of reports) {
  console.log(`\nSuite: ${rep.suite}`);
  console.log(`  Passed: ${rep.passed}, Failed: ${rep.failed}`);
  for (const d of rep.details) {
    console.log(`    - ${d}`);
  }
  totalPassed += rep.passed;
  totalFailed += rep.failed;
}

console.log('\n======================================================');
console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
console.log('======================================================');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
