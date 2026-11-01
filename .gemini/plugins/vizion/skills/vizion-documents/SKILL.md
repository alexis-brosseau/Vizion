---
name: vizion-documents
description: Author, inspect, and safely edit Vizion UML (*.viz) visual project architecture documents without introducing version fields or breaking referential integrity.
---

# Vizion Visual Architecture Documents (`*.viz`)

Use this skill whenever creating, reading, or modifying `*.viz` files.

## Mandatory Standalone Structure & Rules

1. **Unversioned Standalone JSON**: Never add `version`, `schemaVersion`, `formatVersion`, or `instructionsVersion` fields to `.viz` documents. Root required keys: `format` (`"vizion"`), `kind` (`"uml"`), `title`, `ai`, `nodes`, `edges`, `layout`.
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

