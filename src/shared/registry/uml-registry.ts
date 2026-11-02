import type {
  EndpointDecoration,
  EndpointFillMode,
  EndpointShapeKind,
  UmlEdgeRouting,
  UmlLineStyle,
  UmlRelationKind,
  UmlRoutingKind,
  UmlShapeGeometry
} from '../documents/types';

/**
 * Trusted compiled registries for UML node kinds, relation presets, shape geometries,
 * and endpoint shapes per Section 9.5 & 9.6 of the implementation plan.
 */

export interface EndpointShapeDescriptor {
  kind: EndpointShapeKind;
  label: string;
  description: string;
  supportsFill: boolean;
  defaultFill?: EndpointFillMode;
  defaultSize: number;
  /**
   * How far back from the endpoint tip (as a multiple of size) the edge line should be trimmed
   * so hollow shapes never have the stroke line bleeding through their interior.
   */
  trimMultiplier: number;
  /**
   * Returns local SVG path data where (0,0) is the attachment tip and the edge enters along the -X axis
   * (so local +X points toward the target node, and rotation aligns with the endpoint tangent).
   */
  buildLocalPath: (size: number) => string;
}

export interface UmlNodeKindDescriptor {
  kind: string;
  label: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  hasCompartments: boolean;
  defaultStereotype?: string;
}

export interface UmlRelationPreset {
  kind: UmlRelationKind;
  label: string;
  description: string;
  line: UmlLineStyle;
  routing: UmlEdgeRouting;
  start: EndpointDecoration;
  end: EndpointDecoration;
}

export interface UmlShapeGeometryDescriptor {
  kind: UmlShapeGeometry;
  label: string;
}

export const UML_SHAPE_GEOMETRIES: UmlShapeGeometryDescriptor[] = [
  { kind: 'ellipse', label: 'Ellipse' },
  { kind: 'rectangle', label: 'Rectangle' },
  { kind: 'rhombus', label: 'Rhombus' },
  { kind: 'trapezoid', label: 'Trapezoid' },
  { kind: 'parallelogram', label: 'Parallelogram' }
];

const endpointShapeRegistry = new Map<string, EndpointShapeDescriptor>();
const nodeKindRegistry = new Map<string, UmlNodeKindDescriptor>();
const relationPresetRegistry = new Map<UmlRelationKind, UmlRelationPreset>();

export function registerEndpointShape(descriptor: EndpointShapeDescriptor): void {
  endpointShapeRegistry.set(descriptor.kind, descriptor);
}

export function getEndpointShape(kind: string): EndpointShapeDescriptor | undefined {
  return endpointShapeRegistry.get(kind);
}

export function listEndpointShapes(): EndpointShapeDescriptor[] {
  return Array.from(endpointShapeRegistry.values());
}

export function registerUmlNodeKind(descriptor: UmlNodeKindDescriptor): void {
  nodeKindRegistry.set(descriptor.kind, descriptor);
}

export function getUmlNodeKind(kind: string): UmlNodeKindDescriptor | undefined {
  return nodeKindRegistry.get(kind);
}

export function listUmlNodeKinds(): UmlNodeKindDescriptor[] {
  return Array.from(nodeKindRegistry.values());
}

export function registerUmlRelationPreset(preset: UmlRelationPreset): void {
  relationPresetRegistry.set(preset.kind, preset);
}

export function getUmlRelationPreset(kind: UmlRelationKind): UmlRelationPreset | undefined {
  if (kind === 'none') {
    return relationPresetRegistry.get('other');
  }
  return relationPresetRegistry.get(kind);
}

export function listUmlRelationPresets(): UmlRelationPreset[] {
  return Array.from(relationPresetRegistry.values());
}

/**
 * Detects whether an edge's visual styling matches a built-in semantic UML relation kind.
 * Returns null if the visual properties do not match any built-in semantic relation.
 */
export function detectMatchingRelationPreset(
  line: string | undefined,
  start: EndpointDecoration | undefined,
  end: EndpointDecoration | undefined
): UmlRelationKind | null {
  const isDashed = line === 'dashed';
  const startShape = start?.shape ?? 'none';
  const startFill = start?.fill ?? 'hollow';
  const endShape = end?.shape ?? 'none';
  const endFill = end?.fill ?? 'hollow';

  if (isDashed && startShape === 'none' && endShape === 'open-arrow') {
    return 'dependency';
  }
  if (isDashed && startShape === 'none' && endShape === 'triangle' && endFill === 'hollow') {
    return 'realization';
  }
  if (!isDashed && startShape === 'none' && endShape === 'triangle' && endFill === 'hollow') {
    return 'generalization';
  }
  if (!isDashed && startShape === 'diamond' && startFill === 'hollow' && endShape === 'none') {
    return 'aggregation';
  }
  if (!isDashed && startShape === 'diamond' && startFill === 'filled' && endShape === 'none') {
    return 'composition';
  }
  const isStartAssoc = startShape === 'none' || startShape === 'open-arrow';
  const isEndAssoc = endShape === 'none' || endShape === 'open-arrow';
  if (!isDashed && isStartAssoc && isEndAssoc) {
    return 'association';
  }
  return null;
}

// ============================================================================
// Built-in Endpoint Shapes (none, circle, diamond, square, triangle, open-arrow)
// ============================================================================

registerEndpointShape({
  kind: 'none',
  label: 'None',
  description: 'Plain line termination with no marker',
  supportsFill: false,
  defaultSize: 10,
  trimMultiplier: 0,
  buildLocalPath: () => ''
});

registerEndpointShape({
  kind: 'circle',
  label: 'Circle',
  description: 'Circular endpoint decoration (hollow or filled)',
  supportsFill: true,
  defaultFill: 'hollow',
  defaultSize: 10,
  trimMultiplier: 1.0,
  buildLocalPath: (size: number) => {
    const r = size / 2;
    // Center at (-r, 0) so tip touches (0, 0) and rear touches (-size, 0)
    return `M 0 0 A ${r} ${r} 0 1 0 -${size} 0 A ${r} ${r} 0 1 0 0 0 Z`;
  }
});

registerEndpointShape({
  kind: 'diamond',
  label: 'Diamond',
  description: 'Diamond endpoint decoration (hollow for aggregation, filled for composition)',
  supportsFill: true,
  defaultFill: 'hollow',
  defaultSize: 13,
  trimMultiplier: 1.0,
  buildLocalPath: (size: number) => {
    const halfLen = size / 2;
    const halfWidth = size * 0.36;
    return `M 0 0 L -${halfLen} -${halfWidth} L -${size} 0 L -${halfLen} ${halfWidth} Z`;
  }
});

registerEndpointShape({
  kind: 'square',
  label: 'Square',
  description: 'Square port/endpoint decoration (hollow or filled)',
  supportsFill: true,
  defaultFill: 'hollow',
  defaultSize: 10,
  trimMultiplier: 1.0,
  buildLocalPath: (size: number) => {
    const half = size / 2;
    return `M 0 -${half} L -${size} -${half} L -${size} ${half} L 0 ${half} Z`;
  }
});

registerEndpointShape({
  kind: 'triangle',
  label: 'Triangle',
  description: 'Closed triangular arrowhead (hollow for generalization/realization, or filled)',
  supportsFill: true,
  defaultFill: 'hollow',
  defaultSize: 12,
  trimMultiplier: 1.0,
  buildLocalPath: (size: number) => {
    const halfWidth = size * 0.48;
    return `M 0 0 L -${size} -${halfWidth} L -${size} ${halfWidth} Z`;
  }
});

registerEndpointShape({
  kind: 'open-arrow',
  label: 'Open Arrow',
  description: 'Open V-shaped navigable arrowhead (stroke only)',
  supportsFill: false,
  defaultSize: 11,
  trimMultiplier: 0.15,
  buildLocalPath: (size: number) => {
    const halfWidth = size * 0.45;
    return `M -${size} -${halfWidth} L 0 0 L -${size} ${halfWidth}`;
  }
});

// ============================================================================
// Built-in UML Node Kinds (class, note, shape)
// ============================================================================

registerUmlNodeKind({
  kind: 'class',
  label: 'Class',
  description: 'Standard UML class with attributes and operations compartments',
  defaultWidth: 240,
  defaultHeight: 140,
  hasCompartments: true
});

registerUmlNodeKind({
  kind: 'note',
  label: 'Note',
  description: 'Free-text UML annotation note with folded corner',
  defaultWidth: 185,
  defaultHeight: 100,
  hasCompartments: false
});

registerUmlNodeKind({
  kind: 'shape',
  label: 'Shape',
  description: 'Geometric shape node with centered label (ellipse, rectangle, rhombus, trapezoid, parallelogram)',
  defaultWidth: 160,
  defaultHeight: 90,
  hasCompartments: false
});

registerUmlNodeKind({
  kind: 'frame',
  label: 'Frame',
  description: 'Container frame with label that automatically encloses contained elements',
  defaultWidth: 260,
  defaultHeight: 180,
  hasCompartments: false
});

// ============================================================================
// Built-in UML Relation Presets
// ============================================================================

registerUmlRelationPreset({
  kind: 'association',
  label: 'Association',
  description: 'Structural link between classes (solid line, no endpoint markers by default)',
  line: 'solid',
  routing: 'default',
  start: { shape: 'none', size: 10 },
  end: { shape: 'none', size: 10 }
});

registerUmlRelationPreset({
  kind: 'dependency',
  label: 'Dependency',
  description: 'Uses/depends-on relationship (dashed line, open arrow at target)',
  line: 'dashed',
  routing: 'default',
  start: { shape: 'none', size: 10 },
  end: { shape: 'open-arrow', size: 11 }
});

registerUmlRelationPreset({
  kind: 'generalization',
  label: 'Generalization (Inheritance)',
  description: 'Subclasses a general classifier (solid line, hollow triangle at target)',
  line: 'solid',
  routing: 'default',
  start: { shape: 'none', size: 10 },
  end: { shape: 'triangle', fill: 'hollow', size: 12 }
});

registerUmlRelationPreset({
  kind: 'realization',
  label: 'Realization (Implements)',
  description: 'Implements a specification contract (dashed line, hollow triangle at target)',
  line: 'dashed',
  routing: 'default',
  start: { shape: 'none', size: 10 },
  end: { shape: 'triangle', fill: 'hollow', size: 12 }
});

registerUmlRelationPreset({
  kind: 'aggregation',
  label: 'Aggregation',
  description: 'Whole-part weak ownership (solid line, hollow diamond at source)',
  line: 'solid',
  routing: 'default',
  start: { shape: 'diamond', fill: 'hollow', size: 13 },
  end: { shape: 'none', size: 10 }
});

registerUmlRelationPreset({
  kind: 'composition',
  label: 'Composition',
  description: 'Whole-part strong lifecycle ownership (solid line, filled diamond at source)',
  line: 'solid',
  routing: 'default',
  start: { shape: 'diamond', fill: 'filled', size: 13 },
  end: { shape: 'none', size: 10 }
});

registerUmlRelationPreset({
  kind: 'other',
  label: 'Other',
  description: 'Generic relation without semantic UML decoration',
  line: 'dashed',
  routing: 'default',
  start: { shape: 'none', size: 10 },
  end: { shape: 'none', size: 10 }
});
