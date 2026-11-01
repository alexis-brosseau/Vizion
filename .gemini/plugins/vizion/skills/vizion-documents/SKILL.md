---
name: vizion-documents
description: Author, inspect, and safely edit Vizion UML (*.viz) visual project architecture documents matching extension version without breaking referential integrity.
---

# Vizion Visual Architecture Documents (`*.viz`)

Use this skill whenever creating, reading, or modifying `*.viz` files.

## Mandatory Standalone Structure & Rules

1. **Standalone JSON**: Root required keys: `format` (`"vizion"`), `version` (matching extension version), `kind` (`"uml"`), `title`, `ai`, `nodes`, `edges`, `layout`. Never add `schemaVersion`, `formatVersion`, or `instructionsVersion` fields.
2. **Preserve Embedded AI Guidance**: Always keep `ai.purpose`, `ai.interpretation`, and `ai.editingRules` intact in the file.
3. **Nodes (`nodes[]`)**:
   - `id`: Unique string.
   - `kind`: `"class"` | `"shape"` | `"note"`.
   - `name`: Title/label string.
   - `stereotype`: Optional architectural role string (`"entity"`, `"service"`, `"value"`, `"aggregate"`, `"controller"`). Not used on `"note"` nodes.
   - `shape` (when `kind: "shape"`): `"ellipse"` | `"rectangle"` | `"rhombus"` | `"trapezoid"` | `"parallelogram"`.
   - `attributes`: `[{ id, visibility: "+"|"-"|"#"|"~", name, type }]`.
   - `operations`: `[{ id, visibility: "+"|"-"|"#"|"~", name, signature, returnType, parameters: [{ id, name, type }] }]`.
4. **Edges (`edges[]`)**:
   - `id`: Unique string.
   - `kind`: `"association"` | `"dependency"` | `"generalization"` | `"realization"` | `"aggregation"` | `"composition"`.
   - `source`: `{ nodeId, multiplicity? }`.
   - `target`: `{ nodeId, multiplicity? }`.
   - `visual.start` / `visual.end`: `{ shape: "none"|"circle"|"diamond"|"square"|"triangle"|"open-arrow", fill?: "hollow"|"filled", size?: number }`. Only closed shapes accept `fill`.
5. **Layout (`layout.nodes`)**: Every node in `nodes[]` must have a corresponding `{ x, y, width, height }` in `layout.nodes[nodeId]` aligned to a 20px grid. Atomically delete edges and layout entries when deleting a node.

