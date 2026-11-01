When working with `*.uml.viz` files in this repository:
- Read and obey the embedded `ai.purpose`, `ai.interpretation`, and `ai.editingRules` inside each `.viz` file.
- Never add `version`, `schemaVersion`, `formatVersion`, or `instructionsVersion` fields to `.viz` files.
- Preserve existing entity `id` values and unknown fields when modifying nodes or edges.
- Do not modify application source code merely because a `.viz` diagram changed unless explicitly asked by the user.

