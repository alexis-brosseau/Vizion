# Vizion

Vizion is a native-first VS Code extension that adds a visual editor for ordinary, readable JSON project documents:

- **UML Editor (`*.viz`)**: A custom, extensible Svelte 5 (runes) class-and-relationship canvas with independent endpoint shape/fill customization (`circle`, `diamond`, `square`, `triangle`, `open-arrow`, `none` — hollow or filled).

## Core Design Principles

1. **Ordinary Text Documents**: Every `.viz` file is an ordinary VS Code `TextDocument`. Native Save, Undo/Redo, Split Editor, Git diffs, and "Open as Text" work out of the box.
2. **Version-Tracked & Non-Destructive**: Documents track a root `version` matching the extension version. Unknown fields and user formatting are preserved across visual edits. Non-empty invalid files are never overwritten; they display actionable diagnostics with one-click recovery.
3. **Embedded AI Guidance**: Every initialized file includes concise `ai.purpose`, `ai.interpretation`, and `ai.editingRules` instructions so external coding agents understand how to interpret and safely edit the diagram.

## Architecture

- `src/extension/` — custom editor provider, coordinator, native VS Code flows, export/clipboard services, and commands.
- `src/shared/` — document AST/validation, geometry (routing, intersections, grid math), and surgical JSON operations.
- `src/webview/` — Svelte 5 runes app split into state controllers, canvas layers/nodes/edges, sidebar inspectors, reusable UI primitives, and focused stylesheets.
- `test/` — Vitest coverage for schema, operations, geometry, routing, layout, frame containment, and note sizing.

All interactive document mutations flow through a semantic operation → `WorkspaceEdit` → host snapshot cycle, so VS Code's native undo/redo remains authoritative.

## Development Verification

```bash
npm ci
npm run typecheck   # tsc --noEmit
npm run check       # svelte-check
npm test            # Vitest
npm run build       # extension + webview bundles
npm run package     # vizion-0.3.0.vsix
```

## Installing & Testing in VS Code

### Option A: Install the Packaged `.vsix` Extension
```bash
npm run build
npm run package
code --install-extension vizion-0.3.0.vsix
```

### Option B: Launch the Extension Development Host (`F5`)
1. Open this folder in VS Code.
2. Press **`F5`** (runs `Run Vizion Extension (Development Host)` from `.vscode/launch.json`).
3. Open `.vizion/example.viz` or create any empty `*.viz` file in Explorer.

> If the Extension Development Host aborts with a Node inspector assertion, disable the debugger Network view (`debug.javascript.enableNetworkView: false`) and use `NODE_OPTIONS=--no-experimental-network-inspection`, as configured in this repository's `.vscode` settings.

