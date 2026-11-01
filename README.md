# Vizion - Visual Editors

Vizion is a native-first VS Code extension that adds two specialized visual editors for ordinary, readable JSON project documents:

- **UML Editor (`*.uml.viz`)**: A custom, extensible Svelte 5 (runes) class-and-relationship canvas with independent endpoint shape/fill customization (`circle`, `diamond`, `square`, `triangle`, `open-arrow`, `none` — hollow or filled).

## Core Design Principles

1. **Ordinary Text Documents**: Every `.uml.viz` and `.sketch.viz` file is an ordinary VS Code `TextDocument`. Native Save, Undo/Redo, Split Editor, Git diffs, and "Open as Text" work out of the box.
2. **Unversioned & Non-Destructive**: Documents contain zero `version` or `schemaVersion` fields. Unknown fields and user formatting are preserved across visual edits. Non-empty invalid files are never overwritten; they display actionable diagnostics with one-click recovery.
3. **Embedded AI Guidance**: Every initialized file includes concise `ai.purpose`, `ai.interpretation`, and `ai.editingRules` instructions so external coding agents understand how to interpret and safely edit the diagram.

## Installing & Testing in VS Code

### Option A: Install the Packaged `.vsix` Extension
```bash
npm run build
npm run package
code --install-extension vizion-0.1.0.vsix
```

### Option B: Launch the Extension Development Host (`F5`)
1. Open this folder in VS Code.
2. Press **`F5`** (runs `Run Vizion Extension (Development Host)` from `.vscode/launch.json`).
3. Open `.vizion/architecture/domain.uml.viz` or `.vizion/ideas/onboarding.sketch.viz`, or create any empty `*.uml.viz` / `*.sketch.viz` file in Explorer.

