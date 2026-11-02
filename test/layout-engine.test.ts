import { describe, expect, it } from 'vitest';
import type { UmlDocument, UmlNode } from '../src/shared/documents/types';
import { computeUmlEdgeGeometry, GRID_SIZE } from '../src/shared/geometry';
import {
  computeContentBounds,
  computeEffectiveLayouts,
  computeFrameChildBounds,
  computeNodeMinSize,
  computeParallelEdgeOffsets
} from '../src/webview/services/layout-engine';
import { computeFrameDragDropUpdates } from '../src/webview/services/frame-containment';

function node(id: string, kind: UmlNode['kind'], patch: Partial<UmlNode> = {}): UmlNode {
  return {
    id,
    kind,
    name: id,
    attributes: [],
    operations: [],
    ...patch
  };
}

function documentWith(nodes: UmlNode[], edges: UmlDocument['edges'] = []): UmlDocument {
  return {
    version: '0.3.0',
    kind: 'uml',
    title: 'Test',
    description: '',
    defaultRouting: 'orthogonal',
    nodes,
    edges,
    layout: {
      nodes: {
        a: { x: 40, y: 40, width: 220, height: 140 },
        b: { x: 300, y: 40, width: 220, height: 140 }
      },
      edges: {}
    }
  } as unknown as UmlDocument;
}

describe('layout engine', () => {
  it('computes deterministic minimum sizes without using the DOM', () => {
    const classNode = node('a', 'class', {
      attributes: [
        { id: 'a1', name: 'id', type: 'string', visibility: '+' },
        { id: 'a2', name: 'name', type: 'string', visibility: '+' }
      ],
      operations: [{ id: 'o1', name: 'save', visibility: '+', parameters: [], returnType: 'void' }]
    });
    const notEditing = computeNodeMinSize(classNode);
    const editing = computeNodeMinSize(classNode, true);

    expect(notEditing.minWidth).toBe(120);
    expect(editing.minWidth).toBe(240);
    expect(notEditing.minHeight % 20).toBe(0);
    expect(editing.minHeight).toBeGreaterThan(notEditing.minHeight);
  });

  it('snaps moved layouts to the grid and preserves sizes', () => {
    const doc = documentWith([node('a', 'class'), node('b', 'class')]);
    const layouts = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, null);
    const moved = computeEffectiveLayouts(
      doc,
      {},
      {
        mode: 'moving_nodes',
        startWorld: { x: 0, y: 0 },
        currentWorld: { x: 13, y: 27 },
        initialLayouts: { a: layouts.a },
        isShift: false
      },
      null
    );

    expect(moved.a.x % 20).toBe(0);
    expect(moved.a.y % 20).toBe(0);
    expect(moved.b).toEqual(layouts.b);
  });

  it('enforces minimum size while resizing', () => {
    const doc = documentWith([node('a', 'class')]);
    const initial = doc.layout.nodes.a;
    const resized = computeEffectiveLayouts(
      doc,
      {},
      {
        mode: 'resizing_node',
        nodeId: 'a',
        handle: 'se',
        startWorld: { x: 0, y: 0 },
        currentWorld: { x: -500, y: -500 },
        initialBox: initial,
        minWidth: 120,
        minHeight: 60
      },
      null
    );

    expect(resized.a.width).toBeGreaterThanOrEqual(120);
    expect(resized.a.height).toBeGreaterThanOrEqual(60);
  });

  it('computes child bounds and content bounds', () => {
    const frame = node('f', 'frame', { children: ['a', 'b'] });
    const layouts = {
      f: { x: 0, y: 0, width: 400, height: 300 },
      a: { x: 40, y: 60, width: 100, height: 80 },
      b: { x: 220, y: 140, width: 120, height: 100 }
    };

    expect(computeFrameChildBounds(frame, layouts)).toEqual({
      minX: 40,
      minY: 60,
      maxX: 340,
      maxY: 240
    });
    expect(computeContentBounds(layouts)).toEqual({ x: 0, y: 0, width: 400, height: 300 });
    expect(computeContentBounds({})).toBeNull();
  });

  it('spreads parallel relations symmetrically', () => {
    const offsets = computeParallelEdgeOffsets([
      { id: 'e1', source: { nodeId: 'a' }, target: { nodeId: 'b' } },
      { id: 'e2', source: { nodeId: 'b' }, target: { nodeId: 'a' } },
      { id: 'e3', source: { nodeId: 'a' }, target: { nodeId: 'c' } }
    ] as never);

    expect(offsets.e1).toBe(-11);
    expect(offsets.e2).toBe(11);
    expect(offsets.e3).toBe(0);
  });

  it('keeps orthogonal routes on the grid and pinned to node borders', () => {
    const geometry = computeUmlEdgeGeometry(
      { x: 20, y: 20, width: 220, height: 140 },
      { x: 420, y: 120, width: 220, height: 140 },
      'orthogonal'
    );
    const coordinates = (geometry.pathD.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

    expect(coordinates.length).toBeGreaterThan(3);
    for (const value of coordinates) {
      expect(Math.abs(value % GRID_SIZE)).toBe(0);
    }
    expect(geometry.startTip.x).toBe(240);
    expect(geometry.endTip.x).toBe(420);
  });

  it('keeps orthogonal routes from shape nodes axis-aligned on grid lines', () => {
    const geometry = computeUmlEdgeGeometry(
      { x: 20, y: 20, width: 220, height: 140 },
      { x: 460, y: 220, width: 220, height: 140 },
      'orthogonal',
      { shape: 'none', size: 10 },
      { shape: 'none', size: 10 },
      0,
      undefined,
      undefined,
      'ellipse'
    );
    const pairs = (geometry.pathD.match(/-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?/g) ?? []).map(
      (pair) => pair.split(/\s+/).map(Number)
    );

    expect(pairs.length).toBeGreaterThan(1);
    for (let index = 0; index < pairs.length - 1; index++) {
      const [x1, y1] = pairs[index];
      const [x2, y2] = pairs[index + 1];
      expect(x1 === x2 || y1 === y2).toBe(true);
      if (y1 === y2) expect(Math.abs(y1 % GRID_SIZE)).toBe(0);
      if (x1 === x2) expect(Math.abs(x1 % GRID_SIZE)).toBe(0);
    }
  });

  it('grows a note minimum height to fit wrapped text without scrolling', () => {
    const note = node('note', 'note', {
      text: 'A long architecture note that wraps across several lines at a narrow width. '.repeat(6)
    });
    const narrow = computeNodeMinSize(note, false, 120);
    const wide = computeNodeMinSize(note, false, 320);

    expect(narrow.minHeight).toBeGreaterThan(wide.minHeight);
    expect(narrow.minHeight).toBeGreaterThanOrEqual(60);
    expect(narrow.minHeight % GRID_SIZE).toBe(0);
  });

  it('raises a note minimum height while it is narrowed during resize', () => {
    const note = node('note', 'note', {
      text: 'A long architecture note that wraps across several lines at a narrow width. '.repeat(6)
    });
    const doc = documentWith([note]);
    doc.layout.nodes.note = { x: 40, y: 40, width: 320, height: 100 };
    const resized = computeEffectiveLayouts(
      doc,
      {},
      {
        mode: 'resizing_node',
        nodeId: 'note',
        handle: 'e',
        startWorld: { x: 0, y: 0 },
        currentWorld: { x: -260, y: 0 },
        initialBox: doc.layout.nodes.note,
        minWidth: 100,
        minHeight: 60
      },
      null
    );

    expect(resized.note.width).toBeLessThan(320);
    expect(resized.note.height).toBeGreaterThan(100);
  });

  it('shrinks a note back down while editing as draft lines are removed', () => {
    const note = node('note', 'note', { text: 'one' });
    const doc = documentWith([note]);
    doc.layout.nodes.note = { x: 40, y: 40, width: 220, height: 140 };

    const manyLines = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, 'note', {
      text: Array.from({ length: 12 }, (_, index) => `line ${index}`).join('\n')
    });
    const fewLines = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, 'note', {
      text: 'one\ntwo'
    });

    expect(fewLines.note.height).toBeLessThan(manyLines.note.height);
    expect(fewLines.note.height).toBe(140);
  });

  it('restores the original node height after inline editing ends', () => {
    const doc = documentWith([node('a', 'class')]);
    doc.layout.nodes.a = { x: 40, y: 40, width: 220, height: 140 };

    const editing = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, 'a', {
      attributes: '',
      operations: ''
    });
    const afterEditing = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, null);

    expect(editing.a.height).toBeGreaterThan(140);
    expect(afterEditing.a.height).toBe(140);
  });

  it('grows the edited node as draft attribute lines are added', () => {
    const doc = documentWith([node('a', 'class')]);
    doc.layout.nodes.a = { x: 40, y: 40, width: 220, height: 140 };
    const before = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, 'a', {
      attributes: '+ id: string',
      operations: ''
    });
    const after = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, 'a', {
      attributes: Array.from({ length: 10 }, (_, index) => `+ field${index}: string`).join('\n'),
      operations: ''
    });

    expect(after.a.height).toBeGreaterThan(before.a.height);
  });

  it('adopts a dropped node into a frame and removes it from the old frame', () => {    const frameA = node('frame-a', 'frame', { children: ['a'] });
    const frameB = node('frame-b', 'frame', { children: [] });
    const doc = documentWith([frameA, frameB, node('a', 'class')]);
    doc.layout.nodes = {
      'frame-a': { x: 0, y: 0, width: 300, height: 260 },
      'frame-b': { x: 500, y: 0, width: 300, height: 260 },
      a: { x: 20, y: 40, width: 220, height: 140 }
    };
    const layouts = computeEffectiveLayouts(doc, {}, { mode: 'idle' }, null);
    const moved = { ...layouts.a, x: 520, y: 40 };
    const result = computeFrameDragDropUpdates(
      doc,
      layouts,
      'a',
      { a: moved },
      { a: layouts.a },
      { x: 560, y: 80 },
      false
    );

    expect(result.childrenUpdates['frame-a']).toEqual([]);
    expect(result.childrenUpdates['frame-b']).toEqual(['a']);
  });
});
