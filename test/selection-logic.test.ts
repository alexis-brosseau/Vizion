import { describe, expect, it } from 'vitest';
import type { UmlDocument } from '../src/shared/documents/types';
import { selectEntity, syncSelectionEdges } from '../src/webview/state/selection-logic';

const doc = {
  version: '0.3.0',
  kind: 'uml',
  title: 'Selection',
  description: '',
  defaultRouting: 'orthogonal',
  nodes: [
    { id: 'a', kind: 'class', name: 'A', attributes: [], operations: [] },
    { id: 'b', kind: 'class', name: 'B', attributes: [], operations: [] }
  ],
  edges: [
    {
      id: 'e1',
      kind: 'association',
      source: { nodeId: 'a' },
      target: { nodeId: 'b' }
    }
  ],
  layout: { nodes: {}, edges: {} }
} as unknown as UmlDocument;

describe('selection logic', () => {
  it('selects a relation on the first click even when it touches the selected node', () => {
    expect(selectEntity(doc, ['a'], 'e1', false)).toEqual(['e1']);
  });

  it('keeps node/edge coupling when additively selecting a second node', () => {
    expect(selectEntity(doc, ['a'], 'b', true)).toEqual(['a', 'b', 'e1']);
  });

  it('removes incident relations when a node is deselected', () => {
    expect(selectEntity(doc, ['a', 'b', 'e1'], 'a', true)).toEqual(['b']);
  });

  it('supports additive relation selection without dropping the selected node', () => {
    expect(selectEntity(doc, ['a'], 'e1', true)).toEqual(['a', 'e1']);
  });

  it('does not infer edges away during explicit bulk node selection', () => {
    expect(syncSelectionEdges(doc, ['a', 'b'], [])).toEqual(['a', 'b', 'e1']);
  });
});
