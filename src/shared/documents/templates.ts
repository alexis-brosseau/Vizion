import type { UmlDocument, VizionDocumentKind } from './types';
import { EXTENSION_VERSION } from './version';

/**
 * Extracts a clean human-readable title from a filename or URI path.
 */
export function deriveDefaultTitle(filenameOrPath: string, _kind: VizionDocumentKind = 'uml'): string {
  const base = filenameOrPath.split(/[\\/]/).pop() ?? '';
  const stripped = base
    .replace(/\.uml\.viz$/i, '')
    .replace(/\.viz$/i, '')
    .trim();

  if (!stripped) {
    return 'Domain';
  }

  // Convert kebab-case or snake_case into Title Case words
  return stripped
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generates the unversioned default UML document per Section 4.1 of the implementation plan.
 */
export function createDefaultUmlDocument(
  title = 'Domain',
  version = EXTENSION_VERSION
): UmlDocument {
  return {
    format: 'vizion',
    version,
    kind: 'uml',
    title: title || 'Domain',
    description: 'Describe classes, notes, shapes, frames, and explicitly typed relationships.',
    ai: {
      interpretation: [
        'Document Structure: JSON document with schema version tracking. Root fields are: "format" ("vizion"), "version" (matching extension version), "kind" ("uml"), "title" (string), "description" (optional/recommended string describing diagram context), "defaultRouting" ("orthogonal" | "straight" | "bezier"), "ai" (guidance object with "interpretation", "editingRules"), "nodes" (array), "edges" (array), and "layout" (object with "nodes" and "edges").',
        'Node Types & Properties ("nodes[]"): Each node must have "id" (unique string) and "kind" ("class" | "shape" | "note" | "frame"). Optional common fields: "name" (display label string), "stereotype" (architectural role string, e.g. "entity", "service", "value", "aggregate", "controller"). For "note" nodes, prose is stored in "text" (markdown/plain text).',
        'Frame Containers ("kind": "frame"): Visual container grouping enclosed elements with semi-transparent background. The label floats above the top-left corner. Contained element node IDs are listed in "children". Contained elements move together with the frame. An element is added to a frame when dragged into it with the cursor over the frame, which auto-resizes the frame to fit it. Dragging an element already inside the frame does not auto-resize the frame unless Shift is held (allowing elements to be dragged out of the frame). If the cursor is not over the frame, the element can overlap without being inside. Relations can enter and leave frames and are rendered on top of the frame. Frames cannot have relations of their own.',
        'Geometric Shapes ("kind": "shape"): Must specify "shape" geometry as one of: "ellipse" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram". The node "name" is rendered as the centered label.',
        'Class Members & Compartments ("kind": "class"): Supports "attributes" array and "operations" array. Section visibility can be toggled via boolean flags "showAttributes" and "showOperations" (default true).',
        'Attributes Format: Each attribute object requires "id" (unique string), "visibility" (one of: "+" [public], "-" [private], "#" [protected], "~" [package/internal]), "name" (string), and "type" (type string e.g. "string", "number", "Date").',
        'Operations Format: Each operation object requires "id" (unique string), "visibility" ("+" | "-" | "#" | "~"), "name" (method name string), "returnType" (return type string, e.g. "void", "Promise<T>", "boolean"), "signature" (e.g. "(id: string, count: number)"), and "parameters" array of argument objects ({ "id": string, "name": string, "type": string }).',
        'Relationships ("edges[]"): Defines connections between nodes. Required fields: "id" (unique string), "kind" (relationship semantic type: "association" | "dependency" | "generalization" | "realization" | "aggregation" | "composition"), "source" ({ "nodeId": string, "multiplicity"?: string }), and "target" ({ "nodeId": string, "multiplicity"?: string }). Optional "label" (string rendered at midpoint). Frames cannot be endpoints for edges.',
        'Endpoint Multiplicities: Expressed as cardinality strings on endpoints: "source.multiplicity" and "target.multiplicity" (e.g. "1", "*", "0..1", "1..*", "0..n", or omit/empty if none).',
        'Visual Presentation ("edge.visual"): Optional visual options: "line" ("solid" | "dashed"), "routing" ("straight" | "bezier" | "orthogonal"), and endpoint decorations "start" / "end" ({ "shape": "none" | "circle" | "diamond" | "square" | "triangle" | "open-arrow", "fill"?: "hollow" | "filled", "size"?: number }). Only closed shapes support "fill". Standard semantic defaults: generalization = hollow triangle end; realization = dashed with hollow triangle end; aggregation = hollow diamond start; composition = filled diamond start; dependency = dashed with open-arrow end; association = solid line with none ends.',
        'Canvas Layout ("layout.nodes"): Bounding box for every node keyed by nodeId: { "x": number, "y": number, "width": number, "height": number }. Coordinates snap to a 20px grid (multiples of 20). Width >= 100, height >= 60 for classes; width >= 80, height >= 50 for shapes; width >= 120, height >= 60 for notes; width >= 160, height >= 100 for frames.',
        'Architectural Model Scope: This diagram is a selective architectural view. Absence of elements or relationships does not imply absence in the underlying implementation code.'
      ],
      editingRules: [
        'Strict JSON Conformity: Output strictly valid standard JSON with 2-space indentation. Never use JavaScript comments, trailing commas, single quotes, or unquoted identifiers.',
        'Document Versioning: The root "version" field must match the Vizion extension version. Do NOT output alternate version fields like "schemaVersion", "formatVersion", or "instructionsVersion".',
        'Referential Integrity: Every "source.nodeId" and "target.nodeId" in "edges[]" MUST exactly match an existing node "id" in "nodes[]", and cannot reference a "frame" node. When removing a node from "nodes[]", you must atomically delete all edges referencing its ID.',
        'Frame Containment & Integrity: Frame nodes cannot have edges of their own. Every node listed in a frame\'s "children" MUST exist in "nodes[]". Elements can overlap a frame without being in its children; a node is only contained in a frame if listed in its "children", which happens when an element is dragged into the frame with the cursor hovering over it.',
        'Layout Synchronization: Every node added to "nodes[]" MUST have a corresponding bounding box in "layout.nodes[nodeId]" ({ "x": number, "y": number, "width": number, "height": number }) aligned to a 20px grid. When deleting a node, delete its layout entry.',
        'Node Spacing: Node elements MUST be separated by at least 10 grid cells (200px) edge-to-edge. Never place nodes closer than 10 grid cells horizontally or vertically. Overlapping or tightly packed nodes make the diagram unreadable; leave generous whitespace between unrelated nodes and between frames.',
        'Preserve Existing Identifiers: Never alter existing "id" strings when updating nodes, edges, attributes, operations, or parameters. When creating new entities, generate clean, unique kebab-case IDs (e.g., "node-order-service", "edge-order-payment-1", "order-attr-status", "order-op-cancel", "cancel-arg-reason").',
        'Allowed Enums & Data Values: Strictly use only documented enum values — node kinds: "class"|"shape"|"note"|"frame"; shapes: "ellipse"|"rectangle"|"rhombus"|"trapezoid"|"parallelogram"; edge kinds: "association"|"dependency"|"generalization"|"realization"|"aggregation"|"composition"; visibilities: "+"|"-"|"#"|"~"; endpoint shapes: "none"|"circle"|"diamond"|"square"|"triangle"|"open-arrow"; fills: "hollow"|"filled".',
        'Preserve Unknown & Custom Fields: Preserve all unrecognized top-level and nested properties, annotations, extension keys, and this "ai" section intact across edits.',
        'Non-Interference with Source Code: Do not modify repository application source code when asked to edit this architecture diagram, unless the user explicitly requests code changes.'
      ]
    },
    defaultRouting: 'orthogonal',
    nodes: [],
    edges: [],
    layout: {
      nodes: {},
      edges: {}
    }
  };
}

/**
 * Serializes a newly initialized default document with clean 2-space indentation.
 */
export function serializeDefaultDocument(kind: VizionDocumentKind, filenameOrPath: string): string {
  const title = deriveDefaultTitle(filenameOrPath, kind);
  const doc = createDefaultUmlDocument(title);
  return JSON.stringify(doc, null, 2) + '\n';
}

/**
 * Checks whether a document text is empty or whitespace-only (including optional UTF-8 BOM).
 * Note: `{}`, `null`, `[]`, and JSON strings are NOT empty.
 */
export function isEmptyOrWhitespaceDocument(text: string): boolean {
  const withoutBom = text.replace(/^\uFEFF/, '');
  return withoutBom.trim().length === 0;
}
