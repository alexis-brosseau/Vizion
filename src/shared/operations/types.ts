import type { JsonMutationPatch, TextSpanEdit } from '../documents/json-patch';
import type {
  EndpointDecoration,
  UmlAttribute,
  UmlEdgeRouting,
  UmlLineStyle,
  UmlNodeLayout,
  UmlOperation,
  UmlRelationKind,
  UmlRoutingKind,
  UmlShapeGeometry
} from '../documents/types';

// ============================================================================
// Granular Operation Payloads
// ============================================================================

export interface UmlUpdateMetadataPayload {
  type: 'uml.updateMetadata';
  title?: string;
  description?: string;
  purpose?: string;
  defaultRouting?: UmlRoutingKind;
}

export interface UmlMigrateDocumentPayload {
  type: 'uml.migrateDocument';
}

export interface UmlAddNodePayload {
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
  children?: string[];
}

export interface UmlUpdateNodePayload {
  type: 'uml.updateNode';
  nodeId: string;
  name?: string;
  stereotype?: string;
  text?: string;
  shape?: UmlShapeGeometry;
  children?: string[];
  line?: 'solid' | 'dashed';
  showAttributes?: boolean;
  showOperations?: boolean;
  attributes?: UmlAttribute[];
  operations?: UmlOperation[];
}

export interface UmlMoveResizeNodesPayload {
  type: 'uml.moveResizeNodes';
  updates: Record<string, UmlNodeLayout>;
  frameChildrenUpdates?: Record<string, string[]>;
}

export interface UmlDeleteEntitiesPayload {
  type: 'uml.deleteEntities';
  nodeIds: string[];
  edgeIds: string[];
}

export interface UmlDuplicateSelectionPayload {
  type: 'uml.duplicateSelection';
  nodeIds: string[];
  edgeIds: string[];
  offsetX?: number;
  offsetY?: number;
  stripCustomData?: boolean;
}

export interface UmlAddEdgePayload {
  type: 'uml.addEdge';
  id: string;
  kind?: UmlRelationKind;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  line?: UmlLineStyle;
  routing?: UmlEdgeRouting;
}

export interface UmlUpdateEdgePayload {
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
  routing?: UmlEdgeRouting;
}

export interface UmlUpdateEndpointPayload {
  type: 'uml.updateEndpoint';
  edgeId: string;
  end: 'start' | 'end';
  decoration: EndpointDecoration;
}

// ============================================================================
// Union & Discriminator Types
// ============================================================================

export type UmlOperationPayload =
  | UmlUpdateMetadataPayload
  | UmlMigrateDocumentPayload
  | UmlAddNodePayload
  | UmlUpdateNodePayload
  | UmlMoveResizeNodesPayload
  | UmlDeleteEntitiesPayload
  | UmlDuplicateSelectionPayload
  | UmlAddEdgePayload
  | UmlUpdateEdgePayload
  | UmlUpdateEndpointPayload;

export type VizionOperationPayload = UmlOperationPayload;

// ============================================================================
// Execution Outputs & Internal Results
// ============================================================================

export interface ApplyOperationOutput {
  ok: boolean;
  error?: string;
  updatedText?: string;
  edits?: TextSpanEdit[];
  createdIds?: string[];
}

export type OperationMutationResult =
  | {
      ok: true;
      patches: JsonMutationPatch[];
      createdIds?: string[];
      error?: never;
    }
  | {
      ok: false;
      error: string;
      patches?: never;
      createdIds?: never;
    };
