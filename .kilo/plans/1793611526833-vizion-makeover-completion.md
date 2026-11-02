# Vizion Makeover Completion Plan

## Status Snapshot

| Milestone | Scope | Current state |
|---|---|---|
| M1 | Shared geometry + operations modularization | **DONE**. Barrel files exist; 24 tests reportedly pass. |
| M2 | Extension host coordinator, export service, native flows | **CODE PRESENT, GATE NEVER COMPLETED**. All files exist and are wired, but the verification subagents stopped when quota was exhausted. Several real defects remain (below). |
| M3 | Webview state, services, UI primitives, styles | **NOT STARTED**. `state.svelte.ts` is still a 426-line facade; `styles.css` is still global. |
| M4 | Node + edge component system | **NOT STARTED**. `UmlCanvas.svelte` still contains all markup (3,686 lines). |
| M5 | Canvas assembly, inspector split, legacy removal | **NOT STARTED**. `UmlInspector.svelte` (701 lines) and `styles.css` (1,861 lines) still live. |
| M6 | E2E verification, performance, packaging | **NOT STARTED**. |

### Evidence from the interrupted run

- `.agents/teamwork/orchestrator/GATE_STATUS.md` shows all five M2 gate agents as `PENDING`.
- `.agents/teamwork/m2_*_r2/progress.md` shows every gate agent stopped at initialization/reading.
- `m2_worker_1/handoff.md` claims clean build/tests, but the gate never independently verified it.

## Defects To Fix Before New Work

These are concrete problems found in the current tree, not speculative risks.

1. **`npm ci` / clean build is broken.**
   - `package.json` does not declare `esbuild-svelte`, but `scripts/build.mjs` imports it.
   - `package-lock.json` root declares `esbuild-svelte`, `svelte-check`, `@sveltejs/vite-plugin-svelte@^5`, and newer `@types/*`, `typescript`, `vitest` versions; `package.json` disagrees and is missing several.
   - It currently builds only because `node_modules` already contains the package.
   - Fix: align `package.json` with the build/test tooling, remove the unused Vite plugin if it is not needed, then regenerate the lockfile with `npm install` and verify `npm ci`.

2. **`VizionWebviewStore.setStatusMessage()` is missing.**
   - Used at `src/webview/uml/UmlCanvas.svelte:2583, 2601, 2612, 2616, 2624, 2638`.
   - `src/webview/state.svelte.ts:75` defines only the `statusMessage` state field.
   - Today, export/clipboard actions throw `TypeError: store.setStatusMessage is not a function`.
   - `tsc --noEmit` does not catch this because it does not type-check `.svelte` files. This is why `svelte-check` must be added to the verification gate.

3. **Undefined context-menu action in the canvas.**
   - `src/webview/uml/UmlCanvas.svelte:1506` calls `addNodeInterfaceInline(node)`, which is not defined anywhere.
   - Clicking “Add Interface Endpoint” throws. Either implement a real operation or remove the menu entry. Recommended: remove it; there is no document operation for interface endpoints today.

4. **`staleNotice` is set but never shown.**
   - `state.svelte.ts` sets `staleNotice` on stale rejection, but `App.svelte` only renders `statusMessage`.
   - Surface it as a dismissible warning banner so users understand why a gesture was rejected.

5. **New host commands are registered but not contributed.**
   - `src/extension/commands/canvas-commands.ts` registers `vizion.addNode`, `vizion.addRelation`, and `vizion.renameEntity`.
   - `package.json` contributes neither the commands nor their activation events, so they are unreachable from the Command Palette until the editor is already active.
   - Add `contributes.commands`, `activationEvents`, and (optionally) editor title menu entries, or stop registering them.

6. **M2 needs a real gate.**
   - Re-run build/test/typecheck/package after the fixes.
   - Smoke-test in the Extension Development Host: open `.vizion/example.viz`, add/move/resize/connect, undo/redo, export PNG, copy image, break JSON, recover.
   - Confirm `WorkspaceEdit` produces one native undo entry per operation and that `webview.undo`/`webview.redo` still work when the webview has focus.

## Invariants (Do Not Break)

- `.viz` JSON schema, referential integrity rules, 20px grid, and `ai.interpretation` / `ai.editingRules` stay backward compatible.
- The 24 existing tests in `test/vizion.test.ts` must pass without modification.
- All document mutations continue to flow through `dispatchOperation` → `webview.operation` → `WorkspaceEditPipeline.applyOperation` → authoritative `host.snapshot`.
- Native VS Code undo/redo stays authoritative. No custom undo/redo stacks.
- Drag/resize paths must not read `offsetHeight`, `clientHeight`, or `getBoundingClientRect` per frame. Viewport/root measurement is allowed only on gesture start or fit.
- VS Code theme variables remain the source of color truth.

## Approach Decisions

1. **Behavior-preserving decomposition first, polish second.** Port existing logic and markup, verify parity, then improve. Do not redesign interactions while extracting.
2. **Keep `VizionWebviewStore` as the public facade.** Split internals into controllers, then forward the existing public members/getters. This avoids rewriting every call site at once and keeps `UmlCanvas` working during the migration.
3. **Extract incrementally inside the monolith.** Move a helper to a service, call the service from `UmlCanvas`, verify; then replace markup in place. Avoid a big-bang rewrite of 3,686 lines.
4. **Keep `styles.css` until M5 parity.** Add `tokens.css` / `base.css` / `canvas.css` first, then move component rules and delete the old file only after a class-by-class audit.
5. **Use the real existing flow layout.** Flows live in `src/extension/flows/` (not `src/extension/coordinator/flows/`). Keep that layout to avoid churn; update docs/contracts accordingly.
6. **Webview clipboard first, host fallback second.** The canvas already tries `navigator.clipboard.write` and falls back to `webview.copyImageToClipboard`. Keep that; do not make external Linux binaries the primary path.
7. **Add real Svelte type-checking.** Add `svelte-check` and a `check` script. Use it in every phase gate; keep `tsc --noEmit` too.

---

## Phase 0 — Repair M2 and Establish a Clean Baseline

### Tasks

1. **Fix `package.json`.**
   - Add `esbuild-svelte` to `devDependencies` (build script requires it).
   - Add `svelte-check` to `devDependencies`.
   - Remove `@sveltejs/vite-plugin-svelte` if nothing imports it (currently nothing does).
   - Add `"check": "svelte-check --tsconfig ./tsconfig.json"`.
   - Align versions with the lockfile rather than downgrading the lock:
     - `@types/node` / `@types/vscode` / `typescript` / `vitest` / `svelte` as already installed.
   - Move `jsonc-parser` to the section the lockfile expects (or regenerate the lock; do not hand-edit both inconsistently).
   - Run `npm install` to regenerate `package-lock.json`; then verify `npm ci` in a clean copy or after removing `node_modules` locally.

2. **Add `setStatusMessage(message: string | null)` to the store** and use it consistently. Keep `statusMessage` public for `App.svelte`.

3. **Remove the undefined “Add Interface Endpoint” menu item** at `UmlCanvas.svelte:1505-1507`. If product intent is to keep it, add a real operation and document schema impact; default recommendation is removal.

4. **Surface `staleNotice`.** Render it in `App.svelte` as a dismissible warning banner (or fold it into the existing status banner with warning styling). Clear it when a new successful snapshot arrives.

5. **Contribute the new commands** in `package.json`:
   - `vizion.addNode`, `vizion.addRelation`, `vizion.renameEntity`.
   - Add activation events and `editor/title` or `commandPalette` menu entries gated on `activeCustomEditorId == 'vizion.uml'`.

6. **Run the M2 gate and record results.**
   - `npm run typecheck`, `npm run check`, `npm test`, `npm run build`, `npm run package`.
   - Manual smoke test in the Extension Development Host.
   - Update `.agents/teamwork/orchestrator/GATE_STATUS.md` and `PROJECT.md` M2 status to reflect the verified result.

### Acceptance

- `npm ci` succeeds from the committed manifest/lock.
- No undefined action or missing store method remains.
- Existing 24 tests pass.
- `npm run check` passes or has only pre-existing warnings documented for M5.
- Extension packages and opens `.vizion/example.viz`.

---

## Phase 1 (M3) — Webview State, Services, UI Primitives, Styles

### 1. State controllers (`src/webview/state/`)

Create Svelte 5 rune modules and compose them into the existing store facade.

- `viewport.svelte.ts` — `ViewportController`
  - Owns `panX`, `panY`, `zoom`.
  - Methods: `setViewport`, `resetZoom`, `fitContent(bounds, viewportSize)`, `zoomAt(cursor, factor)`, `panBy`.
  - Keep current clamps (0.2–3.0) and rounding behavior.
- `selection.svelte.ts` — `SelectionController`
  - Owns `selectedIds`.
  - Move `syncSelectionEdges` logic here (node/edge coupling).
  - Methods: `selectSingle`, `setSelectedIds`, `clearSelection`, `toggle`.
- `clipboard.svelte.ts` — `ClipboardController`
  - Owns copied node/edge ids, kind, paste count.
  - `copy(doc, selectedIds)`, `nextPasteOffset()`, `reset()`.
- `gesture-machine.svelte.ts` — `GestureStateMachine`
  - Pure discriminated union:
    ```ts
    type GestureState =
      | { mode: 'idle' }
      | { mode: 'panning'; startScreen: Point2D; initialPan: Point2D }
      | { mode: 'marquee'; startWorld: Point2D; currentWorld: Point2D }
      | { mode: 'moving_nodes'; startWorld: Point2D; currentWorld: Point2D; initialLayouts: Record<string, UmlNodeLayout>; clickedNodeId?: string; isShift: boolean }
      | { mode: 'resizing_node'; nodeId: string; handle: 'n'|'s'|'e'|'w'|'nw'|'ne'|'sw'|'se'; startWorld: Point2D; currentWorld: Point2D; initialBox: UmlNodeLayout; minWidth: number; minHeight: number; childBounds?: Bounds }
      | { mode: 'connecting_edge'; sourceNodeId: string; startPoint: Point2D; currentWorld: Point2D };
    ```
  - Methods: `startPan`, `startMarquee`, `startMove`, `startResize`, `startConnect`, `updatePoint`, `setShift`, `end`, `cancel`.
  - Must not own derived layouts or dispatch operations.
- `inline-edit.svelte.ts` — `InlineEditController`
  - Replaces the seven competing draft variables and the JSON-string comparison effect.
  - One discriminated state: `{ mode: 'none' } | { mode: 'node'; nodeId; drafts: {name, stereotype, text, attributes, operations} } | { mode: 'edgeLabel'; edgeId; draft } | { mode: 'multiplicity'; edgeId; end; draft } | { mode: 'endpointPopup'; ... }`.
  - Methods: `beginNode`, `beginEdgeLabel`, `beginMultiplicity`, `beginEndpointPopup`, `commit`, `cancel`, `syncFromDocument(doc)`.
  - Only resync from the document when the edited entity id changes or the session begins; do not compare serialized JSON every render.
- `webview-store.svelte.ts` — `VizionWebviewStore`
  - Keep document snapshot fields, host message handling, `dispatchOperation`, `triggerUndo`/`triggerRedo`, quick-create, context menu, sidebar sizes.
  - Compose the controllers above.
  - Preserve public getters used by existing components (`umlDoc`, `selectedIds`, `viewport`, `optimisticUmlLayouts`, `clipboard`, etc.).
  - `state.svelte.ts` becomes a compatibility re-export of the new store and its public types (`ContextMenuItem`, `ViewportTransform`, `ClipboardState`).

### 2. Services (`src/webview/services/`)

- `layout-engine.ts`
  - `computeNodeMinSize(node, isEditing)` using the deterministic heuristic from the approved plan; remove DOM traversal.
  - `computeEffectiveLayouts(doc, optimistic, gesture, inlineEditing)` preserving current behavior: grid snapping, move offsets, resize clamping, child bounds, frame expansion during inline edit.
  - `computeFrameChildBounds(nodes, layouts, frame)`.
  - `computeParallelEdgeOffsets(edges)`.
  - `computeContentBounds(layouts)` for fit-to-content.
- `frame-containment.ts`
  - Move `getFrameDragDropUpdates` verbatim first.
  - Extract `expandFrameForChildren` and `detectContainment` helpers.
- `diagram-exporter.ts`
  - Move `renderDiagramToCanvas` and `renderEndpointPath`/shape path helpers as needed.
  - Expose `renderDiagramToCanvas(doc, layouts, theme)` and `exportPng` / `exportToClipboard`.
  - Keep `navigator.clipboard.write` primary and host fallback.
- `shortcut-manager.ts`
  - Map key events to semantic commands: undo, redo, copy, paste, paste-as-new, duplicate, delete, fit, reset, zoom, quick-create.
  - Preserve the “typing in input/textarea/select suppresses canvas shortcuts” rule.
  - Return `{ handled: boolean; command?: ... }` so `CanvasViewport` stays declarative.

### 3. UI primitives (`src/webview/ui/`)

Create only primitives with real consumers:

- `button/Button.svelte`, `button/IconButton.svelte` — replace `.vz-btn`, `.vz-icon-btn`, `.vz-tool-btn` usages.
- `input/TextInput.svelte`, `input/TextArea.svelte` (auto-grow), `input/SearchInput.svelte` — used by inspectors and outline.
- `layout/Splitter.svelte` — vertical sidebar width and horizontal outline/inspector ratio; keyboard arrow support.
- `layout/Banner.svelte` — status/stale/read-only banners.
- `layout/ReadonlyBar.svelte` — wraps the current read-only bar.
- `popup/EndpointPickerPopup.svelte` — move the endpoint popup markup and geometry.
- Move `common/ContextMenu.svelte` → `ui/menu/ContextMenu.svelte` and `common/VisibilityPicker.svelte` → `ui/menu/VisibilityPicker.svelte`; update imports. Keep the same behavior (submenu clamping, keyboard Escape, backdrop).

Each primitive gets an explicit props contract and accessible name; do not create speculative components with no consumer.

### 4. Styles (`src/webview/styles/`)

- `tokens.css`: non-color tokens (grid size, node radii, z-index layers, spacing, font sizes) plus semantic aliases to VS Code variables.
- `base.css`: reset, typography, scrollbars, focus-visible rings, shared form-control baseline.
- `canvas.css`: workspace/split/layer positioning, viewport grid, world transforms, z-index ordering.
- Update `main.ts` to import `tokens.css`, `base.css`, `canvas.css` **in addition to** the legacy `styles.css` during the transition.
- Document the intended z-order: grid → frames HTML → relations SVG → nodes HTML → foreground interaction SVG → floating editors/popups → context menu.

### Acceptance

- New controllers compile as `.svelte.ts` modules.
- Store public API is unchanged for existing callers.
- No behavioral change in `UmlCanvas`/`UmlInspector` yet.
- `npm run build`, `npm run typecheck`, `npm run check`, `npm test` pass.

---

## Phase 2 (M4) — Node and Edge Component System

### Node components (`src/webview/canvas/nodes/`)

Port markup and styles from `UmlCanvas.svelte` without redesign.

- `parts/NodeHeader.svelte` — stereotype + title, inline name/stereotype editing.
- `parts/NodeCompartment.svelte` — attributes/operations view + inline textarea editing + visibility toggle.
- `parts/ResizeHandles.svelte` — 8-direction handles, read-only aware.
- `parts/ConnectPorts.svelte` — right-edge connect port.
- `ClassNode.svelte` — header + two compartments.
- `NoteNode.svelte` — folded-corner card + prose editing.
- `ShapeNode.svelte` — SVG geometry path + centered name.
- `FrameNode.svelte` — background container, 4 edge hit zones, label group, selected SE handle, dashed line.

Use one shared props contract for cards:
```ts
{
  node, box, selected, readOnly, inlineEdit, layout,
  onPointerDown, onContextMenu, onDoubleClick,
  onResizeStart, onConnectStart,
  onToggleCompartment, onInlineDraftChange, onInlineCommit, onInlineCancel
}
```
Keep accessibility attributes (`role`, `tabindex`, `aria-label`) from the current markup.

Move `buildShapeSvgPath` into `src/shared/geometry/` (for example `shapes.ts` or `intersections.ts`) so both `ShapeNode` and the exporter use one implementation.

### Edge components (`src/webview/canvas/edges/`)

- `UmlEdgeRenderer.svelte` — accepts edge, source/target nodes and boxes, routing, parallel offset; computes geometry once via a `$derived` and passes to children.
- `EdgePath.svelte` — visible path + 16px transparent hit path; dashed/solid.
- `EdgeMarker.svelte` — start/end marker using `getEndpointShape().buildLocalPath`; fill mode.
- `EdgeLabel.svelte` — midpoint label with background rect; select/double-click callbacks.
- `MultiplicityTag.svelte` — source/target multiplicity positioned with `getMultiplicityLabelPoint`.

Centralize edge geometry in one derived map keyed by edge id so `RelationsLayer` and foreground endpoint selectors do not recompute the same geometry twice.

### Tests

Add pure-function tests (new file, existing tests untouched) for:
- `computeNodeMinSize` across class/note/shape/frame and editing states.
- `computeEffectiveLayouts` for moves, resize clamping, and frame expansion.
- `computeFrameDragDropUpdates` for adopt/detach/auto-resize.
- `computeParallelEdgeOffsets`.
- `computeContentBounds` and fit calculation.

### Acceptance

- Components render the same DOM/class structure as the legacy canvas (allowing class renames only if CSS is updated in the same change).
- No `offsetHeight` / per-frame DOM reads in layout math.
- New tests pass; existing tests untouched.

---

## Phase 3 (M5) — Canvas Assembly, Sidebar, Inspector, Legacy Removal

### Canvas (`src/webview/canvas/`)

- `CanvasViewport.svelte` — owns the viewport element, wheel/pan/zoom, grid background, gesture delegation, keyboard via shortcut manager; registers host callbacks.
- `FloatingZoomPill.svelte` — `-`, `%` (fit), `+`, wheel ±1%.
- `MarqueeOverlay.svelte`, `ConnectionOverlay.svelte` — interaction SVG overlays.
- `layers/FramesLayer.svelte`, `layers/RelationsLayer.svelte`, `layers/NodesLayer.svelte`.
- Floating editors: extract the edge label, frame label, multiplicity, and endpoint popup into components driven by `InlineEditController`.

### Sidebar (`src/webview/sidebar/`)

- `SidebarContainer.svelte` — resizable drawer + vertical splitter; hosts outline and inspector.
- `outline/ElementsOutline.svelte` (from `common/AccessibleOutline.svelte`) and `outline/OutlineItem.svelte` — search, add menu, node/edge rows, keyboard navigation.
- `inspector/InspectorPane.svelte` — switches selected node/edge/document.
- `inspector/NodeInspector.svelte` — name, stereotype, note text, shape, frame line, attributes, operations, visibility toggles.
- `inspector/EdgeInspector.svelte` — relation kind, label, direction, line, routing, endpoint shape/fill, multiplicities.
- `inspector/DocumentInspector.svelte` — migration/compatibility banners, title, description, default routing.

Use the new primitives in these components; preserve field change semantics (`onchange` commit, not per-keystroke).

### App assembly and cleanup

1. `App.svelte` hosts `SidebarContainer` + `CanvasViewport` + `Banner`/`ReadonlyBar` + `ContextMenu`.
2. Update `main.ts` imports to the new CSS entry points.
3. Update all imports from `common/AccessibleOutline.svelte`, `common/ContextMenu.svelte`, `common/VisibilityPicker.svelte`, `state.svelte.ts` to the new locations (or keep thin compatibility re-exports for one release).
4. Delete legacy files **only after parity is verified**:
   - `src/webview/uml/UmlCanvas.svelte`
   - `src/webview/uml/UmlInspector.svelte`
   - `src/webview/styles.css`
   - superseded `src/webview/common/AccessibleOutline.svelte` if fully replaced.
5. Remove any now-unused imports/exports (`buildOperationSignature` in the canvas if unused).

### Sidebar/UX requirements preserved

- Empty selection → document inspector.
- Single node → node inspector; multiple nodes → no single-node form (or document inspector) with clear indication.
- Single edge → edge inspector.
- Read-only mode disables all mutation controls.
- Migration/newer-version banners retain their actions.
- Focus returns to the canvas after host pickers/commands.

### Acceptance

- `npm run build && npm run typecheck && npm run check && npm test` pass.
- Manual parity checklist below passes.
- No legacy monolithic file is imported anywhere.

---

## Phase 4 (M6) — Verification, Performance, Packaging, Documentation

### Automated gate

Run from repo root, in this order:

```bash
npm ci
npm run typecheck
npm run check
npm test
npm run build
npm run package
```

Expected:
- `npm ci` clean from manifest/lock.
- 0 TypeScript errors.
- `svelte-check` 0 errors (warnings triaged; no new warnings).
- 24/24 existing tests plus new layout tests pass.
- Build emits `dist/extension.cjs` and `media/webview.{js,css}` with no Svelte compiler warnings.
- `vizion-0.2.0.vsix` generated.

### Manual scenarios

1. Open `.vizion/example.viz` in `vizion.uml`; grid, frames, edges, nodes render in the correct z-order.
2. Pan (middle drag / Space+drag), wheel zoom at cursor, zoom pill, fit content, reset zoom.
3. Marquee select, additive select, node/edge coupled selection, Escape clear.
4. Drag a node; 60 FPS, no snap-back, no layout thrash. Drag a node into/out of a frame; frame containment/resize/detach works.
5. Resize class/note/shape/frame; min sizes and 20px snapping hold.
6. Connect a port to another node; relation commits.
7. Inline edit name, stereotype, attributes, operations, note text, edge label, multiplicity; Enter/blur commits, Escape cancels.
8. Endpoint popup changes shape/fill and multiplicity; paths trim correctly.
9. Inspector edits all node/edge/document fields; visibility toggles work.
10. Undo/redo each operation type with webview focused; one gesture = one undo step.
11. Copy/paste/paste-as-new/duplicate/delete.
12. Export PNG and copy image (webview clipboard path; host fallback on unsupported environments).
13. Corrupt JSON in the text editor → ErrorView with diagnostics → fix → automatic recovery; empty doc initialization is explicit.
14. Read-only URI behavior: controls disabled, export still available.

### Performance verification

- Confirm no `offsetHeight`/`clientHeight` reads inside derived layout code or pointer-move handlers.
- Drag/resize with ~100–200 nodes and several edges; verify no full-derivation storm caused by DOM measurement.
- Confirm edge geometry is computed once per edge per render, not duplicated between relations and foreground layers.

### Documentation / continuity

- Update `README.md` only if commands/structure changed.
- Update `.agents/teamwork/PROJECT.md` milestone status and `orchestrator/GATE_STATUS.md` with final results.
- Add a short `docs/` note only if the new architecture needs onboarding; do not create documentation files unless requested.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Svelte scoped CSS breaks cross-component selectors | Keep `styles.css` until M5; audit every selector; use `:global()` only for parent-applied state classes. |
| Behavior drift during monolith extraction | Extract helpers first and call them from the legacy canvas; replace markup incrementally with visual parity checks. |
| `tsc` misses `.svelte` errors | Add `svelte-check`; make it part of every gate. |
| Native undo focuses the wrong editor | Keep `webview.undo`/`redo`, prevent browser undo only inside text inputs, test with webview focused. |
| Rapid operations stale-reject | Preserve version tokens; surface `staleNotice`; do not silently drop gestures. |
| Frame containment regressions | Port `getFrameDragDropUpdates` verbatim first; add pure-function tests before refactoring. |
| Clean install still broken | Regenerate lock with `npm install`; verify `npm ci` with a clean `node_modules`. |

## Explicitly Out of Scope

- XML document format (user chose JSON).
- Changing the `.viz` schema or AI guidance.
- New product features beyond the approved plan (for example, a full SVG export UI, collaboration, or version control).
- Reintroducing custom undo/redo stacks.
- Making external Linux clipboard binaries the primary clipboard path.

## Recommended Execution Order (Single Agent)

1. Phase 0 fixes + baseline gate.
2. M3 state controllers + services, keeping `UmlCanvas` behavior unchanged.
3. M3 primitives + CSS tokens, wired only where already used.
4. M4 node components, then edge components; keep legacy canvas calling them.
5. M5 replace canvas assembly and inspector, delete legacy files.
6. M6 full gate + manual verification + packaging.
