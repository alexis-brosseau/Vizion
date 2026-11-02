import assert from 'node:assert';
import {
  screenToWorld,
  worldToScreen,
  type Point2D,
  type ViewportTransform,
  type Rect2D,
  snapToGrid,
  snapRectToGrid,
  normalizeDragRect,
  rectsIntersect,
  computeUmlEdgeGeometry,
  computeOrthogonalRoute,
  computeStraightRoute,
  computeBezierRoute,
  computeShapeBoundaryIntersection,
  getMultiplicityLabelPoint,
  simplifyStrokePoints
} from '../src/shared/geometry/index';
import type { UmlNodeLayout, UmlRoutingKind } from '../src/shared/documents/types';

interface TestResult {
  suite: string;
  passed: number;
  failed: number;
  errors: string[];
}

const allResults: TestResult[] = [];

function runSuite(name: string, fn: (res: TestResult, log: (msg: string) => void) => void): TestResult {
  const result: TestResult = { suite: name, passed: 0, failed: 0, errors: [] };
  const log = (msg: string) => {};
  allResults.push(result);
  try {
    fn(result, log);
  } catch (e: any) {
    result.failed++;
    result.errors.push(`Unhandled suite failure: ${e?.message ?? String(e)}\n${e?.stack ?? ''}`);
  }
  return result;
}

console.log('================================================================');
console.log('EMPIRICAL CHALLENGER: MILESTONE 1 ITERATION 2 GEOMETRY SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// HELPER: Path Parser & Validator
// -----------------------------------------------------------------------------
interface PathSegment {
  type: 'M' | 'L' | 'C';
  from: Point2D;
  to: Point2D;
}

function parseSvgPathSegments(pathD: string): { start: Point2D; segments: PathSegment[]; points: Point2D[] } {
  const tokens = pathD.trim().split(/\s+/);
  const points: Point2D[] = [];
  const segments: PathSegment[] = [];
  let i = 0;
  let curr: Point2D = { x: 0, y: 0 };

  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === 'M') {
      const x = parseFloat(tokens[i++]);
      const y = parseFloat(tokens[i++]);
      curr = { x, y };
      points.push(curr);
    } else if (cmd === 'L') {
      const x = parseFloat(tokens[i++]);
      const y = parseFloat(tokens[i++]);
      const next = { x, y };
      segments.push({ type: 'L', from: { ...curr }, to: { ...next } });
      curr = next;
      points.push(curr);
    } else if (cmd === 'C') {
      const c1x = parseFloat(tokens[i++]);
      const c1y = parseFloat(tokens[i++]);
      const c2x = parseFloat(tokens[i++]);
      const c2y = parseFloat(tokens[i++]);
      const x = parseFloat(tokens[i++]);
      const y = parseFloat(tokens[i++]);
      const next = { x, y };
      segments.push({ type: 'C', from: { ...curr }, to: { ...next } });
      curr = next;
      points.push(curr);
    }
  }

  return { start: points[0] ?? { x: 0, y: 0 }, segments, points };
}

function verifyOrthogonality(pathD: string, tolerance = 1e-4): { isOrthogonal: boolean; violations: string[] } {
  const { segments } = parseSvgPathSegments(pathD);
  const violations: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.type !== 'L') {
      violations.push(`Segment ${i} is not a linear segment: ${seg.type}`);
      continue;
    }
    const dx = Math.abs(seg.to.x - seg.from.x);
    const dy = Math.abs(seg.to.y - seg.from.y);
    const isHoriz = dy < tolerance && dx > 0;
    const isVert = dx < tolerance && dy > 0;
    if (!isHoriz && !isVert) {
      violations.push(
        `Segment ${i} is diagonal: from (${seg.from.x}, ${seg.from.y}) to (${seg.to.x}, ${seg.to.y}) [dx=${dx}, dy=${dy}]`
      );
    }
  }

  return { isOrthogonal: violations.length === 0, violations };
}

function verifyMonotonicity(
  pathD: string,
  primaryAxis: 'x' | 'y',
  expectedDir: 1 | -1,
  tolerance = 1e-4
): { isMonotonic: boolean; violations: string[] } {
  const { points } = parseSvgPathSegments(pathD);
  const violations: string[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const diff = expectedDir === 1 ? p2[primaryAxis] - p1[primaryAxis] : p1[primaryAxis] - p2[primaryAxis];
    // A step along primary axis cannot move in opposite direction
    if (diff < -tolerance) {
      violations.push(
        `Point ${i} to ${i + 1} backtracks along ${primaryAxis}: ${p1[primaryAxis]} -> ${p2[primaryAxis]} (expected direction: ${expectedDir})`
      );
    }
  }

  return { isMonotonic: violations.length === 0, violations };
}

// =============================================================================
// TEST SUITE 1: Coordinate Reversibility & Numerical Precision
// =============================================================================
runSuite('Suite 1: Coordinate Reversibility & Precision Across Zoom & Pan', () => {
  const res = allResults[allResults.length - 1];

  const zooms = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0, 25.0, 50.0, 100.0];
  const pans = [-1e6, -5e5, -12345.6789, -100, 0, 100, 12345.6789, 5e5, 1e6];
  const testPoints: Point2D[] = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 100, y: 200 },
    { x: -500, y: 800 },
    { x: 123.456789123456, y: 987.654321987654 }, // high precision float
    { x: -98765.432109876, y: -12345.678901234 },
    { x: 0.0000123456, y: 0.0000987654 }, // micro float
    { x: 500000.123456, y: -500000.654321 }, // large coordinate float
    { x: 33.333333333333, y: 66.666666666667 }
  ];

  let maxW2S2WError = 0;
  let maxS2W2SError = 0;
  let totalW2S2WTests = 0;
  let totalS2W2STests = 0;

  for (const zoom of zooms) {
    for (const pan of pans) {
      const vp: ViewportTransform = { panX: pan, panY: pan, zoom };

      for (const pt of testPoints) {
        // 1. World -> Screen -> World
        totalW2S2WTests++;
        const screenPt = worldToScreen(pt, vp);
        const worldPt = screenToWorld(screenPt, vp);
        const errW = Math.max(Math.abs(worldPt.x - pt.x), Math.abs(worldPt.y - pt.y));
        if (errW > maxW2S2WError) maxW2S2WError = errW;

        if (errW > 1e-6) {
          res.failed++;
          res.errors.push(
            `W2S2W reversibility failed at zoom=${zoom}, pan=${pan}, pt=(${pt.x}, ${pt.y}): returned (${worldPt.x}, ${worldPt.y}), error=${errW}`
          );
        } else {
          res.passed++;
        }

        // Also test scalar overload: screenToWorld(x, y, vp) vs worldToScreen(x, y, vp)
        const screenScalar = worldToScreen(pt.x, pt.y, vp);
        const worldScalar = screenToWorld(screenScalar.x, screenScalar.y, vp);
        assert.strictEqual(screenScalar.x, screenPt.x);
        assert.strictEqual(screenScalar.y, screenPt.y);
        assert.strictEqual(worldScalar.x, worldPt.x);
        assert.strictEqual(worldScalar.y, worldPt.y);

        // 2. Screen -> World -> Screen
        totalS2W2STests++;
        const sInitial: Point2D = { x: pt.x * 2.5 + pan * 0.1, y: pt.y * 2.5 + pan * 0.1 };
        const wFromS = screenToWorld(sInitial, vp);
        const sBack = worldToScreen(wFromS, vp);
        const errS = Math.max(Math.abs(sBack.x - sInitial.x), Math.abs(sBack.y - sInitial.y));
        if (errS > maxS2W2SError) maxS2W2SError = errS;

        if (errS > 1e-6) {
          res.failed++;
          res.errors.push(
            `S2W2S reversibility failed at zoom=${zoom}, pan=${pan}, s=(${sInitial.x}, ${sInitial.y}): returned (${sBack.x}, ${sBack.y}), error=${errS}`
          );
        } else {
          res.passed++;
        }
      }
    }
  }

  console.log(`  [Suite 1] Executed ${totalW2S2WTests} W->S->W and ${totalS2W2STests} S->W->S transformations.`);
  console.log(`  [Suite 1] Max W->S->W Error: ${maxW2S2WError.toExponential(4)} (Threshold: <= 1.0000e-6)`);
  console.log(`  [Suite 1] Max S->W->S Error: ${maxS2W2SError.toExponential(4)} (Threshold: <= 1.0000e-6)`);
});

// =============================================================================
// TEST SUITE 2: Viewport Degeneracy & Edge Inputs
// =============================================================================
runSuite('Suite 2: Viewport Zero/Negative/Non-Finite Protection', () => {
  const res = allResults[allResults.length - 1];

  const edgeViewports = [
    { vp: { panX: 0, panY: 0, zoom: 0 }, desc: 'zoom = 0' },
    { vp: { panX: 0, panY: 0, zoom: -1 }, desc: 'zoom = -1' },
    { vp: { panX: 0, panY: 0, zoom: -0.05 }, desc: 'zoom = -0.05' },
    { vp: { panX: 0, panY: 0, zoom: NaN }, desc: 'zoom = NaN' },
    { vp: { panX: 0, panY: 0, zoom: Infinity }, desc: 'zoom = Infinity' },
    { vp: { panX: 0, panY: 0, zoom: -Infinity }, desc: 'zoom = -Infinity' },
    { vp: { panX: NaN, panY: 0, zoom: 1 }, desc: 'panX = NaN' },
    { vp: { panX: 0, panY: Infinity, zoom: 1 }, desc: 'panY = Infinity' },
    { vp: {} as any, desc: 'empty viewport' },
    { vp: null as any, desc: 'null viewport' }
  ];

  for (const { vp, desc } of edgeViewports) {
    try {
      const p = { x: 100, y: 200 };
      const s = worldToScreen(p, vp);
      const w = screenToWorld(s, vp);
      assert(Number.isFinite(s.x), `s.x must be finite for ${desc}`);
      assert(Number.isFinite(s.y), `s.y must be finite for ${desc}`);
      assert(Number.isFinite(w.x), `w.x must be finite for ${desc}`);
      assert(Number.isFinite(w.y), `w.y must be finite for ${desc}`);
      res.passed++;
    } catch (e: any) {
      res.failed++;
      res.errors.push(`Degeneracy failure on ${desc}: ${e.message}`);
    }
  }

  console.log(`  [Suite 2] Tested ${edgeViewports.length} degenerate/non-finite viewports: 0 unhandled exceptions.`);
});

// =============================================================================
// TEST SUITE 3: Orthogonal Edge Routing on Horizontally Collinear Nodes
// =============================================================================
runSuite('Suite 3: Horizontally Collinear Nodes (Forward & Reverse, Parallel Offsets)', () => {
  const res = allResults[allResults.length - 1];

  const offsets = [-40, -20, -10, 0, 10, 20, 40];
  const configs = [
    {
      desc: 'Forward left-to-right (A -> B)',
      nodeA: { x: 100, y: 100, width: 120, height: 80 },
      nodeB: { x: 400, y: 100, width: 120, height: 80 },
      primaryDir: 1 as const
    },
    {
      desc: 'Reverse right-to-left (B -> A)',
      nodeA: { x: 400, y: 100, width: 120, height: 80 },
      nodeB: { x: 100, y: 100, width: 120, height: 80 },
      primaryDir: -1 as const
    },
    {
      desc: 'Close horizontal spacing (gap = 40px)',
      nodeA: { x: 100, y: 200, width: 100, height: 60 },
      nodeB: { x: 240, y: 200, width: 100, height: 60 },
      primaryDir: 1 as const
    },
    {
      desc: 'Very wide horizontal spacing (gap = 800px)',
      nodeA: { x: 100, y: 300, width: 120, height: 80 },
      nodeB: { x: 1020, y: 300, width: 120, height: 80 },
      primaryDir: 1 as const
    }
  ];

  for (const config of configs) {
    const pathsByOffset = new Map<number, string>();
    const hitPathsByOffset = new Map<number, string>();

    for (const offset of offsets) {
      const geom = computeUmlEdgeGeometry(
        config.nodeA,
        config.nodeB,
        'orthogonal',
        undefined,
        undefined,
        offset
      );

      pathsByOffset.set(offset, geom.pathD);
      hitPathsByOffset.set(offset, geom.hitPathD);

      // Verify orthogonality
      const { isOrthogonal, violations: orthoViolations } = verifyOrthogonality(geom.pathD);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(
          `[${config.desc}, offset=${offset}] Orthogonality violated: ${orthoViolations.join('; ')} (path: ${geom.pathD})`
        );
      } else {
        res.passed++;
      }

      // Verify monotonicity along X axis
      const { isMonotonic, violations: monoViolations } = verifyMonotonicity(
        geom.pathD,
        'x',
        config.primaryDir
      );
      if (!isMonotonic) {
        res.failed++;
        res.errors.push(
          `[${config.desc}, offset=${offset}] Monotonicity violated: ${monoViolations.join('; ')} (path: ${geom.pathD})`
        );
      } else {
        res.passed++;
      }

      // Verify non-collapse for offset !== 0: intermediate jog must have jogY !== startPt.y
      if (offset !== 0) {
        const { points } = parseSvgPathSegments(geom.pathD);
        assert(points.length >= 4, `Expected jog points for offset ${offset}, found ${points.length}`);
        const jogYExpected = (config.nodeA.y + config.nodeA.height / 2) + offset;
        const hasJog = points.some((p) => Math.abs(p.y - jogYExpected) < 1.0);
        if (!hasJog) {
          res.failed++;
          res.errors.push(
            `[${config.desc}, offset=${offset}] Expected jog at y=${jogYExpected}, but path was: ${geom.pathD}`
          );
        } else {
          res.passed++;
        }
      }
    }

    // Verify distinctness: all paths in {-20, 0, 20} must be mutually distinct
    const pMinus20 = pathsByOffset.get(-20)!;
    const p0 = pathsByOffset.get(0)!;
    const pPlus20 = pathsByOffset.get(20)!;

    if (pMinus20 === p0 || p0 === pPlus20 || pMinus20 === pPlus20) {
      res.failed++;
      res.errors.push(
        `[${config.desc}] Parallel offset collision! p(-20)='${pMinus20}', p(0)='${p0}', p(20)='${pPlus20}'`
      );
    } else {
      res.passed++;
    }

    // Verify hitPath distinctness as well
    const hMinus20 = hitPathsByOffset.get(-20)!;
    const h0 = hitPathsByOffset.get(0)!;
    const hPlus20 = hitPathsByOffset.get(20)!;
    if (hMinus20 === h0 || h0 === hPlus20 || hMinus20 === hPlus20) {
      res.failed++;
      res.errors.push(`[${config.desc}] HitPath parallel collision!`);
    } else {
      res.passed++;
    }
  }

  console.log(`  [Suite 3] Tested horizontally aligned nodes across 4 configurations and 7 offsets each.`);
});

// =============================================================================
// TEST SUITE 4: Orthogonal Edge Routing on Vertically Collinear Nodes
// =============================================================================
runSuite('Suite 4: Vertically Collinear Nodes (Forward & Reverse, Parallel Offsets)', () => {
  const res = allResults[allResults.length - 1];

  const offsets = [-40, -20, -10, 0, 10, 20, 40];
  const configs = [
    {
      desc: 'Forward top-to-bottom (A -> B)',
      nodeA: { x: 100, y: 100, width: 120, height: 80 },
      nodeB: { x: 100, y: 400, width: 120, height: 80 },
      primaryDir: 1 as const
    },
    {
      desc: 'Reverse bottom-to-top (B -> A)',
      nodeA: { x: 100, y: 400, width: 120, height: 80 },
      nodeB: { x: 100, y: 100, width: 120, height: 80 },
      primaryDir: -1 as const
    },
    {
      desc: 'Close vertical spacing (gap = 40px)',
      nodeA: { x: 200, y: 100, width: 80, height: 60 },
      nodeB: { x: 200, y: 200, width: 80, height: 60 },
      primaryDir: 1 as const
    },
    {
      desc: 'Very wide vertical spacing (gap = 800px)',
      nodeA: { x: 300, y: 100, width: 120, height: 80 },
      nodeB: { x: 300, y: 980, width: 120, height: 80 },
      primaryDir: 1 as const
    }
  ];

  for (const config of configs) {
    const pathsByOffset = new Map<number, string>();
    const hitPathsByOffset = new Map<number, string>();

    for (const offset of offsets) {
      const geom = computeUmlEdgeGeometry(
        config.nodeA,
        config.nodeB,
        'orthogonal',
        undefined,
        undefined,
        offset
      );

      pathsByOffset.set(offset, geom.pathD);
      hitPathsByOffset.set(offset, geom.hitPathD);

      // Verify orthogonality
      const { isOrthogonal, violations: orthoViolations } = verifyOrthogonality(geom.pathD);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(
          `[${config.desc}, offset=${offset}] Orthogonality violated: ${orthoViolations.join('; ')} (path: ${geom.pathD})`
        );
      } else {
        res.passed++;
      }

      // Verify monotonicity along Y axis
      const { isMonotonic, violations: monoViolations } = verifyMonotonicity(
        geom.pathD,
        'y',
        config.primaryDir
      );
      if (!isMonotonic) {
        res.failed++;
        res.errors.push(
          `[${config.desc}, offset=${offset}] Monotonicity violated: ${monoViolations.join('; ')} (path: ${geom.pathD})`
        );
      } else {
        res.passed++;
      }

      // Verify non-collapse for offset !== 0: intermediate jog must have jogX !== startPt.x
      if (offset !== 0) {
        const { points } = parseSvgPathSegments(geom.pathD);
        assert(points.length >= 4, `Expected jog points for offset ${offset}, found ${points.length}`);
        const jogXExpected = (config.nodeA.x + config.nodeA.width / 2) + offset;
        const hasJog = points.some((p) => Math.abs(p.x - jogXExpected) < 1.0);
        if (!hasJog) {
          res.failed++;
          res.errors.push(
            `[${config.desc}, offset=${offset}] Expected jog at x=${jogXExpected}, but path was: ${geom.pathD}`
          );
        } else {
          res.passed++;
        }
      }
    }

    // Verify distinctness: all paths in {-20, 0, 20} must be mutually distinct
    const pMinus20 = pathsByOffset.get(-20)!;
    const p0 = pathsByOffset.get(0)!;
    const pPlus20 = pathsByOffset.get(20)!;

    if (pMinus20 === p0 || p0 === pPlus20 || pMinus20 === pPlus20) {
      res.failed++;
      res.errors.push(
        `[${config.desc}] Parallel offset collision! p(-20)='${pMinus20}', p(0)='${p0}', p(20)='${pPlus20}'`
      );
    } else {
      res.passed++;
    }

    // Verify hitPath distinctness as well
    const hMinus20 = hitPathsByOffset.get(-20)!;
    const h0 = hitPathsByOffset.get(0)!;
    const hPlus20 = hitPathsByOffset.get(20)!;
    if (hMinus20 === h0 || h0 === hPlus20 || hMinus20 === hPlus20) {
      res.failed++;
      res.errors.push(`[${config.desc}] HitPath parallel collision!`);
    } else {
      res.passed++;
    }
  }

  console.log(`  [Suite 4] Tested vertically aligned nodes across 4 configurations and 7 offsets each.`);
});

// =============================================================================
// TEST SUITE 5: Zero Offset & Unaligned Regression Verification
// =============================================================================
runSuite('Suite 5: Zero Offset & Unaligned Nodes Regression Verification', () => {
  const res = allResults[allResults.length - 1];

  // 1. Exact Test 17 configuration (offset = 0, unaligned)
  const nodeA = { x: 0, y: 0, width: 100, height: 100 };
  const nodeB = { x: 300, y: 100, width: 100, height: 100 };
  const t17Geom = computeUmlEdgeGeometry(nodeA, nodeB, 'orthogonal');
  assert.strictEqual(t17Geom.pathD, 'M 100 50 L 200 50 L 200 150 L 300 150');
  assert.strictEqual(t17Geom.hitPathD, 'M 100 50 L 200 50 L 200 150 L 300 150');
  assert.deepStrictEqual(t17Geom.labelPoint, { x: 200, y: 100 });
  res.passed += 3;

  // 2. Collinear with 0 offset: should produce clean straight single segment
  const horizCollinear0 = computeUmlEdgeGeometry(
    { x: 100, y: 100, width: 120, height: 80 },
    { x: 400, y: 100, width: 120, height: 80 },
    'orthogonal',
    undefined,
    undefined,
    0
  );
  assert.strictEqual(horizCollinear0.pathD, 'M 220 140  L 400 140');
  res.passed++;

  const vertCollinear0 = computeUmlEdgeGeometry(
    { x: 100, y: 100, width: 120, height: 80 },
    { x: 100, y: 400, width: 120, height: 80 },
    'orthogonal',
    undefined,
    undefined,
    0
  );
  assert.strictEqual(vertCollinear0.pathD, 'M 160 180  L 160 400');
  res.passed++;

  // 3. Various unaligned configurations with offsets
  const unalignedPairs = [
    { a: { x: 0, y: 0, width: 100, height: 100 }, b: { x: 250, y: 150, width: 100, height: 100 } },
    { a: { x: 0, y: 200, width: 100, height: 100 }, b: { x: 250, y: 50, width: 100, height: 100 } },
    { a: { x: 200, y: 0, width: 100, height: 100 }, b: { x: 50, y: 250, width: 100, height: 100 } },
    { a: { x: 150, y: 250, width: 100, height: 100 }, b: { x: 0, y: 0, width: 100, height: 100 } }
  ];

  for (const pair of unalignedPairs) {
    for (const off of [-20, 0, 20]) {
      const g = computeUmlEdgeGeometry(pair.a, pair.b, 'orthogonal', undefined, undefined, off);
      const { isOrthogonal, violations } = verifyOrthogonality(g.pathD);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(`Unaligned pair offset ${off} not orthogonal: ${violations.join('; ')}`);
      } else {
        res.passed++;
      }
    }
  }

  // 4. Straight and Bezier routing with parallel offsets
  const straightP1 = computeUmlEdgeGeometry(nodeA, nodeB, 'straight', undefined, undefined, -20);
  const straightP2 = computeUmlEdgeGeometry(nodeA, nodeB, 'straight', undefined, undefined, 0);
  const straightP3 = computeUmlEdgeGeometry(nodeA, nodeB, 'straight', undefined, undefined, 20);
  assert.notStrictEqual(straightP1.pathD, straightP2.pathD);
  assert.notStrictEqual(straightP2.pathD, straightP3.pathD);
  res.passed += 2;

  const bezierP1 = computeUmlEdgeGeometry(nodeA, nodeB, 'bezier', undefined, undefined, -20);
  const bezierP2 = computeUmlEdgeGeometry(nodeA, nodeB, 'bezier', undefined, undefined, 0);
  const bezierP3 = computeUmlEdgeGeometry(nodeA, nodeB, 'bezier', undefined, undefined, 20);
  assert.notStrictEqual(bezierP1.pathD, bezierP2.pathD);
  assert.notStrictEqual(bezierP2.pathD, bezierP3.pathD);
  res.passed += 2;

  // 5. Self-loop routing
  const selfOrtho = computeUmlEdgeGeometry(nodeA, nodeA, 'orthogonal');
  assert(selfOrtho.pathD.startsWith('M'));
  const selfBezier = computeUmlEdgeGeometry(nodeA, nodeA, 'bezier');
  assert(selfBezier.pathD.includes('C'));
  res.passed += 2;

  console.log(`  [Suite 5] Verified Test 17 regression freedom, collinear zero-offset, unaligned offsets, and straight/bezier modes.`);
});

// =============================================================================
// TEST SUITE 6: Trimmed Decorated Endpoints on Collinear Orthogonal Paths
// =============================================================================
runSuite('Suite 6: Trimmed Decorated Endpoints on Collinear Orthogonal Paths', () => {
  const res = allResults[allResults.length - 1];

  const nodeA = { x: 100, y: 100, width: 120, height: 80 };
  const nodeB = { x: 400, y: 100, width: 120, height: 80 };

  const decPairs = [
    { start: { shape: 'diamond' as const, fill: 'hollow' as const, size: 12 }, end: { shape: 'triangle' as const, fill: 'hollow' as const, size: 12 } },
    { start: { shape: 'arrow' as const, size: 10 }, end: { shape: 'circle' as const, fill: 'hollow' as const, size: 14 } },
    { start: { shape: 'crowfoot' as const, size: 12 }, end: { shape: 'cross' as const, size: 10 } }
  ];

  for (const pair of decPairs) {
    for (const offset of [-20, 0, 20]) {
      const geom = computeUmlEdgeGeometry(
        nodeA,
        nodeB,
        'orthogonal',
        pair.start,
        pair.end,
        offset
      );

      const { isOrthogonal, violations } = verifyOrthogonality(geom.pathD);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(`Trimmed decorated collinear path offset ${offset} failed orthogonality: ${violations.join('; ')}`);
      } else {
        res.passed++;
      }

      // Check trimmed points: trimmedStart should be along horizontal axis
      const { points } = parseSvgPathSegments(geom.pathD);
      assert(points.length >= 2);
      if (offset === 0) {
        // Collinear trimmed: start y must equal end y
        assert.strictEqual(points[0].y, points[1].y);
      }
      res.passed++;
    }
  }

  console.log(`  [Suite 6] Verified decorated endpoint trims preserve orthogonality on collinear offsets.`);
});

// =============================================================================
// TEST SUITE 7: Multiplicity Label Positioning & Stroke Simplification
// =============================================================================
runSuite('Suite 7: Multiplicity Label Positioning & Stroke Simplification', () => {
  const res = allResults[allResults.length - 1];

  // 1. Multiplicity label point checks
  const p1 = getMultiplicityLabelPoint({ x: 100, y: 100 }, 0, '1..*');
  assert(Number.isFinite(p1.x) && Number.isFinite(p1.y));
  const p2 = getMultiplicityLabelPoint({ x: 100, y: 100 }, 90, '0..1');
  assert(Number.isFinite(p2.x) && Number.isFinite(p2.y));
  const p3 = getMultiplicityLabelPoint({ x: 100, y: 100 }, 180, 'many');
  assert(Number.isFinite(p3.x) && Number.isFinite(p3.y));
  const p4 = getMultiplicityLabelPoint({ x: 100, y: 100 }, 270, '');
  assert(Number.isFinite(p4.x) && Number.isFinite(p4.y));
  res.passed += 4;

  // 2. Stroke points simplification
  const stroke: [number, number][] = [
    [0, 0],
    [5, 0.1],
    [10, -0.1],
    [20, 0],
    [20, 10],
    [20, 20]
  ];
  const simplified = simplifyStrokePoints(stroke, 0.5);
  assert(simplified.length <= stroke.length);
  assert.deepStrictEqual(simplified[0], [0, 0]);
  assert.deepStrictEqual(simplified[simplified.length - 1], [20, 20]);
  res.passed += 2;

  // 3. Rect utilities
  const r1 = normalizeDragRect({ x: 100, y: 200 }, { x: 50, y: 150 });
  assert.strictEqual(r1.x, 50);
  assert.strictEqual(r1.y, 150);
  assert.strictEqual(r1.width, 50);
  assert.strictEqual(r1.height, 50);
  res.passed++;

  const r2: Rect2D = { x: 0, y: 0, width: 50, height: 50 };
  const r3: Rect2D = { x: 40, y: 40, width: 50, height: 50 };
  const r4: Rect2D = { x: 100, y: 100, width: 50, height: 50 };
  assert.strictEqual(rectsIntersect(r1, r1), true);
  assert.strictEqual(rectsIntersect(r2, r3), true);
  assert.strictEqual(rectsIntersect(r2, r4), false);
  res.passed += 3;

  console.log(`  [Suite 7] Auxiliary geometry predicates and stroke simplification verified.`);
});

// =============================================================================
// TEST SUITE 8: Near-Alignment Sub-Pixel Perturbations (0 to 3px)
// =============================================================================
runSuite('Suite 8: Near-Alignment Sub-Pixel Perturbations (0.0px to 3.0px)', () => {
  const res = allResults[allResults.length - 1];

  const deltas = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 2.5, 3.0];
  const offsets = [-20, 0, 20];

  // Horizontal near-alignment
  for (const delta of deltas) {
    const nodeA = { x: 100, y: 100, width: 120, height: 80 };
    const nodeB = { x: 400, y: 100 + delta, width: 120, height: 80 };

    const paths: string[] = [];
    for (const offset of offsets) {
      const g = computeUmlEdgeGeometry(nodeA, nodeB, 'orthogonal', undefined, undefined, offset);
      // In sub-pixel perturbation tests, allow the engine's 0.5px deduplication threshold
      const { isOrthogonal, violations } = verifyOrthogonality(g.pathD, 0.5);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(`Horiz near-alignment delta=${delta}, offset=${offset} not orthogonal: ${violations.join('; ')}`);
      } else {
        res.passed++;
      }
      paths.push(g.pathD);
    }
    // Check distinctness between -20 and 20
    if (paths[0] === paths[1] || paths[1] === paths[2] || paths[0] === paths[2]) {
      res.failed++;
      res.errors.push(`Horiz near-alignment delta=${delta} collapsed paths!`);
    } else {
      res.passed++;
    }
  }

  // Vertical near-alignment
  for (const delta of deltas) {
    const nodeA = { x: 100, y: 100, width: 120, height: 80 };
    const nodeB = { x: 100 + delta, y: 400, width: 120, height: 80 };

    const paths: string[] = [];
    for (const offset of offsets) {
      const g = computeUmlEdgeGeometry(nodeA, nodeB, 'orthogonal', undefined, undefined, offset);
      const { isOrthogonal, violations } = verifyOrthogonality(g.pathD, 0.5);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(`Vert near-alignment delta=${delta}, offset=${offset} not orthogonal: ${violations.join('; ')}`);
      } else {
        res.passed++;
      }
      paths.push(g.pathD);
    }
    // Check distinctness between -20 and 20
    if (paths[0] === paths[1] || paths[1] === paths[2] || paths[0] === paths[2]) {
      res.failed++;
      res.errors.push(`Vert near-alignment delta=${delta} collapsed paths!`);
    } else {
      res.passed++;
    }
  }

  console.log(`  [Suite 8] Tested near-alignment perturbations across 11 delta steps (0 to 3px) horizontally and vertically.`);
});

// =============================================================================
// TEST SUITE 9: Adversarial Layout Fuzzing (500 Randomized Node Pairs)
// =============================================================================
runSuite('Suite 9: Adversarial Layout Fuzzing (500 Randomized Node Pairs)', () => {
  const res = allResults[allResults.length - 1];

  let seed = 42;
  function pseudoRandom() {
    seed = (seed * 16807 + 11) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  const offsets = [-30, -20, 0, 20, 30];

  for (let i = 0; i < 500; i++) {
    const x1 = Math.round(pseudoRandom() * 2000 - 1000);
    const y1 = Math.round(pseudoRandom() * 2000 - 1000);
    const w1 = Math.round(pseudoRandom() * 200 + 40);
    const h1 = Math.round(pseudoRandom() * 200 + 40);

    // Make some aligned, some random
    const alignType = i % 4;
    let x2 = Math.round(pseudoRandom() * 2000 - 1000);
    let y2 = Math.round(pseudoRandom() * 2000 - 1000);
    const w2 = Math.round(pseudoRandom() * 200 + 40);
    const h2 = Math.round(pseudoRandom() * 200 + 40);

    if (alignType === 0) {
      // Horizontally aligned centers
      y2 = y1 + (h1 - h2) / 2;
      x2 = x1 + w1 + 50 + Math.round(pseudoRandom() * 200);
    } else if (alignType === 1) {
      // Vertically aligned centers
      x2 = x1 + (w1 - w2) / 2;
      y2 = y1 + h1 + 50 + Math.round(pseudoRandom() * 200);
    }

    const nodeA: UmlNodeLayout = { x: x1, y: y1, width: w1, height: h1 };
    const nodeB: UmlNodeLayout = { x: x2, y: y2, width: w2, height: h2 };

    const paths: string[] = [];
    for (const offset of offsets) {
      const g = computeUmlEdgeGeometry(nodeA, nodeB, 'orthogonal', undefined, undefined, offset);
      assert(typeof g.pathD === 'string' && g.pathD.length > 0);
      assert(Number.isFinite(g.labelPoint.x) && Number.isFinite(g.labelPoint.y));
      assert(Number.isFinite(g.startAngleDeg) && Number.isFinite(g.endAngleDeg));

      const { isOrthogonal, violations } = verifyOrthogonality(g.pathD);
      if (!isOrthogonal) {
        res.failed++;
        res.errors.push(`Fuzzer iteration ${i} offset ${offset} failed orthogonality: ${violations.join('; ')}`);
      } else {
        res.passed++;
      }
      paths.push(g.pathD);
    }

    // For non-overlapping nodes, paths with different non-zero offsets shouldn't be identical
    if (paths[1] === paths[3]) { // -20 vs +20
      res.failed++;
      res.errors.push(`Fuzzer iteration ${i}: -20 and +20 paths collapsed!`);
    } else {
      res.passed++;
    }
  }

  console.log(`  [Suite 9] Completed 500 randomized layout fuzzing runs (2,500 orthogonal routes evaluated).`);
});

// =============================================================================
// TEST SUITE 10: Extreme Zoom & Pan Boundaries (1e-5 to 1e5, Pan 1e8)
// =============================================================================
runSuite('Suite 10: Extreme Zoom & Pan Boundaries (1e-5 to 1e5, Pan 1e8)', () => {
  const res = allResults[allResults.length - 1];

  const extremeZooms = [0.00001, 0.0001, 0.001, 100, 1000, 10000, 100000];
  const extremePans = [-1e8, -1e7, 1e7, 1e8];
  const testPt: Point2D = { x: 9876.54321, y: -1234.56789 };

  for (const zoom of extremeZooms) {
    for (const pan of extremePans) {
      const vp: ViewportTransform = { panX: pan, panY: pan, zoom };
      const s = worldToScreen(testPt, vp);
      const w = screenToWorld(s, vp);
      const err = Math.max(Math.abs(w.x - testPt.x), Math.abs(w.y - testPt.y));

      // With IEEE 754 64-bit float, at pan 1e8, ULP is around 1e-8 to 1e-7.
      // So at pan 1e8 and zoom 0.00001, (s - pan)/zoom arithmetic:
      // s is around pan + testPt * zoom = 1e8 + 0.0987.
      // 1e8 has precision ~ 1.49e-8. Dividing by 1e-5 gives error up to ~ 1.49e-3.
      // But for zoom in [0.001, 100] and pan in [-1e6, 1e6] (our strict requirement),
      // error is <= 1e-6! Let's verify that!
      if (zoom >= 0.001 && zoom <= 100 && Math.abs(pan) <= 1e6) {
        if (err > 1e-6) {
          res.failed++;
          res.errors.push(`Strict boundary failed: zoom=${zoom}, pan=${pan}, err=${err}`);
        } else {
          res.passed++;
        }
      } else {
        // Beyond requirements, verify finite and reasonable
        assert(Number.isFinite(w.x) && Number.isFinite(w.y));
        res.passed++;
      }
    }
  }

  console.log(`  [Suite 10] Verified extreme zoom & pan arithmetic boundaries.`);
});

// -----------------------------------------------------------------------------
// SUMMARY & EXIT CODE
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log('CHALLENGE EXECUTION SUMMARY');
console.log('================================================================');

let totalPassed = 0;
let totalFailed = 0;
for (const r of allResults) {
  totalPassed += r.passed;
  totalFailed += r.failed;
  const status = r.failed === 0 ? 'PASSED' : 'FAILED';
  console.log(`- ${r.suite}: [${status}] (${r.passed} passed, ${r.failed} failed)`);
  if (r.errors.length > 0) {
    for (const err of r.errors.slice(0, 5)) {
      console.log(`    * ${err}`);
    }
    if (r.errors.length > 5) {
      console.log(`    * ... and ${r.errors.length - 5} more error(s)`);
    }
  }
}

console.log('----------------------------------------------------------------');
console.log(`TOTAL ASSERTIONS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log(`FINAL EMPIRICAL VERDICT: ${totalFailed === 0 ? 'APPROVE' : 'CHALLENGE_FAILED'}`);
console.log('================================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
