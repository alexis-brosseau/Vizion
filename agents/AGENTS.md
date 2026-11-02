# Vizion Agent Guide

This document is the onboarding and maintenance guide for AI agents working on Vizion.
It is intentionally a map, not a replacement for the implementation.

## 1. Read the skills first

Before reading source code, changing files, or proposing a design, read every document in
`agents/skill/`:

- `agents/skill/Front-End Architecture and Functional UX.md`

Apply that guidance relative to the task. In particular:

- Match the existing stack and conventions; do not migrate frameworks or add libraries for preference.
- Keep one authoritative owner per piece of state.
- Prefer derived values over manually synchronized duplicates.
- Add abstractions when they own a real responsibility, not to satisfy a folder diagram.
- Verify with build, type-check, behavioral tests, and targeted manual scenarios. Those are different kinds of evidence.

If a root `skills/` directory exists in the future, read it as well before starting.

## 2. What Vizion is

Vizion is a VS Code extension that provides a visual UML editor for ordinary `.viz` JSON documents.

- The document is a normal VS Code `TextDocument`.
- Visual edits are semantic operations converted into surgical `WorkspaceEdit` ranges.
- VS Code’s native undo/redo is the only undo system.
- Every valid document contains AI guidance (`ai.interpretation`, `ai.editingRules`) so coding agents can implement from the diagram.
- The extension must keep working when the same file is opened as text, split, diffed, or edited externally.

### Non-negotiable invariants

- Preserve the `.viz` schema and referential integrity unless the task explicitly requires a schema change.
- Preserve unknown fields and user formatting where possible; mutations are range-based, not whole-file rewrites.
- Never overwrite invalid non-empty files. Show diagnostics and recovery actions instead.
- Keep all document mutation behind semantic operations; do not mutate the text document directly from the webview.
- Keep VS Code native undo/redo authoritative. Do not add a parallel undo stack.
- Keep drag/resize geometry free of per-frame DOM measurement (`offsetHeight`, `clientHeight`, `getBoundingClientRect`).
- Keep the 20px grid contract for layout and orthogonal routing.
- Keep the extension host as the authority for document content and version.

## 3. Architecture at a glance

```text
VS Code TextDocument
        │
        ▼
Extension host
  activate.ts
  providers/uml-provider.ts
  coordinator/document-coordinator.ts
  coordinator/workspace-edit-pipeline.ts
        │  host.snapshot / host.operationResult / host.command
        ▼
Webview (Svelte 5 runes)
  App.svelte
  state.svelte.ts (facade)
  state/* controllers
  canvas/CanvasViewport.svelte
  sidebar/SidebarContainer.svelte
        │  webview.operation / prompts / undo / export
        ▼
shared operations + geometry
        │
        ▼
WorkspaceEdit → TextDocument → host.snapshot
```

### Data flow for an edit

1. UI action calls `store.dispatchOperation(operation)`.
2. `VizionWebviewStore` sends `webview.operation` with `expectedDocumentVersion`.
3. `DocumentCoordinator` queues the request and `WorkspaceEditPipeline` turns the operation into text-span edits.
4. The extension applies a `WorkspaceEdit` to the `TextDocument`.
5. The coordinator re-validates and broadcasts `host.snapshot`.
6. The webview replaces its authoritative document snapshot and clears optimistic layout state.

If a gesture becomes stale, the host rejects it and the webview surfaces `staleNotice`.

### State ownership

| State | Owner | Notes |
|---|---|---|
| Document content, document version | Extension host `TextDocument` / `DocumentCoordinator` | Never make the webview the authority |
| Optimistic node layout | `VizionWebviewStore.optimisticUmlLayouts` | Temporary, until snapshot ACK |
| Camera (pan/zoom) | `ViewportController` | View-only, not persisted in `.viz` |
| Selection | `SelectionController` + `selection-logic.ts` | Direct edge clicks are authoritative |
| Clipboard | `ClipboardController` | Session-local |
| Gesture state | `GestureStateMachine` | Canvas interaction state |
| Inline editing drafts | `InlineEditController` | Single owner; do not add parallel draft state |
| Persisted node layout | Document `layout.nodes` | Mutated only by `uml.moveResizeNodes` |

## 4. Project structure

```text
src/
  extension/
    activate.ts                     Extension entry point
    extension.ts                    Compatibility shim for the built entry
    commands/                       Command registration and native VS Code commands
    coordinator/                    Document lifecycle, WorkspaceEdit pipeline, export, diagnostics
    documents/                      Compatibility barrels for coordinator/diagnostics/registry
    flows/                          Native Quick Pick / Input Box flows
    providers/                      CustomTextEditorProvider
    webviews/                       Webview HTML/CSP bootstrap
  shared/
    documents/                      AST types, validator, templates, migrations, JSON patch
    geometry/                       Vector math, intersections, routing, stroke, shapes
    operations/                     Operation payloads and JSON mutation handlers
    registry/                       Extensible node kinds, endpoint shapes, relation presets
    messages.ts                     Host ↔ webview IPC contract
  webview/
    App.svelte                      Top-level shell
    main.ts                         Mount + stylesheet imports
    bridge.ts                       acquireVsCodeApi wrapper
    state.svelte.ts                 Public store facade
    state/                          Viewport, selection, clipboard, gesture, inline edit
    services/                       Layout engine, frame containment, exporter, shortcuts, actions
    canvas/                         Viewport, layers, nodes, edges, overlays
    sidebar/                        Outline + inspector panes
    ui/                             Reusable buttons, inputs, menus, layout, popups
    styles/                         Tokens, base, canvas, and focused component styles
test/
  vizion.test.ts                    Core schema/operation/geometry tests
  layout-engine.test.ts             Layout, grid, frame, note sizing tests
  selection-logic.test.ts           Selection coupling tests
scripts/
  build.mjs                         esbuild extension + Svelte webview bundling
schemas/
  uml.schema.json                   JSON schema for `.viz`
.vizion/
  example.viz                      Manual smoke-test document
```

Generated outputs:

- `dist/extension.cjs` — extension host bundle.
- `media/webview.js` / `media/webview.css` — webview bundle.
- `vizion-<version>.vsix` — packaged extension.

Do not edit generated outputs by hand. Run the build.

## 5. Build, test, and package

```bash
npm ci
npm run typecheck     # tsc --noEmit
npm run check         # svelte-check (catches .svelte errors tsc misses)
npm test              # Vitest
npm run build         # dist + media
npm run watch         # rebuild on changes during manual testing
npm run package       # .vsix
```

Recommended order before declaring work complete:

1. `npm run typecheck`
2. `npm run check`
3. `npm test`
4. `npm run build`
5. `npm run package`
6. Manual smoke test in the Extension Development Host when behavior changed.

`npm run check` is required for Svelte files. `tsc` alone does not type-check `.svelte` templates.

### Extension Development Host

Use the `Run Vizion Extension (Development Host)` launch configuration. Open
`.vizion/example.viz` and exercise the changed behavior.

If the extension host aborts with a Node inspector assertion
(`ToggleNetworkTracking`), it is the debugger Network view, not Vizion. Keep
`debug.javascript.enableNetworkView: false` and
`NODE_OPTIONS=--no-experimental-network-inspection` as configured in `.vscode/`.

## 6. How to add features

Work in vertical slices. A feature is not complete when only the UI exists.

### Add a new document operation

1. Add a payload interface to `src/shared/operations/types.ts` and include it in `UmlOperationPayload`.
2. Implement a pure mutation handler in the appropriate `node-operations.ts`, `edge-operations.ts`, or `metadata-operations.ts`.
3. Dispatch it from `src/shared/operations/index.ts`.
4. Keep `expectedDocumentVersion` semantics intact in `messages.ts`.
5. Call it from the webview through `store.dispatchOperation`, never by editing text directly.
6. Add a unit test for the operation/JSON patch behavior.
7. Add manual verification in the Extension Development Host.

### Add a node kind

1. Register it in `src/shared/registry/uml-registry.ts` with `registerUmlNodeKind`.
2. Decide whether it needs a new component under `src/webview/canvas/nodes/` or can reuse `ClassNode`/`NoteNode`/`ShapeNode`.
3. Wire rendering in `CanvasViewport` (kind switch) and inspector selection in `InspectorPane`/`NodeInspector`.
4. Update schema/validation/templates/operations only if the document contract actually changes.
5. Add tests and a manual scenario.

### Add a relation preset or endpoint shape

- Relation presets: `registerUmlRelationPreset` in the registry; the inspector and quick-pick lists consume the registry.
- Endpoint shapes: `registerEndpointShape` in the registry; rendering and export consume the same descriptor.

Do not hard-code a second list in a component.

### Add a command

1. Register the handler in `src/extension/commands/`.
2. Add `contributes.commands` and the relevant `activationEvents` in `package.json`.
3. Add a menu contribution if it should be discoverable from the editor title.
4. Verify it with no active webview panel and with one open.

### Add a UI primitive

Only create one when there is a real consumer. Existing primitives live under
`src/webview/ui/`. Keep behavior contracts explicit: accessible name, disabled/read-only
state, keyboard behavior, focus return, and empty/error states where relevant.

## 7. How to fix bugs

1. Reproduce with a concrete scenario.
2. Identify the state owner and the authoritative path before changing code.
3. Check whether the bug is in shared logic, host coordination, webview state, rendering, or CSS.
4. Prefer a pure helper plus a regression test over a component-only patch.
5. Make the smallest change that preserves unrelated behavior.
6. Run the full verification gate.
7. If the fix changes interaction rules, document the rule in this file.

### Common pitfalls in this codebase

- **Selection coupling:** selecting both endpoint nodes implies their relation, but a direct relation click must not be removed by that inference. `selection-logic.ts` is the authority.
- **Marquee selection:** an entity is selected only when its full bounds are inside the marquee rectangle. Shift+marquee unions the enclosed entities with the existing selection instead of replacing it.
- **Inline editing:** `InlineEditController` owns drafts. Do not reintroduce local draft variables in `CanvasViewport`.
- **Grid routing:** orthogonal routes must be axis-aligned and their segments must lie on 20px grid lines. Shape endpoints must stay on the shape boundary at a snapped grid line.
- **Labels:** relation labels, frame labels, and multiplicity tags are HTML in an overlay transformed with the viewport. Keep their positioning in CSS/inline transform, not in the SVG relations layer.
- **Notes:** minimum height must account for wrapped name and body text at the current width. Do not restore a visible scrollbar for normal content.
- **Shapes:** the hitbox is the SVG shape path, not the bounding rectangle. Selection decoration is a separate non-interactive overlay.
- **Selection borders:** do not change `border-width` on selection; that shifts content. Use color/outline/box-shadow where appropriate.
- **Frame/note borders:** their thicker default borders should not gain an extra solid selection ring.
- **CSS:** global class rules are split across `src/webview/styles/`. Check the cascade order in `main.ts` before adding a new rule. Svelte component `<style>` blocks are scoped; use `:global()` only for classes applied by a parent.
- **Svelte runes:** class fields in `.svelte.ts` are compiled by the custom esbuild plugin. Do not import `.svelte.ts` modules into plain Node/Vitest tests if they use runes; extract pure logic into a normal `.ts` file instead.
- **Host prompts:** flows capture `expectedDocumentVersion`. A document edit while a prompt is open should be rejected as stale, not silently applied.

## 8. Style and code conventions

- TypeScript everywhere; Svelte components use `<script lang="ts">`.
- Svelte 5 runes only (`$state`, `$derived`, `$effect`, `$props`).
- Keep `$derived` pure. Use `$effect` only to synchronize external systems.
- Prefer callback props and explicit data over passing a whole store into a leaf component when practical.
- Keep stable ids for nodes, edges, attributes, operations, and parameters.
- Keep node/edge geometry in `src/shared/geometry/`; keep mutation generation in `src/shared/operations/`.
- Do not hand-edit `dist/`, `media/`, or the `.vsix`.
- Match existing naming and file layout rather than introducing a second pattern.

## 9. Manual verification checklist

Use this when a change touches rendering or interaction. Test with `.vizion/example.viz` and at least one new diagram.

- Open the custom editor; document loads without diagnostics.
- Pan, wheel zoom at cursor, fit content, reset zoom.
- Marquee select, additive select, node/edge coupling, direct edge click.
- Drag/resize nodes and frames; grid snapping; frame adoption/detach.
- Inline edit name, stereotype, attributes, operations, note text, edge label, multiplicity.
- Endpoint circles are clickable for selected relations, including `none` endpoints.
- Orthogonal routes follow the grid and attach to rectangle and shape boundaries.
- Inspector edits every node/edge/document field; read-only mode disables mutation.
- Undo/redo each operation with the webview focused.
- Copy/paste/duplicate/delete.
- Export PNG and copy image.
- Corrupt JSON → ErrorView → recover; empty document → initialize.
- Split editor / open as text / external edit → snapshot reconciliation.

## 10. Definition of done

A change is done when:

- The behavior is implemented in the correct layer, not patched in a component only.
- `npm run typecheck`, `npm run check`, `npm test`, `npm run build`, and `npm run package` pass.
- A regression test exists for non-trivial logic changes.
- The affected manual scenario passes in the Extension Development Host.
- The public `.viz` contract is unchanged unless the task explicitly changed it.
- Generated artifacts are rebuilt, not manually edited.
- This guide is updated if a durable interaction rule or architecture boundary changed.

When in doubt, read the skill under `agents/skill/` again and keep the change scoped to the user’s request.
