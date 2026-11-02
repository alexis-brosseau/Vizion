---
name: frontend-architecture-and-ux
description: "Expert front-end knowledge and decision guidance: functional UX, UI architecture, frameworks, components, state, authentication flows, assets, caching, performance, accessibility, and testing. Applies to explanation, design, implementation, debugging, and review for web or native interfaces; excludes backend implementation and aesthetic styling."
metadata:
  version: "1.2"
  edition: "expert-reference"
  document-revised: "2026-11-02"
  research-reviewed: "2026-11-01"
---

# Front-End Architecture and Functional UX

This skill provides the knowledge and judgment of a front-end architecture and functional-UX expert. It explains concepts, architectural alternatives, implementation mechanisms, decision criteria, and non-obvious failure modes for coherent interfaces and maintainable projects.

The user's prompt supplies the actual task, its scope, constraints, and requested output. This reference informs that task; it does not independently assign an application to build, require a project-wide workflow, or prescribe a set of deliverables.

## Applying this expertise

- **Task-relative use:** apply the relevant knowledge to the requested explanation, comparison, design, implementation, diagnosis, or review. A narrow question does not imply permission or a need to redesign the whole application.
- **Conditional guidance:** recommendations describe useful defaults and trade-offs, not one mandatory stack or architecture. “Use when” and “avoid” depend on product behavior, platform, existing code, and the consequences of failure.
- **Contextual judgment:** framework versions, project conventions, lifecycle, dependency direction, and existing working behavior are evidence for a decision. Uncertainty matters when it changes the answer or introduces risk; it is not a reason to impose a large discovery exercise.
- **Proportion:** the catalogs describe available options, not a feature checklist. A component, class, store, service worker, abstraction, or architectural layer earns its place through an actual responsibility.
- **Scope fidelity:** recommendations and examples should support the user's task, not replace it with an assumed assignment. The specification vocabulary and diagnostic coverage below are optional thinking aids rather than required output formats.

## Expertise boundaries

- **Coverage:** user journeys; logical layout; navigation; pages, screens, sections, and components; front-end models; state; effects; validation; client-side authentication flows and session UX; asset management; caching; runtime performance; accessibility; lifecycle; and testing.
- **Outside this reference:** network API design, backend services, databases, server-side authentication/authorization, and infrastructure implementation. Colors, typography choices, themes, decorative imagery, and other aesthetic styling are outside its purpose.
- **External capabilities:** a deterministic local substitute can illustrate or test a client contract when a real integration is unavailable and a demonstration is appropriate. Such a substitute is not evidence of authenticated, synchronized, durable, or production-secure behavior.
- **Hosting boundary:** asset headers, route fallback, base path, compression, and old-build retention can be dependencies of correct front-end behavior. Understanding or describing those requirements is distinct from implementing a server or infrastructure.
- **Platform neutrality:** rules and presentation contracts may transfer across platforms; navigation, controls, accessibility, storage, permissions, and lifecycle still need platform-specific treatment.
- **Quality model:** functional completeness is relative to the product behavior under discussion, not the number of features. Future-proofing means understandable boundaries and localized change, not the disappearance of future migrations.
- **Evidence:** recommendations and example structures are adaptable engineering judgments; linked documentation supports platform facts. Pattern labels and framework behavior are not universal guarantees, and this standalone reference has no required companion files.

## Expert reasoning model

The following lenses help explain why a design works, why it fails, or which alternative fits better. They are independent dimensions of judgment, not stages that the agent must execute in order.

| Lens | Knowledge that informs a sound decision |
|---|---|
| Existing context | Repository structure, framework versions, scripts, conventions, tests, navigation, state owners, and dependency boundaries constrain feasible changes. A preference alone is not a reason to replace working conventions. |
| User intent | Actors, goals, core objects, inputs, platforms, offline/persistence expectations, consequential actions, exclusions, and acceptance criteria give interface behavior its meaning. Accounts, billing, collaboration, and dashboards are not implicit requirements. |
| Journey coherence | Entry, information, decisions, actions, completion, cancellation, failure, and recovery explain how a person accomplishes a task. A set of disconnected pages does not establish a working journey. |
| Behavioral completeness | Visible actions need meaningful transitions, operations, or destinations; relevant empty, invalid, busy, failed, missing, cancelled, and completed states are part of behavior rather than extra polish. |
| Architectural fit | UI framework, organization pattern, state mechanism, routing, and delivery model are separate choices. Dependencies, ownership, lifecycle, asset/cache policy, and performance budgets determine whether a combination is coherent. |
| Change and evidence | A connected vertical slice can reveal integration mistakes earlier than many disconnected shells. Build/type/lint results, behavioral tests, accessibility checks, lifecycle observations, and performance measurements answer different questions and should not be treated as interchangeable proof. |

## Knowledge maps and representation options

These representations make relationships explicit when they help with the user's task. They can remain mental models, small code comments, diagrams, or sections in an existing document; none is a mandatory deliverable.

| Representation | What it clarifies |
|---|---|
| Product scope | Users, tasks, objects, assumptions, exclusions, acceptance criteria |
| Journey map | Entry, required information, actions, decisions, completion, cancellation, recovery |
| Destination map | Hierarchy, routes/identifiers, parameters, direct entry, Back/Forward, missing content |
| Page/screen specification | Purpose, regions, sections, controls, owners, states, actions, focus, exit |
| Component inventory | Use/avoid rationale, inputs, outputs, controlled/internal state, lifecycle, tests |
| State inventory | Authority, readers/writers, transitions, derivations, lifetime, restoration, reset |
| Authentication client contract, if needed | Existing provider/backend integration, flow, session states, callback/return, expiry, recovery, logout, cache isolation; no server verification implementation |
| Relationship model | Classes/modules/functions/components, dependencies, ownership, multiplicity, creation/disposal |
| Asset inventory | Origin/license, consumer, variants, build path, loading, fallback, cache, cleanup |
| Cache policy | Resource, key, scope, freshness, retention, invalidation, eviction, offline/update behavior |
| Verification plan | Representative journeys, failure scenarios, accessibility, production build, budgets |

The useful level of detail depends on the question and the consequences of ambiguity. A focused component fix may need only one behavioral contract, whereas a new application design may benefit from several connected representations.

## Functional UX and task design

Use visibility of status, familiar language, user control, consistency, error prevention, recognition, efficiency, and recovery as review prompts; these are usability heuristics rather than a substitute for testing with representative tasks ([Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/)).

- **Feedback:** explain what changed, what remains usable, and what the user can do next. Do not replace a known recoverable problem with an unexplained generic failure.
- **Control:** provide proportionate cancellation, return, undo, and discard behavior. Prefer undo for safely reversible changes; require deliberate confirmation when reversal is unavailable and consequences warrant interruption.
- **Discoverability:** keep primary actions findable without hover, memory, or a command palette. Explain unavailable actions when the reason is not obvious.
- **Progressive disclosure:** hide optional complexity, not required instructions or the only path to a task.
- **Continuity:** preserve useful query, selection, draft, and navigation context. Do not restart a workflow after a recoverable failure.
- **Expert use:** support shortcuts, batch work, and repeated actions only where their scope is clear. Keep ordinary discoverable paths available.
- **Honesty:** do not invent successful saves, measured progress, available permissions, or remote persistence. Do not leave visible controls as nonfunctional decoration.

A journey model connects `goal -> entry -> information -> action -> decision -> completion`, with branches for cancellation and failure. It helps distinguish necessary destinations from arbitrary page divisions and exposes no-content, high-volume, interruption, direct-link, changed/missing-item, denied-capability, and keyboard-only scenarios.

## Framework and delivery choices

Choose the UI system, application organization, state mechanism, routing, and delivery model separately. Match installed versions and official documentation; never migrate or add libraries solely to impose a preferred stack.

| Option | Mechanisms and legitimate direction | Boundary or non-obvious pitfall |
|---|---|---|
| React | Component composition and hooks; choose additional application conventions deliberately | Derive values during render; put interaction-specific actions in handlers and reserve effects for external synchronization ([React guidance](https://react.dev/learn/you-might-not-need-an-effect)). |
| Vue | Reactive components and reusable stateful composables | A composable invocation normally creates its own state; sharing requires deliberate scope. Register cleanup and follow setup-context rules ([Vue composables](https://vuejs.org/guide/reusability/composables)). |
| Angular | Signals and computed values within an integrated framework | Computed dependencies are dynamic and synchronous; reads after `await` are not automatically tracked. Readonly signal access does not prevent deep object mutation ([Angular signals](https://angular.dev/guide/signals)). |
| Svelte | Compiled declarative components and reactive runes | Keep `$derived` expressions free of side effects; distinguish a derived value from writable authority ([Svelte overview](https://svelte.dev/docs/svelte/overview), [derived state](https://svelte.dev/docs/svelte/$derived)). |
| Blazor WebAssembly | Razor components running on a browser-hosted .NET runtime | A standalone WebAssembly app can be front-end-only; Blazor Server requires server execution/circuits. Account for runtime download and client resource costs ([Microsoft hosting models](https://learn.microsoft.com/en-us/aspnet/core/blazor/hosting-models)). |
| htmx | HTML-originated requests and response-fragment swapping | Use when an appropriate HTML source already exists; do not create an out-of-scope producer. Review version-specific history snapshots and sensitive-content caching ([htmx documentation](https://htmx.org/docs/)). |
| Elm | Explicit Model, View, and message-driven Update | Use the update architecture when its constraints fit the project; do not turn every trivial control into an independent application module ([Elm Architecture](https://guide.elm-lang.org/architecture/)). |
| SwiftUI | Observation, state, bindings, and environment for native Apple UI | Define source-of-truth ownership and environment availability; adapt native lifecycle rather than copying DOM assumptions ([Apple model-data guidance](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app)). |
| Jetpack Compose | State hoisting, plain state holders, screen ViewModels | Keep UI-element state close to its consumers; do not pass a screen ViewModel into every reusable child ([Android state hoisting](https://developer.android.com/develop/ui/compose/state-hoisting)). |
| .NET MAUI | MVVM with bindings, observable properties, and commands | Keep view types out of presentation logic; do not assume MVVM itself defines navigation ([Microsoft MVVM](https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm)). |

Evaluate familiarity, existing code, target devices, input methods, interaction complexity, accessibility, dependency cost, testing, maintenance, and nonvisual code sharing. Avoid unsupported claims that one framework is inherently fastest, most scalable, or always correct for a company size.

Use a client-rendered app, static documents with enhancement, or static generation with client interaction when appropriate. Document any externally required rendering service without implementing it; verify direct navigation, base paths, offline expectations, and production behavior rather than extrapolating from the development server.

## Architectural patterns and dependency direction

Define responsibilities before choosing a label: MVC and MVP have multiple historically different interpretations, including Passive View and Supervising Controller ([Fowler's GUI architectures](https://martinfowler.com/eaaDev/uiArchs.html)).

| Pattern | Working responsibility contract | Use when | Avoid or counteract |
|---|---|---|---|
| MVC | Model holds rules/data; View presents; Controller interprets user interaction | The toolkit or existing project has a meaningful controller boundary | God controllers, framework-specific domain models, confusing client controllers with backend controllers |
| MVP | View forwards actions; Presenter coordinates model work and presentation updates | Imperative UI benefits from isolated presentation tests | Trivial forwarding classes; specify Passive View versus declarative-view responsibilities |
| MVVM | View binds to ViewModel state/commands; ViewModel uses model/dependencies | Presentation state needs an explicit owner separate from controls | ViewModels holding platform views, every feature's logic, or storage details |
| MVI | View emits intents; update logic maps current state and intent to next state/effect descriptions | Complex transitions, reproducibility, and explicit event handling matter | Ceremony for trivial fields, uncontrolled effects inside pure transitions |
| VIPER | View displays; Interactor handles use case; Presenter prepares presentation; Entity models values; Router coordinates navigation | A feature genuinely benefits from separated use-case and navigation boundaries | Five obligatory files per small control, excessive interfaces, framework leakage |

Treat MVI here as an explicit state/intents/update working contract, not a promise that all libraries use the name identically. MVVM separates model, ViewModel, and view dependencies; the model does not know the view or ViewModel ([Microsoft MVVM](https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm)).

VIPER's original routing separates the Presenter's decision about when/where from the wireframe's knowledge of how to navigate; its Interactor implements a use case independently of UI ([objc.io VIPER](https://www.objc.io/issues/13-architecture/viper/)).

Use these conceptual flows, adapting exact classes/functions to the framework:
```text
MVC:   View input -> Controller -> Model; Model observations -> View
MVP:   View action -> Presenter -> Model/port; Presenter -> View contract
MVVM:  View command -> ViewModel -> Model/port; ViewModel state -> View
MVI:   View -> Intent; (State, Intent) -> (NextState, Effects); EffectResult -> Intent
VIPER: View -> Presenter -> Interactor -> Entity/port; Presenter -> Router
```
Combine patterns only when each boundary solves a distinct problem. Feature-oriented modules can contain MVVM; a reducer can drive one complex editor; a coordinator can organize a multi-screen flow; an imperative widget can use MVP inside an otherwise declarative app.

| Supporting pattern | Use | Watch for |
|---|---|---|
| Unidirectional data flow | State toward views, events toward owners | Global helpers secretly mutating authoritative state |
| Reducer/update | Related state transitions tested as pure functions | Effects and nondeterminism hidden inside transitions |
| State machine/statechart | Legal transitions, guards, branches, parallel concerns | One enormous flattened machine; independent regions need not multiply every state |
| Presentation model | Display-ready state separated from domain objects | Duplicated rules without a declared authority |
| Coordinator/router | Multi-destination flow and navigation mechanics | Application-wide god object or opaque event bus |
| Ports/adapters | Platform capabilities or replaceable client dependencies | An interface for every function without a useful boundary |
| Commands | Shared toolbar/menu/shortcut behavior or undo history | Elaborate command classes for every click |
| Observer/subscription | External changes delivered to consumers | Feedback loops, forgotten disposal |
| Composition/strategy | Real reusable behavior and actual variants | Speculative abstractions and inheritance chains |
| Micro-frontends | Independently owned/released front-end areas are an explicit requirement | Defaulting to distributed UI complexity for one team or one product |

For every layer, answer what it owns, who changes it, how dependencies enter, what can be tested independently, and which change becomes localized. Remove layers with no coherent answer.

## Project organization and relationships

Group by feature/capability when several files change together. Respect framework route conventions; do not duplicate them with a parallel page hierarchy or create empty architectural folders.

```text
src/
  app/                 # bootstrap, dependency composition, providers, navigation
    layouts/           # application shell and shared/master layouts
  pages/               # route-level assembly, when framework conventions allow
  features/
    tasks/
      public           # intentionally exposed exports
      model/           # framework-independent values and rules, if needed
      presentation/    # state owner, selectors, transitions, commands
      ui/              # feature components
      ports/           # useful client dependency contracts, if needed
      adapters/        # deterministic local/platform implementations
      tests/
  shared/
    ui/                # genuinely reusable behavior primitives
    platform/          # lifecycle, clipboard, file and capability boundaries
    assets/            # genuinely shared build-managed assets
  assets/              # application-level assets, if any
public/                # exact-name/static passthrough assets only when appropriate
tests/                 # cross-feature journeys and production checks
docs/                  # decisions and deployment handoff
```
For a small app, collapse this to `app`, a few feature files, shared primitives, and tests. Add a service, class, component, store, or interface for responsibility, lifecycle, state ownership, reuse, platform isolation, or testing, not an arbitrary line count.

- **Imports:** make feature public surfaces intentional; prevent circular imports and casual access to unrelated feature internals. Keep pure rules independent of framework and platform controls.
- **Sharing:** share meaning and change drivers, not merely similar markup. Prefer limited clear duplication over an abstraction with many unrelated switches.
- **Composition:** assemble dependencies at an explicit boundary. A provider distributes values; it does not decide who owns, creates, resets, or disposes them.
- **Identity:** use stable item identities when insertion, deletion, or reordering occurs. Do not use display position as persistent identity.
- **Relationship model:** distinguish dependency, ownership, observation, and navigation arrows. Use modules/functions instead of invented classes when that matches the language.

Document each important unit as `kind; responsibility; created/destroyed by; lifetime; multiplicity; dependencies; inputs; outputs; owned state; forbidden dependencies`. A useful default direction is `composition -> presentation -> pure rules/ports`, `adapter -> port`, and `view -> presentation contract`; direct simpler dependencies are acceptable when no useful isolation is lost.

## State, hooks, providers, and lifecycle

Inventory state before selecting a library. Prefer one authoritative owner per value; derive filtered collections, counts, validation summaries, and action availability rather than synchronizing duplicate values ([React derived-state guidance](https://react.dev/learn/you-might-not-need-an-effect)).

| State | Typical owner/lifetime | Avoid |
|---|---|---|
| Control state | Component; expansion, active option, focus references | Global storage for local interaction |
| Form draft | One editor session | Mutating committed/shared entities before confirmation |
| Route/destination | Router/navigation owner | An unsynchronized second route store |
| Shareable view context | URL when useful; query, sort, page | Secrets, sensitive drafts, serialized object graphs |
| Feature state | Feature presentation; selection/workflow | App-wide ownership without shared need |
| Application state | Composition/store; active workspace/capabilities | Unrelated editor details in one global object |
| Derived state | Selector/computed value | Manual copies that drift |
| Cached result | Explicit cache owner | Copying the same cache into several stores |
| Persistent state | Explicit persistence boundary | Assuming writes or restoration always succeed |
| Effect handles | Lifecycle owner; timer, worker, subscription | Treating platform handles as serializable domain state |

Keep state close to consumers and hoist to the lowest common owner when shared; screen-level state and UI-element state need not have the same owner ([Android state-hoisting guidance](https://developer.android.com/develop/ui/compose/state-hoisting)).

- **Props/callbacks:** prefer explicit data and intents when practical. Avoid passing an entire store or ViewModel to a child that needs one value and one action.
- **Context/provider:** specify value, owner, stable identity needs, subtree, override/missing behavior, reset, and disposal. Split unrelated high-frequency concerns when actual subscription behavior warrants it.
- **Store:** define scope, public actions, selectors, initialization, multiple-instance behavior, resets, and test isolation. Do not use a store as a miscellaneous global object.
- **Hook/composable:** specify per-call versus shared state, dependencies, returned contract, setup/cleanup, errors, and lifecycle. Do not assume the `use` prefix means shared state.
- **Signals/bindings:** keep dependencies understandable and update authority explicit. Two-way binding to a draft is not permission to edit a shared committed object.
- **References/handles:** use for imperative focus, measurement, external instances, and cancellation, not to conceal render-driving application state.

Represent valid combinations explicitly: `Editing(draft) | Saving(draft, operationId) | Failed(draft, problem) | Saved(id)`. Use transition tables for guarded workflows; separate genuinely independent state regions instead of proliferating contradictory booleans.

For each effect, specify `external system; trigger; dependencies; setup; cleanup; cancellation; duplicate-start policy; stale-result policy; failure; owner`. Put user-triggered operations in action handlers and pure calculations in derivations; effects synchronize external systems ([React effects guidance](https://react.dev/learn/you-might-not-need-an-effect)).

Register and remove listeners/subscriptions with their owner. Framework lifecycle requirements differ; Vue composables, for example, have setup-context and cleanup constraints ([Vue composables](https://vuejs.org/guide/reusability/composables)).

## Asynchronous operations and recovery

For every operation, decide overlap, duplicate activation, cancellation, navigation-away behavior, retry safety, and result reconciliation. Cancelling interest in a result must not be presented as reversing an already completed operation.

| Policy | Useful for | Pitfall |
|---|---|---|
| Latest wins | Search/preview for changing input | A late result overwrites newer intent unless operation identity is checked |
| First while busy | One meaningful confirmation/commit | Ignored actions need understandable feedback |
| Queue | Order-dependent operations | Backlog, cancellation, and failure policy must be explicit |
| Parallel | Independent items | One shared busy/error flag loses per-item truth |
| Merge | Independent result contributions | Duplicates and ordering ambiguity |
| Optimistic | Predictable, reconcilable, reversible changes | No rollback, stale refresh overwrite, misleading success |

Abort obsolete work where supported and still reject results belonging to old input, route, context, or operation identities. Preserve drafts and usable content during recoverable failures; distinguish initial load, background refresh, per-item activity, blocking work, and measurable long-running progress.

Model problems as `category; user message; recoverable; next action; optional field issues; separate diagnostic context`. Distinguish invalid input, missing content, denial, unavailable capability, interruption, conflict, and unexpected failure; do not show a success notification before the success condition exists.

## Navigation, logical layouts, and page states

Use routes/destinations for independently meaningful, reloadable, linkable tasks. Use local transient state for minor disclosures; make a modal route-addressable only when direct entry and history semantics are actually needed.

- **Destination contract:** identity, purpose, parents, entry/exit, required/optional parameters, direct entry, normalization, Back/Forward, focus, scroll/context restoration, missing-content fallback.
- **Shell/master layout:** persistent application structure and shared destinations. Keep feature-specific drafts out of the shell merely because it stays mounted.
- **Page/screen:** a destination or major task surface. Specify semantic regions, section purposes, required data, components, actions, and owners, not decorative positioning.
- **Adaptation:** decide whether simultaneous regions become separate destinations on constrained devices, how selection survives, and how users return. Never remove essential tasks to simplify a viewport.
- **History:** test direct links, refresh, unknown routes, invalid identifiers, Back, and Forward. Document static-host route fallback and base-path assumptions.

| Page archetype | Include | Avoid |
|---|---|---|
| Collection/search | Query/filter, results, selection, empty/no-results, actions | Search as the only path through a tiny app |
| Detail | Identity, properties, related actions, missing item | Making every value implicitly editable |
| Editor | Draft, validation, commit/cancel, unsaved-work policy | Shared mutation before confirmation |
| Master-detail | Selection, list context, detail/missing state | Losing context after each item |
| Wizard/review | Meaningful stages, Back, preserved values, review, completion | Splitting trivial tasks or replaying all steps to edit one answer |
| Workspace | Regions, selection and command scope, restoration | Each region owning its own global truth |
| Monitoring | Freshness, current state, relevant actions | Stale information presented as live |
| Settings | Grouping, scope, immediate/apply semantics, reset | Mixing deferred and immediate changes silently |

For each page, mark applicable states: initial, loading, available, empty, no results, partial, refreshing, stale, invalid, saving, success, recoverable failure, unrecoverable failure, missing item, denied capability, offline, conflict, unsupported capability, unfinished changes, long-running work. Do not invent inapplicable states; a synchronous local collection does not need fake loading.

Distinguish empty collection, filtered-out results, unavailable content, and restricted content; each requires a different explanation and next action. Preserve useful content during refresh and preserve entered input after validation or save failures.

## Forms and editing contracts

Define fields, raw/parsed values, validation, timing, ownership, commit, cancellation, dirty state, reset, error focus, and completion. Provide labels, relevant grouping, instructions, and correction feedback ([WAI forms tutorial](https://www.w3.org/WAI/tutorials/forms/)).

- **Raw versus parsed:** preserve incomplete numbers, partial dates, uncommitted tokens, and input-method composition. Do not erase intermediate input because it is not yet a valid final value.
- **Commit model:** choose explicit Save/Cancel, immediate reversible changes, autosave, per-field commit, or meaningful batch commit. Explain boundaries; do not mix models silently.
- **Validation:** apply a deliberate submit/interaction/live policy; avoid premature errors and disruptive announcements on every keystroke. Preserve drafts and associate errors with fields.
- **Submission:** define Enter behavior, multiline exceptions, duplicate activation, review, and leave-while-saving. Give buttons intentional types.
- **International input:** do not assume names, phone numbers, dates, addresses, or alphabets follow one locale. Treat identifiers as text rather than arithmetic quantities.
- **Dates/time:** distinguish date-only values, local clock times, durations, and instants. State timezone and daylight-saving assumptions where meaningful.
- **Unsaved work:** warn only for meaningful unsaved changes; prefer a recoverable draft when appropriate. Do not rely on browser exit warnings as the sole protection.
- **Security boundary:** client validation improves UX but does not establish trust or authorization. Never claim a hidden control protects an operation.

## Component selection catalog

Use these as recommended task-fit defaults, not universal prohibitions. For standardized widget semantics and keyboard behavior, consult the relevant [WAI APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/); ARIA roles do not supply missing behavior, and examples require production interoperability testing ([APG cautions](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).

For every chosen component, define purpose, inputs/outputs, internal/controlled state, disabled/read-only behavior, busy/empty/error states, accessible name, keyboard/pointer/touch interaction, focus, dismissal, lifecycle, and tests. Do not use “dropdown,” “panel,” or “card” as a complete behavioral specification.

| Component | Use when | Avoid / required caution |
|---|---|---|
| Button | Performing an action | Navigation belongs to a link; define busy and duplicate-action behavior |
| Link | Navigating to a resource/destination | Do not replace normal link behavior with an unrelated command |
| Toggle button | Switching an active mode | Preserve a stable meaning and exposed pressed state |
| Menu button | Revealing related commands | Do not hide the primary action without reason |
| Split button | Primary action plus closely related variants | Avoid unrelated alternatives or ambiguous activation targets |
| Icon-only action | Meaning is familiar and properly named | Avoid unfamiliar ambiguous commands without explanation |
| Overflow/context menu | Secondary or object-specific commands | Essential actions need discoverable and keyboard-accessible paths |
| Toolbar | Related commands share context | Do not turn it into duplicate navigation; define focus model |
| Command palette | Expert searchable commands help | Never the only access to core functionality |
| Batch action bar | Actions apply to an explicit selected set | Clarify all-results versus current-page selection |
| Checkbox | Independent boolean/multiple independent options | Do not use for mutually exclusive choices |
| Radio group | One choice from a manageable visible set | Do not use when multiple choices are valid |
| Switch | On/off setting with clear application timing | Do not disguise a submission or navigation action |
| Native select | Conventional one-of-many choice | Avoid when users must compare rich details |
| Combobox/autocomplete | Search helps choose from many options | Distinguish query, active option, and committed value |
| Multi-select | Several choices from a larger set | Prefer checkboxes for a small set; define removal and limits |
| Segmented choice | Few closely related alternatives | Distinguish value selection from destination navigation |
| Listbox | Dedicated option selection is needed | Do not use it for a collection of ordinary links/actions |
| Tree selector | Genuine hierarchy affects choice | Distinguish expansion from selection |
| Token/chip input | Discrete values are entered/selected | Define commit, edit, remove, invalid tokens, and composition |
| Dual-list transfer | Moving items between explicit sets | Prefer simpler multi-selection when transfer semantics add no value |
| Text field | Short plain input | Do not use for substantial structured editing |
| Textarea | Multiline plain content | Do not add rich formatting unless content requires it |
| Search field | Entering a query | Define live versus explicit submission and clear behavior |
| Number/spinbutton | Arithmetic quantity and increments | Not phone numbers, identifiers, or postal codes |
| Slider | Approximate adjustment is natural | Provide exact input when precision matters; define bounds/steps |
| Range slider | Lower/upper bounds form one interval | Distinguish thumbs; two fields may be simpler |
| Date field/picker | Direct entry or calendar context helps | Known dates should not require excessive calendar navigation |
| Time/duration field | Clock time or elapsed time is required | Do not conflate duration, timezone, and instant |
| File chooser/drop zone | Selecting local files | Dragging is enhancement; include a chooser and rejection feedback |
| Rich text editor | User-authored formatting is required | Plain text otherwise; define paste, selection, keyboard, undo |
| Code/expression editor | Structured text is central | Do not impose a complex editor on one ordinary input |
| Masked input | A truly fixed format helps | Do not block valid international values, paste, or partial input |
| Secret input | A task requires a secret | Respect platform assistance and paste; explain disclosure behavior |
| Primary/secondary navigation | Moving between meaningful destinations | Do not list every command or duplicate hierarchies |
| Breadcrumbs | Hierarchical ancestors aid orientation | Not a substitute for browser history or a nonexistent hierarchy |
| Tabs | Related panels share one context | Define activation/focus; do not misuse for unrelated destinations |
| Step indicator | Meaningful stages exist | Do not imply a fixed order when branching is allowed |
| Pagination | Precise bounded result navigation matters | Preserve query, selection policy, and position |
| Load more | User-controlled incremental browsing fits | Define added count, completion, and focus stability |
| Infinite feed | Continuous consumption is the task | Avoid for precise retrieval or inaccessible end content |
| Navigation drawer | Destination list needs a collapsible container | Keep important paths discoverable; define focus/dismissal |
| Tree navigation | A complex hierarchy warrants tree interaction | Prefer disclosures with ordinary links when sufficient |
| Skip link | Repeated structure should be bypassed | Ensure target and focus actually work |
| Disclosure/accordion | Optional related detail expands in place | Do not hide required instructions or comparison content |
| Tooltip | Brief supplementary explanation | Not essential instructions, errors, or interactive content |
| Popover | Contextual nonmodal content | Define trigger, dismissal, focus relationship |
| Modal dialog | Bounded task must hold attention | Define focus entry/containment/return; avoid nested workflows |
| Nonmodal dialog | Separate task can coexist with page | Keep navigation between contexts understandable |
| Alert dialog | Urgent decision warrants interruption | Not ordinary status feedback |
| Drawer/sheet | Contextual task preserves underlying context | State modal/nonmodal behavior; complex work may need a page |
| Lightbox/media inspector | Inspecting media is the task | Define description, navigation, zoom and dismissal alternatives |
| List/property list | Items or labeled properties | Do not imitate a table when comparison matters |
| Table/sortable table | Structured record comparison | Define headers, sorting, and selection preservation |
| Data grid | Spreadsheet-like navigation/editing | A table with a few controls rarely needs grid complexity |
| Tree/treegrid | Hierarchical data interaction | Expansion, selection, focus, and editing are separate contracts |
| Card collection | Independently understandable units | Avoid obscuring cross-record comparison or nested actions |
| Virtualized list | Measured collection size warrants it | Preserve focus/identity and consider find, assistive tech, scroll restoration |
| Kanban board | Moving work between meaningful statuses | Include non-drag move controls and explicit category meaning |
| Timeline/activity log | Sequence or past actions matter | Do not substitute history for current state |
| Calendar/scheduler | Date/resource relationships are central | Provide list/direct editing alternatives and non-drag operations |
| Inspector | Repeated inspection of current selection | Define empty/multiple selection and stale selection |
| Comparison/diff view | Differences are the user task | Keep comparable properties and old/new identity explicit |
| Inline error/error summary | Field correction/navigation is needed | Preserve input; associate errors and summary targets |
| Status/banner | Noninterrupting or persistent conditions | Scope correctly; avoid flooding announcements |
| Toast/snackbar | Brief supplementary feedback suffices | Not sole access to important failure or expiring required action |
| Progress indicator | Work is ongoing | No fabricated percentage or indefinite spinner hiding failure |
| Skeleton | Initial content loading benefits from structure | Not an error state or substitute for loading policy |
| Empty/no-results state | Nothing exists or query excludes matches | Different explanations and recovery are required |
| Confirmation summary | Durable result/next steps matter | Do not claim completion before the commit |
| Offline/conflict notice | Capability degradation/reconciliation matters | Preserve draft and state actual limitations |
| Notification center | Messages need durable later review | Do not add without message relevance/lifecycle |
| Split-pane resizer | Users adjust working regions | Provide keyboard and pointer alternatives with bounds |
| Dockable panels | Expert workflows truly need rearrangement | Persist/reset intentionally; avoid configuration burden |
| Multi-document tabs | Several open documents are meaningful | Define dirty, close, reorder, duplicate, and restoration |
| Hierarchical checkboxes | Parent-child selection has defined meaning | Specify mixed state and propagation |
| Query/rule builder | Users construct structured conditions | Define grouping, validity, summary; simpler filters may suffice |
| Workflow/node editor | Relationships/steps are the product | Provide non-canvas editing, keyboard paths, readable structure |
| Spreadsheet editor | Cell editing/computation is essential | Specify navigation, formulas, selection, undo; avoid unnecessary complexity |
| Map/chart | Geography or patterns are task-essential | Provide usable text/data/list alternatives |
| Media player | Playback is functional content | Controls, captions/transcripts when applicable, interruption policy |
| Terminal/log console | Technical command/log work is required | Not the general user-facing error interface |
| Mentions picker | Text references known entities | Define triggering, selection, escaping, plain-text meaning |
| Reorderable list | Order has user meaning | Provide move controls, bounds, focus and feedback |
| Transfer queue | Independent operations progress separately | Per-item status, cancel/retry, completed-item cleanup |
| Permission explainer | A relevant platform capability needs consent | No premature permission request; provide denial fallback |
| Onboarding/tour | Genuine novel setup needs guidance | Do not compensate for unclear navigation; allow skip/resume |
| Carousel | Sequential media browsing is justified | Do not conceal essential content; define position and user control |

## Accessibility and input verification

Prefer native semantic controls. Implement and test the promised keyboard behavior for custom widgets; a role alone does not implement it ([WAI APG](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).

- **Focus:** specify entry, order, composite-widget navigation, activation, Escape, return after dismissal, removal of the focused item, and route transitions. Do not move focus for routine background updates.
- **Names:** provide meaningful labels and distinguish repeated actions by context. Do not rely on placeholders, hover, location, or appearance alone.
- **Feedback:** announce meaningful changes with proportionate urgency; avoid repeatedly reading entire changing collections.
- **Inputs:** test keyboard, pointer, touch, relevant input methods, and representative assistive technology. Preserve composition and provide alternatives to hover-only/gesture-only behavior.
- **Dragging:** provide a single-pointer alternative without dragging where required; keyboard support alone is not the equivalent pointer alternative ([WCAG dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)).
- **Limits:** automated checks do not prove usable interaction. Record manual combinations tested; do not claim full accessibility conformance from this no-styling skill alone.

## Asset management

Treat assets as versioned dependencies with ownership and lifecycle, not an undifferentiated directory. Include images, SVG/icons, audio/video, caption tracks, documents, localization bundles, worker/WASM files, generated exports, and user-selected files only where relevant.

The asset lifecycle has several distinct concerns; solving one does not automatically solve the others. Its relevant dimensions are ownership, source/build representation, delivery priority, runtime use, fallback, caching, and disposal.

| Concern | Expert guidance |
|---|---|
| Identity and provenance | A useful asset model is `id; type; purpose; owner; source/license; trust; consumer; source file; variants; output URL; dimensions/duration; transfer/decoded cost; loading; fallback; cache; cleanup`. An asset without a justified consumer is a candidate for removal, not an obligation to invent a use. |
| Organization | Feature-specific source assets generally belong near their consumers; genuinely shared assets can be centralized. Originals, generated variants, and build output have different ownership. |
| Build representation | Build-managed imports provide dependency tracking and content fingerprints; passthrough/public assets suit intentional stable names or unimported files. Vite hashes imported assets but copies public assets unchanged ([Vite assets](https://vite.dev/guide/assets)). |
| Loading policy | Critical, needed-soon, and on-demand loading express different priorities and fallback needs. Preloading everything or placing all icon/media collections in startup defeats that distinction. |
| Diagnostic evidence | Production output, references, formats, base paths, missing files, transfer sizes, licensing, unsupported formats, resource cleanup, and cold/warm behavior expose different failure modes. Development-server success is not evidence for all of them. |

| Asset concern | Recommended implementation | Avoid / non-obvious pitfall |
|---|---|---|
| Bundled versus public | Import transformed/fingerprinted assets; use stable paths intentionally | Public passthrough files do not acquire content hashes automatically ([Vite assets](https://vite.dev/guide/assets)). |
| Dynamic references | Use explicit registries or build-tool-supported analyzable patterns | Arbitrary runtime string paths may work in development but evade production transformation ([Vite assets](https://vite.dev/guide/assets)). |
| Base path | Build/test at the actual nested deployment path | Root-relative hand-written URLs can violate deployment assumptions; use the tool's base-path facilities ([Vite builds](https://vite.dev/guide/build)). |
| Raster images | Generate appropriate dimensions/formats; use `srcset`/`sizes` and known intrinsic dimensions | Oversized transfers/decodes; inaccurate `sizes`; absent dimensions causing content movement ([responsive images](https://web.dev/learn/design/responsive-images)). |
| Format fallback | Use supported alternatives and an `img` fallback in `picture` where warranted | Do not require one modern format without checking targets ([MDN picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture)). |
| Critical versus deferred media | Discover critical images early; lazy-load genuinely deferred images | Lazy-loading the LCP image or marking every image high priority ([responsive images](https://web.dev/learn/design/responsive-images)). |
| SVG/icons | Keep trusted reusable icons bounded; preserve accessible naming at the control | Treat user-provided SVG as untrusted markup; do not inject it directly |
| Audio/video | Choose task-appropriate source size, controls, loading, captions, poster/failure behavior | Downloading all media upfront or assuming playback/autoplay is available |
| Existing font files | Audit only delivery cost/coverage; retain needed languages and preload sparingly | Dropping required glyphs; font preload needs matching CORS handling even when self-hosted ([font asset performance](https://web.dev/learn/performance/optimize-web-fonts)). |
| Data URLs | Inline only when measured trade-offs justify it | Inlining changes payload and independent-cache boundaries; do not inline everything for fewer requests |
| Preloads | Match resource URL/type/request mode; preload only a demonstrated critical dependency | `as` and CORS are request-matching concerns, not arbitrary annotations ([MDN resource links](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link)). |
| Prefetch/preconnect | Reserve future-resource fetches or connection warm-up for justified likely needs | Prefetch is discretionary, lower-priority, and support-dependent; preconnect is not an asset download and too many origins waste resources ([MDN prefetch](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/prefetch), [MDN preconnect](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect)). |
| User-selected files | Validate usable type/size/decode, show rejection, offer removal and retry | The file input's `accept` value is a hint, not validation or a security boundary ([MDN accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)). |
| Blob/object URLs | Give creation/revocation to a lifecycle owner | Unrevoked URLs retain objects; immediate revocation after image load can break later save/open interactions ([MDN blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob)). |
| Generated downloads | Define filename, format, failure, temporary-resource lifetime | Do not present a generated blob URL as a durable application identifier |
| Missing/blocked assets | Provide meaningful fallback and diagnostics | Do not retry an identical permanently missing resource forever |

Do not add external trackers or hotlinked dependencies without need. Avoid secrets or sensitive documents in public assets; keep provenance/license/attribution information with the asset inventory, and remove unused or duplicate variants. Choose a source-map publication policy and inspect production artifacts for sensitive content; withholding source maps is not a way to make shipped client code secret.

## Caching, freshness, and invalidation

Choose no application-managed cache when simpler platform behavior meets the requirement. Distinguish freshness, retention, invalidation, persistence, and offline availability; none implies the others.

| Layer | What it represents | Required decision |
|---|---|---|
| HTTP cache | Browser-managed response reuse governed by request/response semantics | Hosting headers, URL versioning, validators ([MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)) |
| Service-worker Cache Storage | Explicit request/response storage | Selection, freshness metadata, strategy, cleanup; entries do not automatically expire or honor HTTP caching headers ([MDN Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)) |
| In-memory/query cache | Application-managed result reuse | Keys, sharing, stale policy, invalidation, bounds; freshness and inactive retention differ ([TanStack defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)) |
| Memoization | Reusing a pure computation result | Dependency identity, bounded lifetime, invalidation; not a persistence mechanism |
| Client persistence | User preferences/drafts intentionally restored | Version, corruption handling, write failure, reset; do not treat a draft as disposable cache |
| Back/forward cache | Snapshot of page and JS heap, not just response bytes | Restoration/revalidation and sensitive-state handling ([web.dev bfcache](https://web.dev/articles/bfcache)) |

For every application-managed cache, specify `resource; authority; key; context partition; readers; writer; freshness; stale usability; retention/limit; invalidation triggers; concurrency; failure; offline fallback; version; deletion`. Include resource identity, locale, relevant filters, and workspace/user context where they change results; do not put secrets in keys.

TanStack Query keys must be serializable and unique to the represented data; include changing variables used by the read operation, rather than reusing one key for different results ([query-key guidance](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)).

| Strategy | Use when | Avoid / recovery requirement |
|---|---|---|
| Cache-first | Fingerprinted application assets or stable reference resources | Mutable content silently staying stale |
| Network-first | Freshness matters but a labeled cached fallback is acceptable | Hanging on poor connectivity; define a bounded wait/failure path |
| Stale-while-revalidate | Immediate content matters and temporary staleness is acceptable | Consequential actions based on stale values; refresh must not overwrite a draft |
| Network-only | An outdated response is worse than unavailability | Claiming the task works offline |
| Cache-only | A deliberately installed/pinned resource set is the contract | No miss/update recovery |
| No app cache | Platform caching or recomputation is sufficient | Adding a second cache just because a library supports one |

Cache-first, network-first, and stale-while-revalidate trade speed/offline resilience against freshness; select by resource rather than one policy for the entire app ([MDN PWA caching](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)).

- **Invalidation:** define behavior after create/edit/delete, imports, locale change, context changes, and application updates. Invalidate dependent lists, details, counts, and selections deliberately; prevent old in-flight results from repopulating invalid data.
- **Retention:** bound dynamic-key caches by entry count, bytes, inactivity, or an appropriate combination. Limit duplicated images/blobs/results in long sessions; a freshness TTL alone need not limit memory.
- **Correctness:** validate successful responses before caching; do not assume a resolved fetch means a successful HTTP status. Account for response consumption/cloning and opaque responses when using Cache Storage ([MDN Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)).
- **Isolation:** clear or repartition sensitive context state when a workspace/user context changes. Do not assume clearing one store clears HTTP cache, Cache Storage, persistent drafts, or restored pages.
- **Library defaults:** verify stale/refocus/reconnect/mount refresh, retries, and garbage collection for the installed version. `staleTime` is not `gcTime`; fresh data and retained inactive data are different policies ([TanStack defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)).
- **HTTP handoff:** changing content at a fingerprinted URL breaks the immutable contract; `no-cache` allows storage but requires validation, while `no-store` prevents new storage and does not erase older entries ([MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)).
- **Header boundary:** request cache modes do not configure origin response headers. Document revalidated HTML and long-lived immutable public hashed assets as appropriate hosting requirements, not browser-JavaScript fixes ([MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)).

Illustrative hosting handoff for non-sensitive static delivery: HTML with `Cache-Control: no-cache` and validators such as `ETag`/`Last-Modified`; public content-fingerprinted assets with `Cache-Control: max-age=31536000, immutable`. These are resource-specific examples, not universal defaults for personalized content, and require hosting support ([MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)).

## Offline, persistence, and update safety

Classify each task as fully local, available from a prior snapshot, editable but not externally committed, or unavailable offline. Distinguish “the shell opens,” “prior content is readable,” “new drafts are editable,” and “work reconciles later”; do not imply a complete offline workflow from one cached page.

- **Storage contract:** define version, scope, expiration, corruption/reset, availability, privacy, and write failure. Persist user work separately from disposable cache; provide recovery/export where its importance warrants it.
- **Eviction:** handle denied/full storage and missing content. Quotas vary, estimates are approximate, best-effort data can be evicted, and persistence requests are not a guarantee against user deletion ([MDN quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)).
- **Synchronous storage:** keep `localStorage`/`sessionStorage` work small and infrequent; their operations block JavaScript execution ([MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)).
- **Service worker:** add only for a justified capability. Version owned caches, keep the registration URL stable, test first install/waiting/activation, and do not delete another app's caches on a shared origin ([service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle)).
- **Update coherence:** coordinate HTML, lazy chunks, assets, and worker versions; protect unsaved work. `skipWaiting()` can give an old page a new worker, and `clients.claim()` changes control assumptions ([service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle)).
- **Lazy-chunk failure:** handle old open tabs referencing removed chunks. Vite exposes a preload-error event; its documented reload example is not a substitute for an application-specific recovery policy ([Vite builds](https://vite.dev/guide/build)). Prefer a controlled update prompt where work could be lost; bound automatic reload attempts and document old-asset retention needs.
- **Fallback scope:** restrict shell fallback to intended navigation requests; do not silently return an HTML shell as a missing JavaScript, image, worker, or document-download response. Verify failed subresources remain recognizable failures.
- **Back/Forward restoration:** on `pageshow` with `persisted`, refresh or clear stale/sensitive state as appropriate. Avoid unconditional unload listeners and do not rely on remembered assumptions about browser-specific `no-store` eligibility ([bfcache guidance](https://web.dev/articles/bfcache)).
- **Multiple tabs:** specify whether preferences/drafts are isolated, reflected, or conflict-detected. Prevent silent overwrite; cross-tab coordination is not cross-device synchronization.

## Performance optimization

Measure an actual task before optimizing it, then compare the same workload afterward. Record device/browser, dataset, build mode, network/CPU conditions, cold/warm cache, route, operation, and sample count; do not derive production claims from one development-machine run.

Current good Core Web Vitals thresholds are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1, assessed at the 75th percentile with mobile/desktop segmentation; lab testing does not replace field measurement ([web.dev Web Vitals](https://web.dev/articles/vitals)).

Treat those as browser experience metrics, not proof that all application tasks are fast. Also budget route readiness, search/filter response, editor startup, large imports/exports, long-session memory, and active/background work; agree workload-specific limits instead of inventing one universal bundle size.

| Area | Investigate and improve | Avoid |
|---|---|---|
| Startup/download | Inspect production bundles, coverage, duplicate dependencies, critical assets, route-level/on-demand splits | Loading every editor/locale/icon set before the first task |
| Dependency cost | Compare actual shipped output and maintenance; use platform capabilities where adequate | Assuming a small package label means a small transitive bundle |
| Chunking | Split meaningful expensive routes/features; prefetch only likely useful next work | Many sequential import waterfalls or overly tiny chunks |
| Tree shaking | Check actual eliminated code and side-effect declarations | Blanket `sideEffects: false` can remove necessary initialization/polyfills/registrations ([webpack guidance](https://webpack.js.org/guides/tree-shaking/)). |
| Main thread | Profile parsing, computations, handlers, and long tasks; chunk/yield expensive work | A spinner does not make a blocking task responsive; long tasks exceed 50 ms ([web.dev optimization guidance](https://web.dev/articles/top-cwv)). |
| Cooperative yielding | Feature-detect actual task-yielding support and use a suitable fallback | Awaiting a microtask is not the same as rescheduling into a future task; test supported scheduling behavior ([long-task guidance](https://web.dev/articles/optimize-long-tasks)). |
| Workers | Offload measured substantial independent computation; define message types, IDs, cancellation, errors, disposal | Workers cannot manipulate DOM; copying/transfer ownership affects cost and correctness ([MDN workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)). |
| Derivations/rendering | Scope subscriptions, derive minimal values, profile expensive pure calculations | Memoizing everything or using effects to copy derived state |
| DOM/collections | Bound rendered work, paginate or virtualize where justified; batch reads/writes | Large updates and layout thrashing; virtualization that loses focus or item identity ([web.dev optimization guidance](https://web.dev/articles/top-cwv)). |
| Search/input | Keep immediate input responsive; debounce expensive follow-up work only when suitable | Debouncing the visible input itself or ignoring stale results |
| Memory | Repeat open/close/navigation/import cycles; inspect retained objects, timers, listeners, caches, media | A bounded startup snapshot does not prove leak-free long sessions |
| Background | Pause nonessential work when hidden; reconcile on return | Background timers are throttled, so do not assume exact timing ([MDN visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)). |
| Stability | Supply intrinsic media dimensions and preserve task/focus continuity | Loading content that unexpectedly shifts controls ([responsive images](https://web.dev/learn/design/responsive-images)). |
| Third parties | Inventory runtime/interaction cost, capability, privacy, failure | Adding trackers/widgets without need or assuming they always load |

For workers, include copy-versus-transfer cost in measurements; transferring a buffer makes it unavailable to the sender, so define ownership before transfer ([MDN workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)).

Measure SPA route transitions as task timings in all targets; soft-navigation metrics and reporting support vary by browser/tool, so verify support rather than assuming every route resets Core Web Vitals ([SPA measurement guidance](https://web.dev/articles/vitals-spa-faq)).

Use laboratory audits to diagnose regressions, representative interaction runs for responsiveness, and privacy-appropriate field data where already available. Do not claim a Lighthouse score proves real-user INP or all-session performance ([Web Vitals measurement limits](https://web.dev/articles/vitals)).

## Client-side authentication scope and flow selection

Client-side authentication expertise concerns the user-facing journey and integration with an existing identity-provider/backend contract. Server credential verification, session issuance, API token-signature validation, password hashing, authorization enforcement, and recovery-token generation belong to backend expertise, not this reference.

Authentication is not a route boolean. Define what the UI knows, what it is still checking, which flow is supported, and which trusted system decides whether the session/resource access is valid.

OAuth concerns delegated access; OpenID Connect adds an identity layer ([OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html)). An ID token is not an interchangeable API access token, and a decoded token is not proof of authorized resource access ([OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html), [JWT BCP](https://www.rfc-editor.org/rfc/rfc8725.html)).

| Flow/client architecture | Appropriate use | Client implementation | Avoid / non-obvious pitfall |
|---|---|---|---|
| Cookie session or BFF | First-party app integrates a server-managed session; BFF keeps upstream tokens out of browser code | Call the supplied session/login/logout contract; treat HttpOnly session state as opaque; render from session results | Do not try to read HttpOnly cookies or store duplicate “authoritative” tokens. Cookie topology and CSRF protection require coordinated backend support ([browser-app guidance](https://www.rfc-editor.org/rfc/rfc10017.html), [OWASP sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)). |
| OIDC Authorization Code with PKCE | A public browser app legitimately calls resources using delegated tokens | Use a maintained provider-compatible SDK for redirect/popup initiation, transaction state/nonce/PKCE, callback, and token acquisition | No client secret in shipped code; do not implement implicit or password-grant login as a shortcut ([OAuth BCP](https://www.rfc-editor.org/rfc/rfc9700.html)). |
| Token-mediating backend | Architecture intentionally returns an access token to browser while backend handles refresh | Use the supplied mediation contract and in-memory access-token lifecycle | Not equivalent to a token-isolating BFF: malicious script can still obtain/use browser access tokens ([RFC 10017](https://www.rfc-editor.org/rfc/rfc10017.html)). |
| Password form | An existing backend/provider supports password sign-in | Labeled username/password, manager/autofill/paste support, submit/busy/error, MFA continuation; discard secret state after use | Distinguish an existing password sign-in contract from the prohibited OAuth resource-owner password grant; never log, persist, or put passwords in URLs ([OAuth BCP](https://www.rfc-editor.org/rfc/rfc9700.html)). |
| Passkey/security key | Provider/backend supplies WebAuthn ceremonies | Request options, invoke `navigator.credentials.create()` for enrollment or `get()` for sign-in, submit credential result through integration, then recheck session | Browser ceremony success is not server acceptance; handle unsupported/cancelled/timed-out prompts and maintain usable alternatives ([MDN WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)). |
| Email link or one-time code | Existing service supports possession-based sign-in/verification | Submission confirmation, waiting state, pasteable code/link callback, resend state, expired/used/invalid recovery, same/different-device outcome | Do not claim email is phishing-resistant or satisfies every assurance requirement ([NIST guidance](https://pages.nist.gov/800-63-4/sp800-63b.html)); avoid exposing account existence or consuming a consequential action merely by previewing a link. |
| TOTP/push/recovery code | A continuation or step-up requires another method | Method selection, explicit waiting/challenge, paste, retry/expiry, alternate method, cancellation | Not every “two-step” flow is independent-factor MFA; avoid treating SMS/email/push and cryptographic authenticators as equal assurance ([OWASP MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html), [NIST guidance](https://pages.nist.gov/800-63-4/sp800-63b.html)). |
| Social/enterprise federation | A configured identity provider supports a social/OIDC/SAML connection | Choose configured provider/organization, redirect via trusted SDK/contract, handle denied consent or unavailable connection | Do not parse/verify SAML XML in the UI or auto-link accounts because displayed emails match |
| Native authorization | A native app uses an external identity provider | Use platform/system browser and approved deep-link callback integration with PKCE | Avoid embedded password-collecting webviews and embedded client secrets ([RFC 8252](https://www.rfc-editor.org/rfc/rfc8252.html)). |
| Device authorization | A genuinely input-constrained device needs a separate browser | Present the supplied verification URI/code, progress, expiry and cancellation; obey SDK polling/slow-down | Not the default for an ordinary web app; user-code phishing needs explicit mitigation ([RFC 8628](https://www.rfc-editor.org/rfc/rfc8628.html), [cross-device security](https://www.rfc-editor.org/rfc/rfc10027.html)). |

Select a flow with the existing backend/provider rather than silently replacing it. For sensitive browser applications, evaluate a BFF's token isolation against actual deployment constraints; public SPA and token-mediating alternatives have different security properties, not merely different component APIs ([RFC 10017](https://www.rfc-editor.org/rfc/rfc10017.html)).

### Client SDK integration recipes

Use a supported SDK matching the configured provider and installed version; these examples illustrate integration, not interchangeable method names. Keep one configured client at the intended lifecycle scope and put provider details behind the authentication adapter.

| Example | Implementation sequence | Pitfall to verify |
|---|---|---|
| MSAL Browser | Create `PublicClientApplication`, await `initialize()` or its supported async factory, then complete `handleRedirectPromise()` when using redirect interaction | Initialization must finish before other APIs; callback results can be null outside a redirect. Choose the intended popup/redirect strategy rather than mixing flows accidentally ([MSAL initialization](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/initialization)). |
| Auth0 SPA SDK | Create the client, invoke `loginWithRedirect()`, process the actual callback with `handleRedirectCallback()`, and acquire access through `getTokenSilently()` as configured | In-memory cache and provider-session persistence are different; iframe-based silent acquisition can fail when third-party cookies are blocked. Persisting tokens changes XSS exposure ([Auth0 SPA SDK](https://auth0.com/docs/libraries/auth0-single-page-app-sdk)). |
| SimpleWebAuthn browser | Receive options from the supplied integration, call `startRegistration({ optionsJSON })` or `startAuthentication({ optionsJSON })`, and return its result to that integration | Use the installed method signature; check conditional-UI support before enabling it. The client helper does not replace trusted verification ([SimpleWebAuthn browser](https://simplewebauthn.dev/docs/packages/browser)). |

## Client-side authentication architecture and lifecycle

Give one adapter the provider/SDK details and one explicit presentation owner the user-facing session state. A provider/context can distribute that contract; it is not itself the authority on whether the server accepts a request.

Use capabilities rather than forcing every provider to implement every method:
```text
AuthClient
  initialize()
  currentSession() / subscribe(listener)
  startSignIn(method, approvedReturnDestination)
  completeRedirect()                 # only for redirect-capable integrations
  acquireAccessToken(resource)        # only when browser bearer tokens are intended
  startStepUp(context)                # only if supported/required
  signOut(scope)

AuthPresentation
  Checking | Anonymous | Starting | Redirecting | Completing
  ChallengeRequired | Authenticated | Expired | SigningOut | Unavailable
  -> safe account summary, capabilities for UX, recovery actions
```

Do not expose secrets through presentation state, application logs, devtool snapshots, or generic persistence. Keep passwords, OTPs, recovery codes, and transaction secrets out of global stores; operational logging should exclude credentials/tokens/session identifiers ([OWASP logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)).

The following phases describe an application's authentication lifecycle, not an assignment to implement authentication in every application. Only the phases supported by the selected integration apply.

| Phase | Behavior and failure modes |
|---|---|
| Initialization | One SDK instance at its intended application scope completes pending callback work and resolves session state. Authenticated, anonymous, challenge, and unavailable outcomes differ; protected content should not flash while identity is unknown. |
| Sign-in initiation | Only the intended safe return destination and non-sensitive work need preservation. Duplicate initiation, blocked popups, user cancellation, and indefinite busy indicators are distinct UX concerns. |
| Callback completion | The SDK owns transaction handling; a callback containing a code is not proof of successful sign-in. Sensitive callback parameters need removal after processing, with duplicate, stale, mismatched, denied, and expired transactions handled explicitly. |
| Resumption | An approved local route/destination can restore allowed context. Arbitrary external, protocol-relative, or executable return targets are not equivalent safe destinations. |
| Resource access | Resource-specific tokens apply only when the architecture requires browser bearer tokens, and only to intended resource origins. Authorization failure and connectivity failure have different meanings and recovery paths. |
| Renewal | One coordinated acquisition/refresh path, bounded retries, and an expired-session state avoid renewal storms and endless loops. Replaying a mutation after renewal is unsafe when its earlier commit is ambiguous. |
| Sign-out | The supplied logout contract, account-scoped UI/cache/subscriptions, and actual failure outcome determine what has ended. Clearing a local boolean does not establish server invalidation or provider logout. |
| Cross-context behavior | Fresh load, callback, reload, direct entry, expiry, cancellation, denial, recovery, logout, multiple tabs, and account/tenant switching reveal stale-private-content and lifecycle defects. |

- **Unknown versus anonymous:** a network failure checking session is not proof the user signed out. Show an unavailable/retry path and restrict protected presentation according to the product contract.
- **Route guards:** use them for navigation/UX only. Backend enforcement remains authoritative; changing client state, hiding a button, or decoding claims never grants permission.
- **401 versus 403:** do not turn every denied response into a login redirect. A valid signed-in user can lack permission, while an expired/invalid session needs a different recovery path.
- **Single flight:** avoid simultaneous token renewals from every component. Coordinate adapter lifecycle and, where supported, provider-approved multi-tab behavior.
- **Return from background:** reconcile session after long inactivity and restored-page entry where needed. A displayed expiry countdown is informative, not a server enforcement mechanism.
- **Cached/offline identity:** cached profile data is not proof of a currently accepted session. Describe which private local content is allowed offline and when reauthentication is required.
- **Tenant/account switching:** cancel obsolete work, partition/clear caches, reset selections/drafts as appropriate, and reject late results tied to the previous context.
- **Permission hints:** client capability/role displays may improve discoverability, but errors and authorization changes must still be handled after an action.

## Client-side authentication safety and UX

Avoid durable browser token storage as a casual default: persistent JavaScript-readable storage increases exposure, and in-memory storage does not eliminate malicious-script risk ([RFC 10017](https://www.rfc-editor.org/rfc/rfc10017.html)). Use the selected architecture and SDK guidance rather than claiming any browser storage choice makes XSS harmless.

- **Cookie integration:** include credentials/CSRF headers only for the intended supplied contract and origin policy. Client code cannot set server HttpOnly protections or fix missing CORS response configuration ([MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)).
- **Credential handling:** prevent passwords, codes, tokens and callback URLs from leaking to analytics, error reports, screenshots/fixtures, logs, or automatic state persistence.
- **Accessible sign-in:** provide explicit labels, meaningful autocomplete semantics, password-manager support, paste, and usable alternate methods. Do not require unaided memory/transcription/puzzles without a qualifying accessible path ([WCAG accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)).
- **Code entry:** allow pasting the complete code; avoid a custom segmented input that loses characters, focus, or composition. Describe expiry/resend without revealing whether an account exists.
- **Passkey UX:** distinguish enrollment from sign-in and device prompts from application errors; use supported serialization/helpers and cancellation controls rather than inventing cryptography. A local user-verification prompt is not necessarily a server password prompt ([MDN WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)).
- **Sensitive changes:** integrate the backend's step-up request when changing credentials or other protected settings; do not treat a freshly opened dialog as proof of recent authentication.
- **Recovery:** provide the configured alternate method and clear expired/used-link recovery, while avoiding enrollment or reset options the backend does not support.
- **Federated logout:** distinguish leaving this app, revoking a session, and signing out of the provider. Provider logout can involve user choice and does not always complete through the same local lifecycle ([OIDC logout](https://openid.net/specs/openid-connect-rpinitiated-1_0.html)).
- **Privacy:** do not display a previous user's details during initialization, sign-out, or account switching; do not retain private content in an unpartitioned history/cache.

For session/BFF implementations, the client sequence is `initialize adapter -> resolve session -> render -> use supplied authenticated requests -> handle expiration/denial -> invoke logout -> clear scoped presentation`. For public OIDC implementations, it is `SDK initialize -> begin Code+PKCE -> SDK callback completion -> resolve account -> acquire resource-specific token -> call intended resource -> bounded renewal or reauthentication`; neither sequence includes writing an identity server.

Useful authentication evidence covers manager/paste behavior, keyboard focus, cancellation, wrong/expired challenges, blocked popups, callback reload, provider outage, expired sessions, denied permission, multiple tabs, logout failure, restored pages, and stale responses after account switching. Deterministic SDK/provider substitutes help isolate local behavior, but simulated sign-in does not establish real identity-provider integration.

## Native transfer and front-end safety

Share domain rules, presentation contracts, validation, event/state models, and test scenarios where useful. Adapt routing to platform navigation, providers to environment/DI scope, effects to lifecycle-aware cancellation, and accessibility to native controls.

Define survival separately for redraw/recomposition, destination return, window/activity recreation, restart, and process termination. A ViewModel and UI-local state have different owners/lifetimes; restoration requires an explicit supported mechanism ([Android state hoisting](https://developer.android.com/develop/ui/compose/state-hoisting)).

- **Permissions:** request in task context, explain relevance, handle denial/revocation, and provide fallback.
- **Untrusted input:** treat URLs, imported files, persisted values, and markup as untrusted; do not inject user HTML/SVG directly.
- **Public client:** never ship secrets or claim front-end guards enforce authorization. Separate diagnostics from user messages and avoid sensitive content in logs/URLs/caches.
- **Platform handles:** do not retain a DOM node/native view inside a long-lived model without a justified lifecycle; isolate capability differences instead of pretending all platforms are identical.

## Testing knowledge and diagnostic coverage

Prefer tests through user-observable behavior and semantic controls rather than private component instances ([Testing Library principles](https://testing-library.com/docs/guiding-principles/)).

The evidence needed depends on the behavior being questioned or changed. These categories help choose relevant tests and interpret their limits; they are not an instruction to run an entire project audit for every prompt.

| Area | Diagnostic coverage |
|---|---|
| Rules and state | Parsing, validation, selectors, transitions, guards, invalid combinations, undo, and reset; isolated deterministic tests make rule failures easier to locate. |
| Components/features | Names, keyboard/pointer actions, focus, drafts, controlled state, errors, cancellation, and per-item concurrency; snapshots alone do not establish interaction correctness. |
| Journeys/navigation | Success, correction, empty/no-results, failure/retry, repeated activation, direct entry, refresh, missing objects, Back/Forward, and leaving/returning. |
| Assets/build | Production output, base paths, missing/blocked formats, media fallback, cold/warm loads, lazy chunks, and generated-download cleanup. |
| Caches/storage | Hit/miss/stale, invalidation after edits, context isolation, late-result repopulation, bounded retention, quota/denial/corruption, eviction, and offline miss. |
| Lifecycle/update | Repeated mounting/navigation, cleanup, hidden/visible return, restored pages, old open tabs, worker updates, and unsaved drafts. |
| Authentication, where present | Callbacks, challenge/recovery, refresh single-flight, expiry versus denial, logout, and cache isolation after account/tenant changes. |
| Accessibility/performance | Manual input/assistive-technology checks and before/after measurements on representative workloads; simulated observations and real field data support different claims. |
| Evidence quality | Actual commands/results, tested environments, limitations, substitutes, deployment assumptions, and residual risks distinguish implemented, observed, simulated, unverified, deferred, blocked, and excluded behavior. |

Deterministic fixtures with controlled time, latency, failure, and cancellation are usually more informative than random failures added for realism. Inapplicable scenarios do not justify new runtime machinery, and unexecuted tests cannot support a claim that verification passed.

## Specification vocabulary and illustrative example

These compact schemas describe the information behind interface decisions; they are not a required response format. They are useful when a task involves clarifying how a user goal relates to pages, components, state owners, or observable behavior.

```text
Page: purpose; route; entries/exits; required context
Regions/sections: purpose -> components -> required data
Actions: intent -> owner -> transition/operation/navigation
States: applicable variants; feedback; recovery
Interaction: keyboard; pointer/touch; focus; announcements
Lifecycle: restoration; reset; unsaved-work policy
Acceptance: observable completion and failure behaviors

Component: purpose; use/avoid; inputs/outputs; state owner
Behavior: disabled/read-only/busy/error/empty; keyboard; focus; dismissal
Lifecycle: dependencies; cleanup; tests

State: meaning; authority; readers/writers; lifetime; transitions
Derivation/persistence: dependencies; restoration; reset; concurrency; privacy

Relationship: unit kind; responsibility; ownership; multiplicity
Dependencies: public contract; allowed/forbidden direction; disposal

Decision: problem; choice; alternatives; benefit; cost; failure modes; revisit trigger
```

Illustrative domain: a local task organizer with list, detail, create, and edit behavior, without accounts or remote persistence. One coherent allocation uses `/tasks`, `/tasks/new`, `/tasks/:id`, and `/tasks/:id/edit`; collection/detail/editor/missing pages; list-query state owned by its destination; draft/validation owned by the editor; one injected in-memory collection; stable task IDs; explicit cancel/commit; missing-item recovery; local search/no-results; and keyboard-operable actions.

Example relationships: `Application owns InMemoryTaskCollection`; `TaskListPresentation reads collection and owns query`; `TaskEditorPresentation owns draft and depends on collection + pure validation`; `TaskEditorView forwards edits/actions and owns focus handles`. Do not add loading for synchronous operations, a global store for local expansion, a service worker without an offline requirement, or backend endpoints for the substitute.

In this example, production navigation/build behavior, ownership, and lifecycle provide useful evidence for the design; they are not a demand to build the example. Its structure illustrates reasoning that can also apply to a different domain or a much narrower task.

Coherent interfaces have meaningful actions and destinations, relationships that match actual code, unambiguous state authority, owned assets, and deliberate cache invalidation where caching exists. When behavior changes, the affected journey and acceptance criteria indicate which boundaries, tests, states, and abstractions need reconsideration; measured performance and honest verification claims remain separate from architectural intent.
