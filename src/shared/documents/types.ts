/**
 * Canonical unversioned document types for Vizion (.viz).
 *
 * Per Section 3.2 & 4.1:
 * - Strictly unversioned (`version`, `schemaVersion`, `formatVersion`, `instructionsVersion` are forbidden).
 * - Preserves unknown fields on round-trip via range-based JSON mutations.
 */

export type VizionDocumentKind = 'uml';

export interface EmbeddedAiGuidance {
  purpose: string;
  interpretation: string[];
  editingRules: string[];
  [unknownKey: string]: unknown;
}

// ============================================================================
// UML Document Types (.viz)
// ============================================================================

export type UmlVisibility = '+' | '-' | '#' | '~';

export type UmlShapeGeometry =
  | 'ellipse'
  | 'rectangle'
  | 'rhombus'
  | 'trapezoid'
  | 'parallelogram';

export interface UmlAttribute {
  id: string;
  visibility?: UmlVisibility;
  name: string;
  type?: string;
  [unknownKey: string]: unknown;
}

export interface UmlParameter {
  id: string;
  name: string;
  type?: string;
  [unknownKey: string]: unknown;
}

export interface UmlOperation {
  id: string;
  visibility?: UmlVisibility;
  name: string;
  signature?: string;
  returnType?: string;
  parameters?: UmlParameter[];
  [unknownKey: string]: unknown;
}

export interface UmlNode {
  id: string;
  kind: string;
  name: string;
  stereotype?: string;
  text?: string;
  shape?: UmlShapeGeometry;
  showAttributes?: boolean;
  showOperations?: boolean;
  attributes?: UmlAttribute[];
  operations?: UmlOperation[];
  [unknownKey: string]: unknown;
}

export type UmlRelationKind =
  | 'association'
  | 'dependency'
  | 'generalization'
  | 'realization'
  | 'aggregation'
  | 'composition';

export type EndpointShapeKind =
  | 'none'
  | 'circle'
  | 'diamond'
  | 'square'
  | 'triangle'
  | 'open-arrow'
  | (string & {});

export type EndpointFillMode = 'hollow' | 'filled';

export interface EndpointDecoration {
  shape: EndpointShapeKind;
  fill?: EndpointFillMode;
  size?: number;
  [unknownKey: string]: unknown;
}

export type UmlLineStyle = 'solid' | 'dashed';
export type UmlRoutingKind = 'straight' | 'bezier';

export interface UmlEdgeVisual {
  line?: UmlLineStyle;
  routing?: UmlRoutingKind;
  start?: EndpointDecoration;
  end?: EndpointDecoration;
  [unknownKey: string]: unknown;
}

export interface UmlEdgeAttachment {
  nodeId: string;
  multiplicity?: string;
  [unknownKey: string]: unknown;
}

export interface UmlEdge {
  id: string;
  kind: UmlRelationKind;
  source: UmlEdgeAttachment;
  target: UmlEdgeAttachment;
  label?: string;
  visual?: UmlEdgeVisual;
  [unknownKey: string]: unknown;
}

export interface UmlNodeLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  [unknownKey: string]: unknown;
}

export interface UmlEdgeLayout {
  labelOffset?: {
    dx: number;
    dy: number;
  };
  [unknownKey: string]: unknown;
}

export interface UmlDocument {
  format: 'vizion';
  version?: string;
  kind: 'uml';
  title: string;
  ai: EmbeddedAiGuidance;
  nodes: UmlNode[];
  edges: UmlEdge[];
  layout: {
    nodes: Record<string, UmlNodeLayout>;
    edges: Record<string, UmlEdgeLayout>;
    [unknownKey: string]: unknown;
  };
  [unknownKey: string]: unknown;
}

export type VizionDocument = UmlDocument;

export interface ValidationIssue {
  path: string;
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning';
}
