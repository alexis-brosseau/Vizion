---
name: ui-ux-and-styling-expertise
description: "Expert UI/UX, visual-design, component-system, and styling knowledge for designing, implementing, explaining, or reviewing interfaces. Covers usability, accessibility, typography, layout, modular UI libraries, tokens, themes, CSS, Sass, Tailwind, and alternatives; excludes backend architecture and a prescribed brand identity."
metadata:
  version: "1.0"
  edition: "expert-reference"
  document-revised: "2026-11-02"
  research-reviewed: "2026-11-02"
---

# UI/UX, Visual Design, and Styling Expertise

This skill provides the knowledge and judgment of a UI/UX, visual-design, component-system, and styling expert. It connects user understanding, visual expression, interaction behavior, accessible implementation, reusable components, and maintainable styling without prescribing one aesthetic or technology.

The user's prompt supplies the actual task, constraints, platform, and requested output. This reference informs that task; it does not independently assign an application to build, require a design-system project, impose an execution workflow, or prescribe deliverables.

## Applying this expertise

- **Task-relative use:** apply the relevant concepts to explanation, comparison, design, implementation, diagnosis, or review. A typography question does not imply a component-library migration or a product-wide redesign.
- **Contextual judgment:** user goals, expertise, frequency of use, consequences of error, content, input methods, platform, brand, existing code, and maintenance capacity determine which alternatives fit. Sparse consumer flows and dense expert workspaces need not look or behave alike.
- **UI and UX together:** seek improvements to visual clarity and task outcomes together before accepting a compromise. Where goals genuinely conflict, identify who benefits, who incurs the cost, and what evidence could change the decision.
- **Alternatives, not allegiance:** native controls, headless primitives, styled libraries, source-distributed components, and bespoke UI are legitimate options. CSS, preprocessing, utility classes, component scoping, and build-time extraction solve partly different problems and are not automatically mutually exclusive.
- **Evidence-sensitive language:** distinguish a normative requirement, documented mechanism, empirical result, expert heuristic, contextual recommendation, and untested example. A fashionable style or vendor description does not establish comparative superiority.
- **Proportional abstraction:** reuse and governance should earn their cost. A small application can have coherent UI without an independently published design system, and local duplication can be preferable to an incoherent universal component.
- **Knowledge rather than assignment:** diagrams, example contracts, component inventories, and testing matrices below are explanatory options. Their inclusion does not make them mandatory outputs for every task.

## Expertise boundaries

- **Coverage:** UX foundations; information architecture and content; visual hierarchy; composition; typography; color, icons, and imagery; layout and density; responsive adaptation; states and feedback; motion; accessibility; internationalization; ethical interaction; component boundaries and APIs; modular libraries; tokens and themes; CSS architecture; styling tools; evaluation; performance; and system evolution.
- **Relationship to the front-end reference:** application architecture, routing, state management, and functional component behavior have their own reference. This document deepens the design, presentation, styling, and reusable UI-system aspects without replacing that material.
- **Outside this reference:** backend architecture, databases, server authentication and authorization, infrastructure provisioning, a universal brand identity, and a requirement to use any named framework.
- **Web-first, platform-aware:** design reasoning can transfer to native interfaces, but browser CSS, DOM semantics, native controls, accessibility APIs, and measurement units are different implementation systems. Platform documentation, not a superficial visual match, establishes their contracts.
- **Research limits:** this is a source-backed expert synthesis, not a systematic review of all HCI literature or a runtime certification of the example implementations. Standards and official documentation support technical facts; the contextual comparisons and proposed structures are engineering/design recommendations.
- **Version awareness:** sources were reviewed on November 2, 2026. Tailwind examples use the v4 model, Bootstrap references use 5.3 documentation, and Blazor references use the ASP.NET Core 10 documentation URL; these are evaluated contexts, not an instruction to upgrade or a claim about every installed release.
- **Standalone use:** no companion files, connector accounts, proprietary design tools, or skill-library installation are required to read this reference. The existing front-end and backend documents remain separate.

## Expert reasoning model

These lenses are independent dimensions of judgment, not stages that an agent must execute in order. Their depth depends on the task and the consequences of getting a decision wrong.

| Lens | What it clarifies |
|---|---|
| User and task | Who is acting, their goal, knowledge, environment, frequency, constraints, and consequences of error |
| Information and content | What must be understood, compared, entered, found, remembered, or confirmed |
| Perception and visual hierarchy | What attracts attention, what groups together, and whether emphasis matches task importance |
| Interaction and state | Available actions, current state, feedback, latency, cancellation, recovery, and input-method behavior |
| Inclusion and adaptation | Accessibility, language, text growth, zoom, preferences, device constraints, and platform conventions |
| Component and system boundaries | Responsibility, semantics, state ownership, composition, public API, reuse, and dependency direction |
| Styling and delivery | Cascade, scope, tokens, themes, output CSS/JS, browser support, packaging, and rendering cost |
| Evidence and evolution | What observation or testing establishes, what remains uncertain, and how changes affect consumers |

## Knowledge maps and representation options

These representations can clarify a difficult question without becoming a required documentation package. An existing design file, code review, diagram, or compact table can serve the same explanatory role.

| Representation | Useful knowledge |
|---|---|
| Task/journey map | Goals, decisions, dependencies, interruptions, failure and recovery paths |
| Information map | Naming, content grouping, destinations, search and browse relationships |
| Screen/state inventory | Complete states rather than only attractive happy-path screens |
| Visual-role map | Heading, body, metadata, action, status, surface, border, and emphasis roles |
| Component anatomy | Root, label, description, control, icon, error, overlay, trigger, and other meaningful parts |
| Variant/contract map | Valid combinations, defaults, state ownership, events, semantics, and extension points |
| Token/theme graph | Reference values, semantic aliases, component decisions, modes, and resolution |
| Styling/dependency map | Scope, cascade order, exports, style assets, framework adapters, and consumer obligations |
| Evidence matrix | Tasks, users, content, themes, input methods, browsers, and tests relevant to a claim |

## UI, UX, visual design, and design systems

For this reference, UI means the perceivable controls and presentation through which interaction occurs; UX includes the person's experience of pursuing goals over time and across contexts. Visual design addresses composition and expression, while interaction design addresses action and response; in practice these responsibilities overlap rather than forming isolated departments.

A style guide, component library, pattern library, and design system are related but different resources: a design system includes reusable standards and resources together with ongoing stewardship, not merely a folder of components ([Nielsen Norman Group: Design Systems 101](https://www.nngroup.com/articles/design-systems-101/)). Creating and maintaining that system has continuing costs, so the benefits depend on repeated use and organizational context ([Nielsen Norman Group: Design Systems 101](https://www.nngroup.com/articles/design-systems-101/)).

- **Coherence without uniformity:** recurring meanings deserve consistent expression, but different tasks can justify different layouts, densities, or controls. Consistency is useful when it makes behavior predictable, not when it erases important distinctions.
- **Visual quality without a fixed style:** hierarchy, legibility, grouping, meaningful emphasis, and well-resolved states can exist in restrained, expressive, editorial, industrial, playful, or platform-native designs. Those qualities are more transferable than a particular radius, palette, or shadow recipe.
- **System versus product:** a reusable library should make good product decisions easier, not substitute its component catalog for understanding the product. A new workflow may need a feature-specific composition rather than a new universal primitive.

## User understanding, mental models, and human factors

### Understanding users without inventing certainty

Attitudinal research concerns what people say, while behavioral research concerns what they do; qualitative and quantitative approaches answer different kinds of questions ([Nielsen Norman Group: research-method selection](https://www.nngroup.com/articles/which-ux-research-methods/)). Interviews, observation, usability tests, card sorting, tree testing, experiments, and analytics therefore supply different evidence rather than interchangeable proof ([Nielsen Norman Group: research-method selection](https://www.nngroup.com/articles/which-ux-research-methods/)).

| Method | Useful question | Important limitation |
|---|---|---|
| Interview | How do people describe goals, vocabulary, constraints, and remembered experiences? | A stated preference is not an observed ability to complete a task ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) |
| Contextual observation | What happens in the actual environment, including interruptions and workarounds? | Natural context provides less experimental control and observation can influence behavior ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) |
| Card sorting | How do people group and name information? | Grouping concepts is not the same as successfully navigating a completed interface ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) |
| Tree testing | Can people find a destination in an information hierarchy? | It evaluates the hierarchy without establishing the quality of the finished visual interface ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) |
| Task-based usability testing | Where do representative users succeed, hesitate, misunderstand, or fail? | Qualitative discovery and quantitative benchmarking have different sampling needs ([usability testing](https://www.nngroup.com/articles/usability-testing-101/)) |
| Analytics and experiments | What behavior occurs at scale, and what changes under randomized variants? | Recorded events and experimental outcomes answer the questions actually instrumented, not every reason behind them ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) |

- **Personas and assumptions:** a hypothesis about a novice, expert, administrator, or occasional user can help frame a design, but should not be presented as research evidence. Separate known constraints from assumptions and avoid demographic stereotypes standing in for actual goals.
- **Task complexity:** distinguish unavoidable domain complexity from complexity introduced by the interface. Concealing necessary information can reduce apparent complexity while increasing memory, navigation, or comparison work.
- **Environment:** interruptions, glare, one-handed use, assistive technology, low bandwidth, shared devices, and long sessions can change the appropriate design. A polished desktop mockup is only one operating condition.

### Useful principles and their limits

Nielsen's heuristics cover status visibility, real-world language, user control, consistency, error prevention, recognition, efficiency, restrained presentation, recovery, and help; they are broad rules of thumb rather than a specification that determines every layout ([Nielsen Norman Group: usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)). Recognition supplies cues that recall does not, which supports visible labels, recent items, suggestions, and contextual help rather than forcing people to memorize commands or prior screens ([Nielsen Norman Group: recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/)).

- **Affordance and signifier:** distinguish what can actually be done from the signal that suggests it can be done. A raised shape can imply an action, but appearance alone cannot create keyboard support or a truthful action contract.
- **Mapping:** labels, placement, grouping, and feedback should make the relationship between a control and its effect understandable. Familiar conventions are useful starting points, but familiarity depends on the audience.
- **Cognitive load:** reduce unnecessary remembering, translation, and cross-screen comparison rather than simply reducing visible element count. Useful information can lower effort even when it makes a screen denser.
- **Error prevention and recovery:** prevention, confirmation, undo, constraints, and clear recovery are different tools. Repeating a confirmation on every harmless action can impose a cost without addressing the high-risk mistake.

Fitts's law relates movement time to target distance and width along the movement direction, but mouse-edge advantages do not transfer unchanged to touchscreens ([Nielsen Norman Group: Fitts's law](https://www.nngroup.com/articles/fitts-law/)). Hick's original work concerned controlled choice-reaction experiments, not arbitrary multi-step application navigation; familiar search strategies and organized lists complicate its direct application to UI design ([Hick: original abstract](https://www.tandfonline.com/doi/abs/10.1080/17470215208416600), [Interaction Design Foundation: application limits](https://www.interaction-design.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design)).

- **Useful application:** increase the usable area of important targets, support meaningful grouping, and make likely next actions easy to locate. Evaluate the resulting task, not an isolated formula.
- **Misapplication to avoid:** “never show more than seven choices,” “every menu should be shorter,” “fewer clicks always means better UX,” and “every screen needs more whitespace” are not conclusions established by those models.

## Information architecture, content, and navigation

Progressive disclosure can defer advanced or infrequent options while retaining common actions, whereas staged disclosure divides a task into steps; the latter becomes awkward when users must repeatedly compare or alternate between interdependent choices ([Nielsen Norman Group: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)). Naming, grouping, and discoverable access to hidden options matter as much as reducing the initial display ([Nielsen Norman Group: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)).

| Decision | Useful alternatives | Failure to avoid |
|---|---|---|
| Organization | Task-oriented, object-oriented, role-oriented, chronological, or a justified combination | Mirroring an internal org chart or database schema without evidence it fits the user |
| Navigation | Visible primary destinations, contextual links, breadcrumbs, search, recent items, command access | Requiring recall of hidden destinations or using identical labels for different places |
| Disclosure | Inline expansion, an advanced section, a secondary panel, or a separate destination | Hiding a common control only to achieve a cleaner screenshot |
| Multi-step flow | Distinct stages with meaningful progress and preserved data | Splitting tightly coupled choices across screens that prevent comparison |
| Search and browsing | Search for known targets plus categories or filters for exploration | Treating search as compensation for unclear structure |
| Microcopy | Specific action labels, nearby instructions, consequence and recovery wording | “Submit,” “Invalid,” or “Something went wrong” when a more useful explanation is available |

Visible labels and programmatically associated instructions help communicate form purposes; placeholder text disappears during entry and is not a replacement for labels ([WAI: labeling controls](https://www.w3.org/WAI/tutorials/forms/labels/), [WAI: form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)). Additional instructions can be associated with a field through `aria-describedby`, while useful information should also remain available visually ([WAI: form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)).

- **Content as a design material:** real headings, labels, errors, units, names, and translated strings affect component dimensions and hierarchy. Short placeholder content can conceal a structurally weak design.
- **Language hierarchy:** a primary action should explain the outcome; secondary and destructive choices should remain understandable rather than relying on color or placement alone. Terminology should agree across navigation, headings, controls, and feedback.
- **Helpful versus hidden:** contextual help can reduce clutter without removing access to the explanation. A tooltip is a poor sole home for a required format, a material charge, or the consequence of a consequential choice.
- **Page, panel, or dialog:** choose according to context preservation, content size, comparison needs, navigation expectations, and interruption cost. A modal is not a shortcut for deciding where a substantial workflow belongs.

## Visual hierarchy, composition, and style

Scale, contrast, alignment, balance, whitespace, and Gestalt grouping can communicate relationships and direct attention; proximity is particularly useful for associating labels with the controls or content they describe ([Nielsen Norman Group: visual-design principles](https://www.nngroup.com/articles/principles-visual-design/)). Their purpose is not to maximize contrast everywhere, but to make relevant differences and groupings understandable ([Nielsen Norman Group: visual-design principles](https://www.nngroup.com/articles/principles-visual-design/)).

### Compositional relationships

- **Hierarchy:** establish the relative importance of page purpose, sections, primary action, supporting information, and status. If every element is equally large, saturated, bold, or elevated, emphasis stops being selective.
- **Proximity and common region:** use spacing and, where helpful, a shared surface or border to show membership. A card around every fragment can create competing groups rather than clarify them.
- **Alignment and rhythm:** recurring baselines, edge relationships, spacing roles, and component proportions can make a page coherent. Deliberate asymmetry is compatible with coherence; accidental near-alignment usually deserves a reason.
- **Contrast:** size, weight, value, hue, position, texture, and motion are different channels of emphasis. Do not make meaningful text unreadable just to subordinate it.
- **Whitespace:** use space to distinguish relationships, improve scanning, or focus attention. Its useful amount depends on content and task; empty area is not itself a usability outcome.
- **Balance:** consider the distribution of visual weight rather than requiring symmetry. Dense regions, imagery, strong color, and large text can each dominate a composition.

These are contextual design recommendations derived from compositional principles, not experimentally universal pixel formulas. A consistent spacing vocabulary is often useful, but neither an 8-pixel grid, the golden ratio, three type sizes, nor one corner-radius scale is mandatory for every interface.

### Visual approaches as options

The following comparisons are design reasoning, not a ranking or a claim that one visual family has universally superior usability. The useful question is what the treatment communicates and whether the full interaction remains legible and operable.

| Approach | Potential fit | Costs and cautions |
|---|---|---|
| Restrained or flat | Information-led products, familiar controls, low decorative emphasis | Weak boundaries or invisible affordances if restraint removes necessary signals |
| Layered or material-like | Surfaces, overlays, spatial relationships, strong interaction-state language | Elevation without meaning, too many nested surfaces, copying a platform vocabulary without adapting it |
| Expressive or brand-led | Products where identity, emotion, discovery, or narrative is important | Display type, animation, and imagery displacing the actual task |
| Skeuomorphic or tactile | Familiar physical metaphors that genuinely clarify a control or activity | Metaphors that imply unavailable behavior or become an obstacle to unfamiliar users |
| Translucent or glass-like | Selected overlays or decorative regions with controlled backgrounds | Contrast varying with content behind the surface, expensive effects, weak forced-color fallback |
| High-density or utilitarian | Repetitive expert work, comparison, monitoring, and information-rich tools | Crowding without grouping, undersized targets, weak typography, no room for errors or translation |
| Platform-native | Conventions and system controls are valuable for the audience and environment | Assuming one platform's pattern transfers unchanged to every other platform |

## Typography and readable information

A typography system coordinates family, size, line height, and roles rather than treating each text element as an isolated styling choice; USWDS demonstrates that identical nominal scales can require typeface-specific normalization ([USWDS: typesetting with tokens](https://designsystem.digital.gov/design-tokens/typesetting/overview/)). Font loading and fallback metrics also affect when text is visible and whether a layout shifts ([web.dev: font best practices](https://web.dev/articles/font-best-practices)).

| Concern | Useful decisions | Non-obvious pitfall |
|---|---|---|
| Roles | Display, page title, section heading, body, label, supporting text, code, numeric data | Many sizes without a meaningful hierarchy |
| Family and weight | Readability, glyph coverage, tone, available weights, numeral forms | A requested weight or script falling back differently from the sample mockup |
| Size and line height | Task density, reading duration, font metrics, user scaling | Fixed line boxes clipping taller glyphs or enlarged text |
| Measure | Content width appropriate to sustained reading or rapid scanning | Applying an editorial paragraph width to a data table or short field label |
| Emphasis | Weight, placement, spacing, and explicit wording | Low contrast as the only way to make content secondary |
| Numbers | Alignment, units, precision, tabular figures where useful | Decorative number formatting hiding magnitude or reducing comparison accuracy |
| Truncation | Wrapping, expansion, overflow, or a justified shortened preview | Hiding the distinguishing portion of similar names or exposing it only on hover |
| Fluid sizing | Responsive scale with relative units and tested zoom behavior | Viewport-only formulas that look responsive but prevent adequate text enlargement |

CSS `font-variant-numeric: tabular-nums` selects equal-width number forms for alignment, while `proportional-nums` requests proportional figures ([MDN: numeric font variants](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)). CSS `clamp()` bounds a preferred value, but a fluid-size formula is not by itself evidence that text resizing and reflow requirements are met ([MDN: clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp), [WCAG 2.2](https://www.w3.org/TR/WCAG22/)).

- **Practical scale:** a small, named set of roles can be clearer than dozens of ad hoc values. The right set follows the information hierarchy, not a rule that every app must have exactly three sizes.
- **Pairing:** one family with a sufficient range can be coherent; multiple families can be appropriate when their roles are intentional. A second family should contribute more than unexplained visual variety.
- **Typography and localization:** evaluate actual scripts, diacritics, line-breaking, and fallback rather than assuming a Latin sample proves fit. Text containers should accommodate content growth, not require smaller type to preserve a mockup.
- **Font delivery:** system fonts, a carefully selected web family, variable fonts, and language subsets are alternatives with different identity and delivery costs. Preloading every font can compete with other important resources, and self-hosting or subsetting requires checking the license ([web.dev: font best practices](https://web.dev/articles/font-best-practices)).

## Color, surfaces, icons, and imagery

### Color roles and surface relationships

Role-based tokens separate a color's meaning from its literal value, allowing the role to remain stable while themes assign different values; Carbon provides a concrete example rather than a universal palette ([Carbon: color overview](https://carbondesignsystem.com/guidelines/color/overview/)). Contrast requirements apply to rendered relationships, not simply to whether a named palette contains an “accessible” swatch ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)).

- **Meaning:** distinguish text, supporting text, action, focus, selection, success, warning, error, background, surface, and border roles. A brand color need not serve all of them.
- **Context:** assess foreground/background pairs across default, hover, pressed, selected, focus, invalid, disabled, overlay, and theme conditions. Transparency and imagery can change the actual background relationship.
- **Multiple signals:** pair color with wording, iconography, shape, position, or patterns when color carries information. A red border alone is not a complete error explanation.
- **Surfaces and elevation:** use layers to communicate meaningful containment or overlap. A border, tonal difference, spacing change, or shadow can be alternatives; a shadow is not required on every component.
- **Dark mode:** define semantic relationships for the dark context rather than invert every color. Status colors, shadows, image backgrounds, and selected states may need different treatment.
- **Cultural interpretation:** avoid treating color psychology or symbolism as universal. Meaning also comes from product conventions, surrounding content, and the user's context.

### Icons and images

Icon meanings are often ambiguous, and labels reduce the need to infer an unfamiliar symbol; a hover-only label does not provide an equivalent experience on touch ([Nielsen Norman Group: icon usability](https://www.nngroup.com/articles/icon-usability/)). WAI distinguishes decorative, informative, functional, and complex images because their text alternatives depend on purpose and context ([WAI: images tutorial](https://www.w3.org/WAI/tutorials/images/)).

- **Icon language:** consistent optical size, stroke weight, filled/outlined roles, and alignment can reduce accidental visual noise. Consistency of meaning matters more than obtaining every icon from one file.
- **Icon-only actions:** reserve them for a justified context and retain a programmatic name. A decorative icon next to an adequate text label should not add a redundant spoken label.
- **Images with a job:** informative imagery explains something; functional imagery identifies an action; decorative imagery supports expression without carrying essential meaning. The distinction determines alternatives and the harm caused by a missing image.
- **Data visuals:** important chart information needs an accessible equivalent appropriate to its complexity, not merely `alt="chart"` ([WAI: images tutorial](https://www.w3.org/WAI/tutorials/images/)). Useful supporting choices include direct labels, distinguishable series, units, and a table or structured explanation where the task needs exact values.
- **Avoid:** essential text baked into images, unlabelled ambiguous actions, arbitrary icon mixtures, color-only series distinctions, and decorative art that displaces high-frequency information.

## Layout, spacing, density, and responsive adaptation

CSS Grid can create intrinsic responsive columns with `repeat()`, `auto-fit`, and `minmax()`, while container queries adapt descendants to a containing context instead of only the viewport ([MDN: grid layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids), [MDN: container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)). Visual reordering with Flexbox does not change source reading or sequential keyboard order, so source order still needs to make sense ([MDN: ordering flex items](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)).

| Situation | Useful choices | Avoid or counteract |
|---|---|---|
| Reading-heavy page | A constrained reading region, meaningful headings, consistent paragraph rhythm | Unbounded line length or a narrow column imposed on every screen regardless of content |
| Comparison workspace | Aligned columns, stable labels/units, controlled density, visible context | Turning comparable rows into widely separated cards just because the viewport narrows |
| Reusable card/panel | Intrinsic layout and container-aware adaptation | Assuming the component always occupies the full viewport |
| Narrow screen | Reprioritized arrangement, progressive disclosure, accessible overflow where justified | Shrinking text and controls until a desktop layout fits |
| Large screen | Purposeful content width, secondary context, flexible panels | Stretching every input or paragraph across all available width |
| Long content | Wrapping, growth, bounded scroll regions with clear purpose | Fixed heights based only on short English examples |
| Sticky controls | Persistent actions or context when they materially help | Covering focused fields, errors, translated labels, or content at zoom |
| Dense expert tool | Compact rhythm with preserved targets, grouping, contrast, and shortcuts | Assuming density itself is bad, or using density as an excuse for illegibility |

- **Spacing vocabulary:** distinguish inline spacing, stacked content, field groups, section separation, and page edges. Reusing a meaningful rhythm is more useful than making every value a multiple of one number.
- **Layout primitive:** a stack, cluster, split, container, sidebar, or grid can encode a recurring relationship without knowing the product's business meaning. A layout primitive should not silently own form submission, permissions, or data fetching.
- **Content breakpoints:** change layout when content and interaction stop fitting, then test intermediate widths. Device labels such as “tablet” are useful shorthand, not evidence of the right transition point.
- **Input adaptation:** hover, pointer accuracy, keyboard use, touch, and screen size are separate dimensions. A wide touchscreen and a narrow keyboard-driven window are both plausible.
- **Viewport constraints:** dynamic viewport units account for changing browser toolbars, but do not necessarily track the virtual keyboard by default ([web.dev: viewport units](https://web.dev/blog/viewport-units)). Safe-area insets can help keep controls clear of notches and other occupied edges, but do not replace testing focused fields and persistent actions with the keyboard open ([MDN: environment variables](https://developer.mozilla.org/en-US/docs/Web/CSS/env)).
- **Density modes:** compact and comfortable modes can share semantics and token roles, but must preserve usable controls and text growth. A compact table row is not permission to overlap hit targets.
- **Responsive versus adaptive:** continuous sizing, layout rearrangement, disclosure, and a different interaction pattern are different options. Choose the least disruptive change that preserves the task.

### Illustrative responsive composition

This example demonstrates a component-sized layout rather than a full application or a proven accessible design. Its threshold and visual values are illustrative, and the grid/container mechanisms come from the referenced CSS guidance ([MDN: grid layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids), [MDN: container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)).

```css
.settings-region {
  container-type: inline-size;
}

.settings-layout {
  display: grid;
  gap: 1rem;
}

.settings-layout > * {
  min-inline-size: 0;
}

@container (min-width: 42rem) {
  .settings-layout {
    grid-template-columns: minmax(0, 2fr) minmax(14rem, 1fr);
    align-items: start;
  }
}
```

The single-column base is a useful fallback for this example, not a requirement that every responsive design begin with this structure. The source order should already be meaningful before the second column appears.

## Interaction states, feedback, and recovery

Status visibility, control, prevention, and recovery are related but distinct usability concerns ([Nielsen Norman Group: usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)). A state vocabulary should therefore describe what the interface means, not merely enumerate CSS pseudo-classes.

| State | Meaning to communicate | Design/implementation caution |
|---|---|---|
| Default | Available action or information | A visually empty control may not communicate interactivity |
| Hover | Pointer is over a target | Essential information cannot depend only on hover |
| Focus-visible | Keyboard or other interaction exposes a focus location | Focus is not the same as selected, active route, or error |
| Pressed | Activation is currently occurring, or a toggle is on when semantically specified | A persistent toggle state and a transient pointer-down state need distinct contracts |
| Selected/current | A chosen value, item, tab, or destination | Do not rely only on a subtle color shift |
| Expanded | Related content is available | Icon direction, label, and programmatic state should agree |
| Disabled | Currently unavailable | Explain prerequisites where useful; do not make it appear available |
| Read-only | Visible value cannot be edited | It may still be useful to focus, select, or copy |
| Pending/busy | Work is occurring | Preserve the user's context; a spinner alone does not explain what is happening |
| Invalid | A value or operation needs correction | Explain the problem and how to recover, not just the existence of an error |
| Empty/no results | There is no content, or filters found none | Distinguish first use, filtered absence, and unavailable data |
| Failure/stale | Current data or action cannot be trusted as fresh/successful | Preserve valid input and offer an appropriate recovery path |
| Success | A meaningful operation completed | Avoid disruptive feedback for every trivial interaction |

Native `disabled` suppresses interaction on form controls, whereas `aria-disabled="true"` communicates a state without automatically preventing activation or changing focusability ([MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)). `pointer-events: none` does not disable keyboard activation, so it is not a complete substitute ([MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)).

- **Busy versus disabled:** preventing duplicate work, retaining focus, announcing progress, and indicating unavailability are separate decisions. Automatically disabling every pending control can remove useful discovery or recovery opportunities.
- **Error placement:** inline messages explain the local correction; a summary can help locate multiple problems in a long form. GOV.UK's error-summary pattern moves focus to a linked summary, but that is a system-specific full-page pattern to adapt thoughtfully rather than a command to steal focus during every asynchronous validation ([GOV.UK: error summary](https://design-system.service.gov.uk/components/error-summary/)).
- **Status announcements:** use an appropriate programmatic status mechanism for relevant updates without moving focus; assertive alerts are for important time-sensitive information, not every update ([WAI: status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)). Expanding a disclosure or changing a tab already has a state contract and is not automatically a status message ([WAI: status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)).
- **Recovery:** preserve useful inputs, make retry scope clear, and distinguish “not saved,” “save failed,” “still saving,” and “saved.” Optimistic presentation should not make an uncertain result appear irrevocably complete.

## Motion and perceived responsiveness

Motion can be evaluated as orientation, continuity, feedback, emphasis, or decoration rather than added uniformly. The right question is what information remains if the animation is interrupted, reduced, delayed, or absent.

Animating properties that trigger layout or paint can be expensive; `transform` and `opacity` are often preferable, but actual rendering work still needs measurement and indiscriminate `will-change` can add costs ([web.dev: animation performance](https://web.dev/articles/animations-guide)). `prefers-reduced-motion` exposes a preference to remove, reduce, or replace nonessential movement, not a requirement to remove every meaningful state signal ([MDN: reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).

- **Purpose:** a transition can show where an object went, preserve orientation between views, or confirm a change. A decorative entrance that delays every frequent action has a different cost/benefit balance.
- **Timing:** duration and easing should fit the distance, importance, task frequency, and input. One universal animation duration is no more defensible than one universal layout density.
- **Interruption:** repeated toggles, route changes, keyboard actions, and cancellation should not leave the interface visually or logically stuck between states.
- **Reduced motion:** alternatives include an immediate state change, cross-fade, static emphasis, or less spatial movement. Retain the information the motion was meant to communicate.
- **Loading:** a skeleton, spinner, progress bar, inline status, or retained previous content can each fit a different uncertainty and task. Fabricated progress, endless shimmer, and moving targets can reduce confidence.
- **Avoid:** animating every property through `transition: all`, promoting all elements to layers, scroll-driven decoration that competes with reading, and equating smooth animation with fast task completion.

## Accessibility and inclusive styling

WCAG 2.2 is a W3C Recommendation, while its supporting explanations and techniques help interpret and implement requirements; the selected version, conformance level, scope, and applicable laws still need to be distinguished ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WAI: WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/)). Accessibility includes semantics, keyboard behavior, alternatives, and actual assistive-technology interoperability, not only colors or a library's reputation ([WAI APG: read me first](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).

### Important requirements and distinctions

This is a selective technical reference, not the complete standard or a conformance certificate. Exceptions belong to the individual criterion and should not be expanded into blanket exemptions.

| Concern | Requirement or distinction |
|---|---|
| Text contrast, AA | Generally 4.5:1, or 3:1 for large-scale text; incidental/inactive text and logotypes have specified exceptions ([WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)) |
| Large-scale text | At least 18 point, or 14 point bold, or an equivalent size for CJK fonts; “large” is not simply any heading role ([WCAG definition](https://www.w3.org/TR/WCAG22/#dfn-large-scale)) |
| Non-text contrast, AA | Required visual information for controls/states and meaningful graphical objects generally needs 3:1 against adjacent colors, with specified exceptions; not every decorative line needs that contrast ([WCAG 1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast)) |
| Text resizing, AA | Text can be resized to 200% without loss of content/functionality, with the criterion's exceptions ([WCAG 1.4.4](https://www.w3.org/TR/WCAG22/#resize-text)) |
| Reflow, AA | Vertical-scrolling content works at an equivalent 320 CSS-pixel width without loss or two-dimensional scrolling, except parts requiring two-dimensional layout for meaning/use ([WCAG 1.4.10](https://www.w3.org/TR/WCAG22/#reflow)) |
| Text spacing, AA | No loss when users apply line height of 1.5 times font size, paragraph spacing of 2 times, letter spacing of 0.12 times, and word spacing of 0.16 times, with the criterion's language/script condition; these are override-tolerance tests, not mandatory author defaults ([WCAG 1.4.12](https://www.w3.org/TR/WCAG22/#text-spacing)) |
| Visible focus, AA | Keyboard-operable UI has a mode with a visible focus indicator; visibility is not the same criterion as AAA minimum area ([WCAG 2.4.7](https://www.w3.org/TR/WCAG22/#focus-visible)) |
| Focus not obscured, AA | A focused component is not entirely hidden by author-created content; the stronger “no part hidden” criterion is AAA ([WCAG 2.4.11 and 2.4.12](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum)) |
| Focus appearance, AAA | A qualifying indicator area is at least that of a 2 CSS-pixel perimeter and changes by at least 3:1 in the same pixels; a 2px outline alone does not prove conformance ([WAI: focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)) |
| Target size minimum, AA | Generally 24 by 24 CSS pixels, or the criterion's spacing/equivalent/inline/user-agent/essential exceptions; the spacing test is not simply “24px gap” ([WAI: target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) |
| Target size enhanced, AAA | Generally 44 by 44 CSS pixels, with its own exceptions; this is not a universal WCAG AA minimum ([WCAG 2.5.5](https://www.w3.org/TR/WCAG22/#target-size-enhanced)) |
| Dragging, AA | Provide a single-pointer alternative without dragging unless an exception applies; keyboard accessibility is a separate concern ([WCAG 2.5.7](https://www.w3.org/TR/WCAG22/#dragging-movements)) |
| Hover/focus content, AA | Author-controlled additional content must meet dismissible, hoverable, and persistent conditions with stated exceptions ([WAI: hover/focus content](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)) |
| Redundant entry and authentication | Same-process redundant entry has an A criterion with exceptions; accessible authentication has AA/AAA criteria that recognize assistance such as password managers and copy/paste ([WCAG 3.3.7–3.3.9](https://www.w3.org/TR/WCAG22/#redundant-entry)) |

### Styling implications

- **Focus and selection:** keep focus visible even on selected, pressed, invalid, or dark-themed controls. A selected background is not necessarily a visible location indicator.
- **Forced colors:** shadows and some backgrounds can disappear, and system colors depend on native semantics; replacing a button with a `div role="button"` does not reproduce all native forced-color behavior ([MDN: forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)). A real border or outline can preserve a boundary when a shadow-only treatment disappears.
- **User preferences:** support the relevant text, contrast, motion, and color preferences without overriding them merely to preserve a screenshot. Broad `forced-color-adjust: none` can remove adaptations people depend on ([MDN: forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)).
- **Native before custom:** native controls supply behaviors that ARIA roles do not; an ARIA role promises a contract the author must implement ([WAI APG: read me first](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)). A custom interaction can be appropriate, but it carries implementation and testing responsibility.
- **Complete interaction:** names, relationships, keyboard behavior, focus movement, error communication, and touch operation matter alongside the visual style. An automated scan or an attractive component story cannot establish all of them.
- **Comfort versus minimum:** meeting a minimum target or contrast criterion does not prove that a particular user population can work comfortably for hours. Larger targets, higher contrast, or alternate density can be appropriate beyond the selected minimum.

## Internationalization and platform adaptation

Translations can expand text, direction should be declared in markup, language names should be recognizable to their readers, and images/examples can carry cultural assumptions ([W3C: internationalization quick tips](https://www.w3.org/International/quicktips/)). Logical CSS properties express inline/block relationships instead of hard-coding every relationship as left/right/top/bottom ([MDN: logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)).

- **Content stress:** long names, long translations, mixed scripts, large numbers, units, and unknown-length errors belong in the design space. Text shrinking is rarely an adequate general solution.
- **Direction:** use meaningful document direction and logical spacing; a mixed-direction identifier or number may need explicit treatment. Mirroring all icons indiscriminately can change meaning rather than localize it.
- **Locale:** formatting and input expectations for dates, numbers, currencies, addresses, names, and sorting may differ. A locale is not the same thing as a language choice or a flag.
- **Source order:** a visually reversed layout must not silently produce a confusing reading or keyboard sequence. Visual arrangement and logical content structure are related but distinct.
- **Native transfer:** share semantic roles and interaction intent where useful, then map them to platform mechanisms rather than forcing browser implementation details into native code.

Apple's guidance distinguishes platform-specific typography, scaling, control sizes, and accessibility preferences, while Android Compose documents 48 dp interactive targets and automatic expansion behaviors with overlap caveats ([Apple: accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Android: Compose accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults)). Those native points/dp and web CSS pixels should not be presented as one universal interchangeable target-size rule.

React Native uses JavaScript style objects and style arrays with later entries taking precedence, but it also documents differences from web CSS ([React Native: style](https://reactnative.dev/docs/style)). A web token's semantic meaning can transfer even when the native layout, font, state, and control implementation must differ.

## Balancing visual quality and usability

Attractive interfaces can influence perceived usability and make minor problems less noticeable during evaluation, but the effect does not establish successful task performance ([Nielsen Norman Group: aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/)). Tractinsky and colleagues' ATM-surrogate abstract reports relationships between perceived aesthetics and perceived usability, while Tuch and colleagues' later online-shop experiment did not find a universal aesthetics-to-usability effect and found context-dependent effects in the other direction ([Tractinsky et al.: abstract](https://academic.oup.com/iwc/article-abstract/13/2/127/898608), [Tuch et al.: full paper](https://bpb-us-e1.wpmucdn.com/wp.wwu.edu/dist/8/2868/files/2018/04/Tuch-et-al-2012-Is-Beautiful-Usable-2don1em.pdf)).

The practical conclusion is to assess appearance and task experience separately and then together, not to claim that beauty always causes usability or that usability makes appearance irrelevant. The cited studies have different tasks and manipulations; they do not justify a universal numerical formula for the trade-off.

| Apparent conflict | Possible improvement to both | When a real trade-off remains |
|---|---|---|
| Minimal appearance versus discovery | Clear grouping, concise labels, visible primary actions, well-signposted disclosure | A constrained surface may still require prioritizing less frequent actions |
| Branding versus readability | Expressive accents around a legible content/control system | A brand treatment may need adaptation or an alternate accessible treatment |
| Density versus clarity | Aligned data, meaningful grouping, compact rhythm, useful column priorities | Different expertise/input needs can justify density choices or modes |
| Custom controls versus familiarity | Retain native semantics/behavior while changing appropriate visual roles | Truly novel behavior may require learning and a stronger testing case |
| Rich motion versus speed | Short purposeful feedback with interruption and reduced-motion alternatives | An effect's rendering or attention cost can outweigh its expressive value |
| Safety versus friction | Specific consequences, clear review, reversible actions where possible | A high-consequence irreversible action can justify deliberate confirmation |
| Reuse versus product fit | Share stable semantics and primitives while keeping domain composition local | Generalization may cost more than a separate component |

- **Dual evidence:** observe task completion, errors, recovery, time, confidence, and satisfaction alongside visual coherence and perceived quality. Positive comments should not overwrite observed failures.
- **No invented precision:** aesthetic scores can summarize a defined evaluation, but a vague “UI quality 9/10” is not proof. Explain the criterion, context, and uncertainty instead.
- **Useful friction:** review, confirmation, and explicit consent can protect a consequential decision. “Frictionless” is not the only legitimate goal.
- **Longitudinal fit:** novelty, first impression, repeated use, and expert efficiency can favor different choices. A design that delights once may become tiresome if it repeatedly delays work.

## Ethical persuasion and trustworthy choices

The FTC report describes misleading impressions, hidden material information, unauthorized charges, and subverted privacy choices, including visual prominence, obstructive cancellation, false urgency, and confusing toggles ([FTC: Bringing Dark Patterns to Light](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf)). The report also distinguishes case-specific legal evaluation from the mere presence of a named pattern, so design guidance is not a blanket legal conclusion ([FTC report](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf)).

- **Truthful emphasis:** visual hierarchy should not make a valid refusal look unavailable or conceal material consequences. A visually secondary action can remain clearly legible and honestly available.
- **Meaningful choice:** use understandable labels, transparent defaults, clear scope, and an unambiguous outcome. Avoid double negatives that make the current state uncertain.
- **Reversibility:** cancellation, undo, deletion, consent withdrawal, and recovery should be designed as real user needs, not hidden edge cases.
- **Honest status:** distinguish actual inventory, progress, urgency, social proof, and completion from decorative persuasion. Fabricated certainty can undermine trust even if it improves a short-term metric.
- **Measurement:** conversion, engagement, and retention need guardrails for errors, accidental commitments, cancellation difficulty, support burden, and user goals. A business metric alone is not a complete UX assessment.

## Fragmenting interfaces into components

React's component-hierarchy guidance uses responsibility, design structure, and data organization as useful lenses, while Atomic Design connects atoms, molecules, organisms, templates, and pages as a non-linear mental model ([Thinking in React](https://react.dev/learn/thinking-in-react), [Brad Frost: Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/)). Neither establishes a universal folder structure, a maximum component length, or a rule to extract every wrapper.

### Boundaries and extraction

| Boundary | Reason it can be useful | Failure to avoid |
|---|---|---|
| Semantic unit | A field, action, disclosure, landmark, or table has a coherent purpose | Extracting a visually convenient fragment that breaks label/control or row/cell relationships |
| Behavior/state | A unit owns a meaningful interaction or lifecycle | Splitting tightly coupled state across unrelated siblings |
| Repeated composition | A repeated pattern has stable meaning and variation | Generalizing two superficially similar fragments with different behavior |
| Independent change | The fragment changes for a different reason from its surroundings | Separate files that remain coupled through private DOM and selectors |
| Layout relationship | A stack, grid, split, or container encodes a stable arrangement | A layout abstraction with product-specific conditions and data requirements |
| Feature/domain | Several controls form one meaningful product capability | Putting domain rules inside a generic button or global UI primitive |
| Performance/lifecycle | A real rendering or loading boundary helps | Assuming smaller files automatically reduce rendering or bundle cost |
| Ownership/public API | Several consumers need a maintained contract | Exporting every internal helper and making future refactoring a breaking change |

- **Remain local:** simple markup used once can remain in the parent when its meaning is obvious and its change pattern is cohesive. Readability does not require a named component for every `div`.
- **Private subcomponent:** a complex local fragment can deserve a name without becoming public or shared. Encapsulation and global reuse are different decisions.
- **Shared component:** extraction is stronger when semantics, behavior, and supported variation are stable across real consumers. Repetition can supply evidence, but an arbitrary “three uses” rule is not necessary for obviously standard controls.
- **Separate look-alikes:** a navigational card and a selectable option can share visual tokens while remaining different components. A similar rectangle does not establish a shared interaction contract.
- **Whole and part:** review components in actual compositions as well as isolation. Atomic Design's pages expose content variations that can reveal weaknesses in the underlying parts ([Brad Frost: Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/)).
- **State placement:** common state can belong to the nearest meaningful owner, while derived values need not become duplicate state; the owner may be a feature rather than the visual leaf ([Thinking in React](https://react.dev/learn/thinking-in-react)). A reusable control should not acquire knowledge of the entire product merely because it displays that state.

### Composable responsibilities

The following is one illustrative decomposition, not an installed framework API or a prescribed class hierarchy. It separates domain decisions from reusable presentation and interaction responsibilities.

```text
BillingSettingsFeature
  owns: editable billing model, save outcome, domain permissions
  uses:
    SettingsLayout            layout relationship
    PageHeader                title, description, contextual actions
    BillingAddressSection     feature-specific composition
      Field                   label, hint, control, error association
      TextInput               native input contract + visual states
      CountrySelect           appropriate value-selection behavior
    ActionGroup               action layout, not save orchestration
      Button                  native action semantics + visual variant
    SaveStatus                outcome presentation and announcement
```

An alternative is a more compact feature component using native fields and a few shared CSS classes. Another is a headless field/control layer with several platform adapters; the right abstraction depends on the consumers and behavior that actually need reuse.

## Component anatomy, APIs, variants, and composition

An API should describe meaningful capability and permitted variation rather than expose every incidental styling value. Explicit parts and supported extension points can preserve useful flexibility without making internal DOM structure public.

| Contract dimension | Useful questions |
|---|---|
| Semantics | Action, link, value entry, selection, navigation, disclosure, status, or composite widget? |
| Anatomy | Which parts are required, optional, replaceable, or semantically connected? |
| State | Which state is internal, externally controlled, derived, or transient? |
| Events | What changed, what information is passed, and is an action cancelable? |
| Variants | Which combinations are meaningful, and which would be contradictory? |
| Content | Plain text, icon, rich content, long labels, localized content, or arbitrary children? |
| Focus/refs | Which node receives focus, measurement, or programmatic access? |
| Styling | Tokens, finite recipes, documented parts/slots, class/style hooks, or theme-level overrides? |
| Compatibility | What behavior and styling are promised to existing consumers? |

Radix supports controlled and uncontrolled behavior where applicable and exposes parts that consumers can compose, while React Aria exposes interaction states through data attributes, classes, slots, and render props ([Radix: introduction](https://www.radix-ui.com/primitives/docs/overview/introduction), [React Aria: styling](https://react-spectrum.adobe.com/react-aria/styling.html)). These are mechanisms for implementing a contract, not reasons to expose every mechanism in every product API.

- **Finite variants:** axes such as intent, emphasis, size, and density can be clearer than unrelated booleans such as `red`, `small`, `quiet`, and `isSpecial`. Do not add an axis unless its combinations remain meaningful.
- **Separate concepts:** visual emphasis, destructive intent, pending state, disabled state, and selection are different concepts. One `variant` string that encodes every combination can become as unwieldy as dozens of booleans.
- **Composition:** slots/children can express structure; a closed prop interface can express a stable simple component. Arbitrary composition is not automatically better when it permits invalid nesting or makes required labels disappear.
- **Controlled versus uncontrolled:** controlled state supports coordination with a feature owner; internal state can simplify a standalone control. The API needs a clear meaning for initial value, current value, and change notification rather than two competing sources of truth.
- **Escape hatches:** a class, style, slot, or render hook can be useful, but broad access can become an undocumented contract. A narrowly supported part can be more sustainable than a consumer targeting the third nested `div`.
- **Polymorphism:** changing the rendered tag can change keyboard, focus, form, and navigation semantics. A styled anchor and a styled button can share appearance without becoming the same interaction.
- **Ref/version compatibility:** focus and measurement hooks must reach the intended DOM node. The mechanism depends on the framework and installed version; do not copy an old ref-forwarding recipe as a timeless requirement.

With Radix `asChild`, custom components must pass through the required props and refs, and the consumer remains responsible for choosing an accessible functional element ([Radix: composition](https://www.radix-ui.com/primitives/docs/guides/composition)). Prop merging is therefore part of behavioral integration: losing an event, name, relationship, or focus target can break a component while leaving its screenshot unchanged.

### Illustrative variant contract

This conceptual TypeScript example demonstrates valid combinations rather than a production button implementation. Styling, focus, event behavior, and actual framework attributes still belong to the implementation.

```ts
type IconName = "add" | "edit" | "close"; // illustrative icon set

type ButtonAppearance = {
  intent?: "neutral" | "primary" | "danger";
  emphasis?: "solid" | "outline" | "quiet";
  density?: "comfortable" | "compact";
};

type ButtonContent =
  | { label: string; icon?: IconName; iconOnly?: false }
  | { label: string; icon: IconName; iconOnly: true };

type ButtonState = {
  disabled?: boolean;
  pending?: boolean;
};

// The icon-only branch still requires a meaningful label.
// State does not silently decide what "pending" disables.
```

The same design can be represented with a smaller API when fewer variations are needed. A type system can reject some combinations, but cannot establish whether the chosen label or interaction is useful.

## Headless behavior, styled controls, and product patterns

Headless or unstyled primitives can supply interaction behavior while leaving appearance to the consumer; Radix and React Aria document that separation explicitly ([Radix: introduction](https://www.radix-ui.com/primitives/docs/overview/introduction), [React Aria: styling](https://react-spectrum.adobe.com/react-aria/styling.html)). “Unstyled” does not mean “no structure, state contract, or integration responsibility.”

| Layer | Typical responsibility | Usually does not own |
|---|---|---|
| Foundations | Semantic decisions, tokens, typography roles, spacing, surfaces, motion vocabulary | Product workflows and fetching |
| Layout primitives | Stack, cluster, grid, container, sidebar, split | Business permissions or save operations |
| Behavior primitives | Focus, keyboard interaction, disclosure, selection, overlay behavior | A complete brand identity |
| Styled controls | Semantic/behavioral control plus visual recipes and states | Feature-specific domain policy |
| Composite patterns | A coordinated field group, search pattern, filter bar, or confirmation composition | Every use case in every product |
| Feature components | Domain-specific composition and application coordination | The universal public API of a shared library |

- **Headless fit:** valuable when differentiated presentation matters and the team can integrate anatomy, styles, states, content, and testing. It is less attractive if most of that work would simply recreate a suitable styled library.
- **Styled-library fit:** valuable when coherent defaults and available components fit the product. Customization should use documented APIs before brittle internal-selector overrides.
- **Native fit:** valuable when the native behavior meets the need and browser/platform differences are acceptable. The alternative is not necessarily “unstyled”; native controls can participate in a coherent visual system.
- **Custom behavior fit:** appropriate when a genuine requirement cannot be met responsibly by existing behavior. Novel behavior needs a stronger reason than reproducing a screenshot.
- **Accessibility boundary:** a primitive can solve part of an interaction, but application naming, composition, content, focus transitions, and environment still matter. APG explicitly warns that its examples need relevant browser and assistive-technology testing before production use ([WAI APG: read me first](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).

## Modular UI-library architecture

A library is a product for its consumers, not merely shared source files. Its useful boundaries include meaning, dependencies, style delivery, supported extension points, documentation, and change policy.

### Structure and dependency direction

The following is an adaptable structure for a larger web-oriented library. A single application may need only a local `ui/` directory, and a multi-platform organization may need different adapters rather than these exact packages.

```text
ui-system/
  tokens/                 typed source values and semantic aliases
  foundations/            typography, surfaces, resets, base decisions
  layout/                 content-agnostic composition primitives
  behavior/               framework/platform interaction adapters
  components/             styled reusable controls and composites
  patterns/               reusable task-level arrangements
  documentation/          usage, anatomy, states, examples, limitations
  test-fixtures/          representative themes, content, and consumers

product-features/         domain rules and product-specific compositions
```

- **Dependency direction:** foundations should not import a billing feature; reusable controls should not depend on a product router merely to render a label. A component can accept a domain-neutral adapter when integration is genuinely needed.
- **Public versus private:** keep supported entries intentional. Internal parts can change without requiring every consumer to understand the library's current file layout.
- **Packaging:** split packages for a real distribution, ownership, platform, or dependency reason. A package per tiny primitive can create coordination cost without meaningful independence.
- **Framework adapters:** share semantic tokens and suitable pure logic where practical; implement framework lifecycle, events, refs, and platform semantics in the appropriate adapter.
- **Business patterns:** a product's complex address, permission, or billing composition may belong in a feature library rather than the foundational UI package. Reuse scope can be narrower than organization-wide.
- **Documentation:** useful component knowledge includes purpose, when to use/avoid, anatomy, valid variants, state behavior, accessibility, content constraints, customization, and examples in context. This is consistent with the broader system resources described by NN/g ([Nielsen Norman Group: Design Systems 101](https://www.nngroup.com/articles/design-systems-101/)).

### Public exports and CSS delivery

Node package `exports` defines supported entry points and can block previously available undeclared subpaths, making its introduction a compatibility decision ([Node.js: packages](https://nodejs.org/api/packages.html)). Bundlers can also drop imported CSS if side-effect metadata incorrectly declares it removable, even when the JavaScript component remains ([webpack: tree shaking](https://webpack.js.org/guides/tree-shaking/)).

```json
{
  "name": "@example/ui",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./button": "./dist/button.js",
    "./tokens.css": "./dist/tokens.css",
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": ["**/*.css"]
}
```

This is an illustrative ESM-only export/style contract, not a complete package manifest or proof of tree shaking. Actual packages may also need type declarations, assets, conditional exports, peer dependencies, licenses, and bundler-specific configuration.

- **Style entry:** document whether consumers import one stylesheet, per-component styles, token styles, or automatically injected styles. “Import the component” and “its CSS is present in production” are not equivalent facts.
- **Reset ownership:** a shared component package should not unexpectedly replace every host-page default. Embedded widgets and applications can need different reset policies.
- **Tree shaking:** granular exports can make selective consumption possible, but actual output depends on the build and side effects. Inspect the consumer artifact rather than infer savings from folder names.
- **Framework copies:** a React library should not accidentally make its components use a different React module from their renderer; incorrect dependency rather than peer-dependency setup is one documented cause ([React: invalid hook call warning](https://react.dev/warnings/invalid-hook-call-warning)).
- **Portals and theme scope:** React portals retain React-tree context while changing physical DOM placement; CSS custom properties follow their CSS/DOM scope, not React's context graph ([React: createPortal](https://react.dev/reference/react-dom/createPortal), [MDN: custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)). A menu can therefore receive a JavaScript theme object yet miss the CSS variables defined only under the original trigger subtree.
- **Consumer evidence:** a sample built with the library's own dev tooling can hide missing CSS, aliases, and dependency declarations. A small external consumer is often a useful diagnostic representation.

## Design tokens, themes, and design-to-code alignment

The Design Tokens Format Module 2025.10 is a Final Community Group Report, not a W3C Standard; it defines an interchange format rather than an entire design system or runtime theme engine ([Design Tokens Format Module](https://www.designtokens.org/tr/2025.10/format/)). Tokens require a value and a determinable type, aliases can reference other tokens, and circular references must be detected rather than silently resolved ([Design Tokens Format Module](https://www.designtokens.org/tr/2025.10/format/)).

### Token layers and naming

| Layer | Example | Purpose and caution |
|---|---|---|
| Reference/primitive | `palette.blue.700`, `space.3` | Available values; not necessarily a recommended semantic use |
| Semantic | `action.primary.background`, `text.supporting`, `focus.ring` | Stable meaning across themes and contexts |
| Component | `button.primary.background`, `field.border.invalid` | Useful where a component needs independent decisions; unnecessary if it merely renames every semantic token |
| Mode/brand/density mapping | Light/dark, brand A/B, compact/comfortable | Contextual value assignments, not new semantic meanings for every appearance |

- **Meaning over hue:** `text.supporting` survives a palette change more clearly than `gray-600-text`. A semantic role should not silently become a different concept in another theme.
- **Not everything is a token:** one-off art direction or a local measured geometry may not deserve public token status. Token count is not evidence of system maturity.
- **Relationship over swatch:** accessible combinations involve foreground, background, border, focus, selected, and other states. A valid JSON token file cannot certify those relationships.
- **Aliases and overrides:** decide where aliases resolve and which layer consumers may override. A change to a reference token may affect many semantic/component roles, while a component override can intentionally be narrow.
- **Units and transforms:** platform outputs may need different units and representations. Do not discard dimensional, color-space, typography, or composite information merely to fit one tool's simpler variable type.

### Illustrative interchange and runtime output

The JSON below follows the 2025.10 dimension-token structure and demonstrates an alias; it is a small example rather than a complete theme ([Design Tokens Format Module](https://www.designtokens.org/tr/2025.10/format/)). A CSS transform could emit the separate custom properties shown afterward, but that transformation and its naming policy are implementation choices.

```json
{
  "space": {
    "$type": "dimension",
    "base": {
      "$value": { "value": 0.5, "unit": "rem" }
    },
    "field-gap": {
      "$value": "{space.base}",
      "$description": "Gap within a field composition."
    }
  }
}
```

```css
:root {
  --space-base: 0.5rem;
  --space-field-gap: var(--space-base);
}
```

CSS custom properties participate in the cascade and normally inherit, while Sass variables are compiled away and have different assignment behavior ([MDN: custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties), [Sass: variables](https://sass-lang.com/documentation/variables/)). A stored reference token, a generated CSS property, and a design-tool variable are related representations, not automatically identical mechanisms.

### Themes and preference precedence

- **Theme dimensions:** color scheme, brand, density, contrast, and motion can be independent dimensions. Avoid multiplying complete component definitions for every combination when semantic mappings suffice.
- **Preference policy:** an explicit user choice, an account preference, an operating-system preference, and a product default need a clear precedence policy. The appropriate policy depends on the product rather than being fixed by CSS.
- **Browser chrome:** `color-scheme` informs browser-provided controls and UI, while authored colors still need their own theme definitions ([MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)). Setting it does not automatically make a custom interface's colors suitable.
- **First paint:** theme initialization, delivered markup/styles, and later application state should agree. A flash, incorrect native control scheme, or theme mismatch can occur even when a toggle works after initialization.
- **Scope:** overlays, embedded products, and nested brand regions need explicit inheritance boundaries. Broad root tokens are convenient for an app, but inappropriate as an unannounced global dependency for every embedded component.
- **Alias-resolution trap:** a CSS-variable alias can resolve in its defining scope before a different descendant value is available; Tailwind documents this when explaining `@theme inline` ([Tailwind: theme variables](https://tailwindcss.com/docs/theme)). Overriding only a reference variable in a descendant may therefore not change an already resolved semantic alias as expected.

### Design-tool interoperability

Figma modes provide contextual values and inheritance, but its documented token import accepts a particular subset and representation of DTCG types; for example, dimension imports use pixels and several composite concepts are not listed as supported types ([Figma: variable modes](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)). Penpot documents token sets, aliases, themes, and JSON import/export with its own format and resolution behavior ([Penpot: design tokens](https://help.penpot.app/user-guide/design-tokens/)).

- **Source of truth:** choose which representation owns each decision and how changes propagate. Bidirectional editing without conflict policy can create silent divergence.
- **Round-trip evidence:** verify types, units, aliases, mode names, set precedence, color values, and unsupported properties when exchanging files. A claim of format support does not establish lossless equivalence between all tools.
- **Component parity:** matching a visual variant name is not enough; design and code need compatible anatomy, content rules, states, and allowed combinations. Pixel similarity does not prove DOM semantics or keyboard behavior.
- **Generated versus maintained:** mark generated artifacts and preserve the input/transform contract. Manual edits to generated output can be lost even if they look like an easy local fix.

## Build, adopt, adapt, or own the component source

Adopting an existing system, adapting it, and creating a custom one have different implementation and maintenance costs, and extensive customization can reduce the original savings of adoption ([Nielsen Norman Group: Design Systems 101](https://www.nngroup.com/articles/design-systems-101/)). The following alternatives describe mechanisms and contextual fit, not rankings or endorsements.

| Approach | Mechanism and example | Useful fit | Ownership/pitfall |
|---|---|---|---|
| Browser-native controls | Native HTML elements provide a behavior baseline ([MDN: button](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)) | Standard tasks where browser behavior and visual variation are acceptable | Custom appearance can still undermine useful native signals; different platforms can render differently |
| Headless primitives | Radix provides unstyled low-level components with behavior and composition ([Radix](https://www.radix-ui.com/primitives/docs/overview/introduction)) | Distinct visual language with a maintained interaction foundation | Integration still owns styling, content, semantics of substitutions, and whole-flow testing |
| State-exposing unstyled components | React Aria exposes states/slots/render props without default visual styling ([React Aria](https://react-spectrum.adobe.com/react-aria/styling.html)) | Styling systems that need explicit interaction-state hooks | Custom classes, parts, and state selectors need a coherent consumer contract |
| Unstyled component alternative | Headless UI documents components such as disclosure, dialog, popover, tabs, and combobox in its React-facing catalog ([Headless UI](https://headlessui.com/)) | Its available behavior/API and the consumer's styling approach fit | Intended accessibility is not an application-level guarantee; check the actual framework and API version rather than infer parity across packages |
| Packaged styled library | Material UI offers instance, reusable, theme, and global customization paths ([MUI](https://mui.com/material-ui/customization/how-to-customize/)) | Available controls and defaults fit the product and team | Target documented slots/state classes, not generated hash selectors |
| Recipe-oriented styled system | Chakra's documented system supports tokens, semantic tokens, recipes, and slot recipes ([Chakra: theming](https://chakra-ui.com/docs/theming/overview)) | The product benefits from that theme/recipe API | Configuration and token type generation have version-specific contracts; do not mix the documented system API with an older theme-provider recipe |
| CSS-oriented styled library | Mantine exposes theme values through CSS variables and supports CSS Modules alongside component/style props ([Mantine: styles](https://mantine.dev/styles/styles-overview/)) | Its controls and CSS-oriented customization fit | Inline style props have different override behavior from stylesheet classes; vendor claims of comparative performance still need product-specific evidence |
| CSS/component framework | Bootstrap 5.3 supports compiled CSS or source Sass plus CSS-variable customization ([Bootstrap 5.3](https://getbootstrap.com/docs/5.3/customize/overview/)) | Broad cross-stack styling and familiar component patterns fit | Build-time Sass configuration and runtime variables solve different needs; behavioral integrations still matter |
| Source-distributed components | shadcn/ui distributes editable component source rather than only black-box package imports ([shadcn/ui](https://ui.shadcn.com/docs)) | Direct ownership and local adaptation are valuable | Local changes need an upstream/security/bug-fix tracking policy; source ownership is also maintenance ownership |
| Bespoke library | Product/organization owns behavior, API, styling, packaging, and documentation | Requirements or strategic reuse justify the sustained effort | Recreating difficult interactions solely for visual novelty is costly and needs evidence |

- **Selection criteria:** required controls, framework/platform support, accessibility evidence, customization model, browser baseline, styling compatibility, bundle/style delivery, maintenance activity, licensing, migration, and actual integration cost.
- **Adoption depth:** a team can adopt only tokens, only primitives, selected controls, or a larger system. Mixing sources can be valid, but interaction, visual, and maintenance conventions need reconciliation.
- **Wrapper judgment:** wrap a dependency to establish a meaningful local contract or policy, not merely to rename every export. An exhaustive wrapper can hide useful upstream capabilities while preserving all upstream coupling.
- **License scope:** evaluate the actual package, optional modules, icons, fonts, images, and distribution model. A permissive base package does not by itself establish rights for every adjacent asset.
- **Migration:** compare incremental adaptation with replacement. Screenshot appeal alone is a weak reason to discard working behavior and known user conventions.

## CSS fundamentals that styling tools do not replace

The cascade evaluates origin/importance and layers before specificity, then uses additional tie-breakers including scoping proximity and source order ([MDN: cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)). A styling abstraction can generate selectors or styles, but the resulting browser behavior still depends on the relevant CSS mechanisms.

| Mechanism | Why it matters | Hidden failure |
|---|---|---|
| Cascade and layers | Establish whose declarations take precedence | Increasing specificity cannot beat a declaration that already wins in a higher-precedence layer/origin ([MDN: cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)) |
| Specificity | Resolves competing selectors at the applicable cascade level | `:where()` contributes zero, while `:is()`, `:not()`, and `:has()` use their most specific argument ([MDN: specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)) |
| Custom properties | Express inherited contextual values and runtime themes | A syntactically valid variable can become invalid when substituted into a receiving property ([MDN: custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)) |
| Intrinsic sizing | Lets layout respond to actual content | Automatic minimum sizes on flex/grid items can preserve min-content widths and cause unexpected overflow ([MDN: min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)) |
| Grid and flex layout | Express two-dimensional and one-dimensional relationships | Visual reordering can diverge from keyboard/reading order ([MDN: grid](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids), [MDN: ordering](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)) |
| Stacking contexts | Determine which local layers can overlap which others | A huge child `z-index` cannot escape its parent's stacking position ([MDN: stacking contexts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)) |
| Container queries | Adapt reusable components to available container space | A size query needs the appropriate query context and containment changes deserve layout evaluation ([MDN: container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)) |
| Logical properties | Express direction-relative sizing and spacing | Inline/block start are not permanently left/top ([MDN: logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)) |
| Native nesting | Reduces repeated selector structure in browser CSS | It is not Sass text concatenation; `&__part` does not have Sass's BEM-building meaning ([MDN: nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)) |
| Feature queries | Conditionally apply CSS based on support | A positive `@supports` condition is not a complete layout, interaction, or accessibility test ([MDN: feature queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)) |
| Defaults and resets | Establish the starting presentation | Removing spacing, borders, heading hierarchy, or list markers creates responsibilities to restore useful presentation ([Tailwind: Preflight](https://tailwindcss.com/docs/preflight)) |

### Cascade strategy and override boundaries

For normal declarations, later layers beat earlier layers and unlayered styles beat layered styles; important declarations reverse layer priority, with earlier layers taking precedence over later ones ([MDN: cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)). This is why a cascade-layer plan is not simply a specificity naming convention.

```css
/* Illustrative ordering for one application, not a universal architecture. */
@layer reset, foundations, components, utilities, application;

@layer foundations {
  :where(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
  }
}

@layer components {
  :where(.action) {
    font: inherit;
    border: 1px solid currentColor;
  }
}

@layer application {
  .checkout-action {
    inline-size: 100%;
  }
}
```

- **Layer ownership:** decide where third-party styles, resets, foundations, controls, utilities, and product overrides belong. A layered component rule can lose unexpectedly to an unlayered third-party rule.
- **Specificity budget:** low, deliberate selector weight makes customization easier, but selectors still need to match the intended elements. A universal zero-specificity policy can be as dogmatic as specificity escalation.
- **Importance:** reserve `!important` for a reason that follows from the contract, such as a carefully scoped protection or external integration constraint. It is not a substitute for understanding precedence.
- **Source order:** importing the same files in a different order can change behavior when the rest of the cascade ties. A component that works only under one accidental import order has an implicit contract.
- **Base styles:** a reset is a design decision with consequences. For example, Tailwind Preflight intentionally removes default heading sizing and list markers; an application must provide the hierarchy and list treatment it needs ([Tailwind: Preflight](https://tailwindcss.com/docs/preflight)).

### Sizing, overflow, and layering judgment

- **Content growth:** flexible tracks, wrapping, and minimum/maximum constraints can be preferable to fixed dimensions. A fixed control height can be appropriate only if text growth, labels, and interaction states remain accommodated.
- **Minimum sizes:** when a flex/grid child refuses to shrink, inspect its automatic minimum before hiding overflow. A targeted `min-inline-size: 0` can be useful, but indiscriminately clipping content merely conceals a problem ([MDN: min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)).
- **Overflow:** a scroll container, clipped decorative region, and truncated value solve different problems. Preserve access to meaningful content and controls rather than applying `overflow: hidden` as a universal repair.
- **Stacking:** transforms, opacity, positioning, containment, and other properties can establish separate contexts; a numeric `z-index` scale is only part of the layering model ([MDN: stacking contexts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)). Overlays require knowledge of the actual containing and stacking context.
- **Top layer:** native popovers appear in the top layer and are not clipped by a parent's ordinary position/overflow rules, but `auto` and `manual` popovers have different dismissal behavior ([MDN: popover](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)). Top-layer placement does not itself establish modal semantics or the correct focus contract.
- **Units:** relative lengths, viewport/container lengths, pixels, percentages, and content-based sizing answer different questions. Evaluate text, layout, pointer area, and platform unit conversions separately rather than declaring one unit universally correct.

## Styling architecture and scope

BEM describes block/element/modifier naming; CUBE emphasizes composition, utilities, blocks, and exceptions; ITCSS addresses CSS organization at scale ([BEM: naming](https://getbem.com/naming/), [CUBE CSS](https://piccalil.li/blog/cube-css/), [Harry Roberts: ITCSS](https://csswizardry.com/2018/11/itcss-and-skillshare/)). These methodologies organize responsibility, while CSS Modules, framework scoping, `@scope`, and Shadow DOM introduce different kinds of scope or encapsulation.

| Approach | Mechanism and useful context | Limit or integration cost |
|---|---|---|
| Global CSS with conventions | Shared foundations and explicit class contracts; useful in small or document-oriented systems | All consumers participate in the global cascade; naming and ownership need care |
| BEM | Named standalone blocks, related elements, and modifiers ([BEM](https://getbem.com/naming/)) | Naming discipline does not isolate the browser cascade or decide component behavior |
| Layered architecture / ITCSS-inspired organization | Progressively organized CSS responsibilities at scale ([ITCSS introduction](https://csswizardry.com/2018/11/itcss-and-skillshare/)) | Useful conceptual layers still need concrete file, selector, and override policy; not every small app needs the same hierarchy |
| CUBE | Composition/global foundations plus utilities, small blocks, and exceptions ([CUBE CSS](https://piccalil.li/blog/cube-css/)) | Requires understanding inheritance and contextual composition rather than assuming every component is isolated |
| CSS Modules | Local class/animation names and imported name maps ([CSS Modules](https://github.com/css-modules/css-modules)) | Class-name scoping does not remove inherited/global style influences; build/distribution setup still matters |
| Framework-scoped styles | Compiler rewrites/selectors associated with a component ([Vue](https://vuejs.org/api/sfc-css-features.html), [Svelte](https://svelte.dev/docs/svelte/scoped-styles)) | Scope and specificity rules differ by framework; deep selectors can expose internal coupling |
| Native `@scope` | Bounds selector matching to a subtree with optional scope limits ([MDN: @scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)) | Inherited values can cross limits; support and selector behavior need target-browser checks |
| Shadow DOM | A separate tree with stylesheet encapsulation and explicit extension mechanisms ([MDN: Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)) | Theming, parts, slots, events, and accessibility integration need an intentional contract; closed mode is not a security boundary |
| Runtime CSS-in-JS | Component/theme-driven style generation and injection ([styled-components](https://styled-components.com/docs/advanced)) | Serialization, dynamic-value churn, style insertion, and rendering integration need measurement and compatible configuration |
| Build-time style extraction | Typed authoring transformed into static CSS, such as vanilla-extract ([vanilla-extract](https://vanilla-extract.style/)) | Build integration and supported static/dynamic expressions constrain authoring; runtime values still need a mechanism |
| Utility-first styling | Finite utility APIs composed at use sites and from theme values ([Tailwind: theme variables](https://tailwindcss.com/docs/theme)) | Repeated semantic recipes, class detection, variants, and override conventions still require design |

- **Combine deliberately:** BEM can coexist with Sass; CSS Modules can coexist with semantic tokens; utilities can coexist with component classes. Combination is useful when it clarifies responsibility, not merely because every tool is familiar.
- **Avoid parallel authorities:** if both a theme object and CSS variables define the same colors, clarify which is generated from which. Two independent sources can drift.
- **Global is not inherently bad:** deliberate typography, inheritance, and layout composition can reduce repetition. Unowned global overrides and accidental element selectors are a different problem.
- **Scoped is not inherently safe:** a component can still depend on inherited properties, layout context, undocumented child markup, or external themes. Scope solves a narrower problem than full independence.
- **Public customization:** tokens, supported parts, variants, and documented overrides are preferable to consumers learning private nesting. For Shadow DOM, `::part()` and `exportparts` expose explicit styling hooks rather than the entire internal tree ([MDN: parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)).

## Native CSS, Sass/SCSS, Tailwind, and CSS-in-JS

### Compare the actual abstraction layers

Native CSS is the browser language; Sass/SCSS is preprocessing; CSS Modules is a scoping/build convention; Tailwind is a utility-oriented styling/build system; component libraries provide higher-level controls. Their different responsibilities are why “CSS versus Tailwind versus Material UI” is often an incomplete comparison.

| Choice | Useful reasons to choose it | Reasons to reconsider or constrain it |
|---|---|---|
| Native CSS | Direct browser model, progressive enhancement, fewer transforms, document/global composition | Team may still need naming/scope discipline, compatibility handling, and reusable recipes |
| Sass/SCSS | Existing source investment, compile-time functions/mixins/modules, structured generation | Runtime themes still need CSS or another runtime mechanism; excessive generation and nesting can produce unwieldy output |
| CSS Modules plus CSS | Local class contracts with familiar CSS and component co-location | Requires compatible build/output conventions and a plan for shared tokens, global foundations, and consumer styling |
| Tailwind v4 | Utility vocabulary, theme-generated APIs, state/responsive composition near markup | Modern-browser baseline, static class detection, long repeated recipes, and consumer build assumptions may not fit |
| Runtime CSS-in-JS | Programmatic composition and theme integration that genuinely help | High-frequency serialization/dynamic output, SSR/streaming integration, or delivery requirements may favor another mechanism |
| Build-time extracted styles | Typed authoring with generated static CSS and controlled runtime variables | Build-system constraints and static analysis can limit some dynamic authoring patterns |
| Hybrid | Different layers have clear separate jobs | Duplicated theme authorities, incompatible preprocessors, conflicting resets, and opaque override order |

These are contextual recommendations rather than measured performance rankings. Build/runtime costs should be assessed in the actual application and consumer pipeline.

### Sass/SCSS expertise

Sass variables are compiled away and assignment is imperative, while CSS custom properties remain available to the browser and can vary by element ([Sass: variables](https://sass-lang.com/documentation/variables/)). Sass `@use` loads module CSS once, uses namespaces, and permits configuration through top-level `!default` variables on the module's first load ([Sass: @use](https://sass-lang.com/documentation/at-rules/use/)).

The first block represents `_control.scss`; the second is its separate `app.scss` consumer. These are distinct illustrative files so that `@use` appears in the consumer before its style rules.

```scss
// _control.scss
$radius: 0.375rem !default;

@mixin control-shape {
  border-radius: $radius;
}
```

```scss
// app.scss
@use "control" with ($radius: 0.5rem);

.field-control {
  @include control.control-shape;
  color: var(--text-primary);
  background: var(--surface-control);
}
```

- **Useful separation:** Sass can generate static structure or resolve compile-time configuration while CSS variables carry runtime semantic values. Neither needs to impersonate the other.
- **Module boundaries:** namespaces and `@forward` can establish a deliberate public Sass API. Loading everything with global names makes ownership and collisions harder to reason about.
- **Nesting:** use it to express a readable local relationship, not to mirror every DOM ancestor. Deep structural dependence makes a harmless markup refactor affect many selectors.
- **Generation:** loops and mixins can make source concise while expanding output substantially. Source brevity is not the same as delivered CSS size.
- **Migration:** native nesting and Sass nesting are not identical syntax; a mechanical replacement can break BEM-style concatenation or selector meaning ([MDN: native nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)).
- **Pitfall:** configuring the same Sass module differently after its first load does not create a second independently configured module instance ([Sass: @use](https://sass-lang.com/documentation/at-rules/use/)). Runtime multi-brand scopes need a suitable CSS/output strategy rather than repeated compile-time reassignment.

The values and module structure are examples, not a required project layout. Compile-time module configuration and the runtime CSS theme values have intentionally different responsibilities.

### Tailwind v4 expertise

Tailwind v4 uses a CSS import/configuration model, and the v3-to-v4 guide documents changed directives, PostCSS integration, JavaScript-config detection, and safelisting behavior ([Tailwind: upgrade guide](https://tailwindcss.com/docs/upgrade-guide)). The reviewed documentation describes v4's modern-browser requirements and states that the workflow is not designed to combine with Sass, Less, or Stylus ([Tailwind: compatibility](https://tailwindcss.com/docs/compatibility)).

- **Version boundary:** do not splice v3 `content`/configuration/plugin recipes into a v4 example without checking the installed integration. A working older project can remain a legitimate context rather than an automatic migration target.
- **Browser boundary:** the compatibility page names Safari 16.4, Chrome 111, and Firefox 128 as core v4 baselines, while some optional platform utilities require more support ([Tailwind: compatibility](https://tailwindcss.com/docs/compatibility)). The baseline is not a guarantee for every utility or every application feature.
- **Static detection:** Tailwind scans source text for complete tokens, not the runtime meaning of string interpolation; map finite variants to complete class strings ([Tailwind: source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)).
- **Library distribution:** dependencies in `node_modules` are excluded by default, so a source-distributed utility-based library may need registered sources or a compiled-CSS contract ([Tailwind: source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)). A library that only works inside its original repository has not solved consumer delivery.
- **Theme API:** `@theme` variables generate utility/variant APIs and must be top-level; ordinary values that do not need generated utilities can remain ordinary CSS variables ([Tailwind: theme variables](https://tailwindcss.com/docs/theme)).
- **Separate processing:** CSS Modules or component styles may need `@reference` when they use Tailwind's theme-aware processing, and processing many separate modules can add build overhead ([Tailwind: compatibility](https://tailwindcss.com/docs/compatibility)). Coexistence is possible, but automatic combination is not necessarily useful.
- **Reset implications:** Preflight removes several browser defaults, including heading presentation and list markers; validate document content and third-party integrations rather than assume the reset is invisible ([Tailwind: Preflight](https://tailwindcss.com/docs/preflight)).

```css
/* Illustrative Tailwind v4 entry, not a complete theme. */
@import "tailwindcss";

:root {
  --action-background: #1d4ed8;
  --action-foreground: #ffffff;
}

[data-theme="dark"] {
  --action-background: #93c5fd;
  --action-foreground: #172554;
}

@theme inline {
  --color-action: var(--action-background);
  --color-on-action: var(--action-foreground);
}
```

```ts
// Detection example: complete utility names exist in the source.
const emphasisClasses = {
  solid: "bg-action text-on-action",
  outline: "border border-action text-action",
} as const;

// Not equivalent for source detection:
// `bg-${color}-700`
```

The CSS demonstrates semantic runtime values exposed through generated utilities; `@theme inline` avoids a documented alias-resolution issue in this pattern ([Tailwind: theme variables](https://tailwindcss.com/docs/theme)). The snippets do not establish that those colors, outlined controls, or class recipes satisfy every state, surface, and accessibility requirement.

### Runtime and extracted CSS-in-JS

Emotion recommends measuring actual bottlenecks, keeping static serialized styles outside repeated renders where appropriate, and using a different mechanism for frequently changing values ([Emotion: performance](https://emotion.sh/docs/performance)). Styled-components documents theming, style insertion, server rendering, and version-dependent server-component behavior, while vanilla-extract describes generating static CSS from TypeScript at build time ([styled-components: advanced usage](https://styled-components.com/docs/advanced), [vanilla-extract](https://vanilla-extract.style/)).

- **Finite versus continuous values:** a small set of semantic variants can map to stable classes; continuously changing coordinates, progress, or per-instance values may fit CSS variables or inline styles better than generating a new class for each value.
- **Rendering integration:** SSR, streaming, hydration, and server-component support depend on the actual library/framework/version and integration. “CSS-in-JS never works on the server” and “all CSS-in-JS is automatically server-safe” are both overly broad.
- **Theme mechanism:** JavaScript context, a CSS-variable scope, generated theme classes, and inline values have different lifecycles. A library that supports one does not automatically supply all the others.
- **Identity:** defining styled component identities inside a render path can create additional work and identity changes; styled-components explicitly cautions about this pattern ([styled-components: FAQs](https://styled-components.com/docs/faqs)).
- **Zero-runtime language:** static style generation avoids that styling runtime, not all application JavaScript, dynamic state, or browser rendering cost. Runtime custom-property changes still need appropriate application behavior.
- **Performance evidence:** compare CSS/JS delivery, style calculation, serialization, rendering, memory, and interaction under representative conditions. A library's small demo or advertised benchmark cannot settle every product's result.

## Framework-specific styling differences

Equivalent component intentions can compile to different style boundaries. The following facts identify mechanisms to account for; they do not rank frameworks.

| Framework/platform | Documented mechanism | Important consequence |
|---|---|---|
| React | UI components and DOM output can use an independently chosen styling mechanism; component hierarchy/state ownership remain separate concerns ([Thinking in React](https://react.dev/learn/thinking-in-react)) | A component boundary does not by itself prescribe class scoping or a style-delivery system |
| Vue SFC | `scoped` rewrites selectors with attributes; child roots can receive parent and child scoped styles, with explicit deep/slotted/global mechanisms ([Vue: SFC CSS](https://vuejs.org/api/sfc-css-features.html)) | Scoped styling does not make every descendant relationship private or every consumer override harmless |
| Svelte | Scoped selectors use generated classes and gain a documented specificity increment; keyframe names are scoped ([Svelte: scoped styles](https://svelte.dev/docs/svelte/scoped-styles)) | A global selector of the same apparent shape can lose to the scoped selector |
| Angular | Emulated scoping is default, with ShadowDom and None alternatives; global styles can affect emulated components ([Angular: styling](https://angular.dev/guide/components/styling)) | `::ng-deep` is discouraged for new use; style encapsulation modes have different integration behavior |
| Blazor | Matching `.razor.css` files are rewritten/bundled at build time and target rendered HTML; `::deep` requires a suitable scoped ancestor relationship ([Blazor: CSS isolation](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation?view=aspnetcore-10.0)) | A selector does not target a Razor component abstraction as if it were an HTML tag |
| Web Components | Shadow trees encapsulate styles and expose deliberate parts/slots/host relationships ([MDN: Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM), [MDN: parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)) | Styling consumers need supported hooks rather than arbitrary access to private descendants |
| React Native | JavaScript style objects/arrays and platform-specific behavior differ from browser CSS ([React Native: style](https://reactnative.dev/docs/style)) | Shared semantic design decisions do not imply sharing every CSS rule or unit |

- **Common implementation:** semantic tokens, content rules, component anatomy, valid states, and ownership principles can often be shared conceptually. Ref/event APIs, slots, compiler scope, injection, and native behavior must follow their platform.
- **Style penetration:** a deep selector or global escape hatch may solve an integration problem, but also couples the consumer to private structure. Prefer an upstream supported slot, token, part, or variant when it fits.
- **Interoperability:** check reset, font, cascade, portal, shadow, and theme assumptions when mixing components. Matching the build syntax is not enough.

## Component and pattern use/avoid knowledge

APG distinguishes controls and composite patterns by semantics and keyboard interaction rather than by the shape of their popup or border ([WAI APG: pattern catalog](https://www.w3.org/WAI/ARIA/apg/patterns/)). The following table adds contextual design recommendations; it is not a directive to implement every component or a replacement for the full functional front-end reference.

| Component/pattern | Useful context | Avoid or counteract |
|---|---|---|
| Button versus link | An action versus a destination | Choosing solely by appearance; a form-associated button needs an intentional type ([MDN: button](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)) |
| Text field / text area | Precise entry with visible label, instructions, and error context | Placeholder-only labels, fixed heights that conceal text, unexplained format constraints ([WAI: form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)) |
| Checkbox / radio / switch | Independent selection, exclusive selection, or an on/off setting | Identical visuals for different commitment models; APG defines distinct patterns ([WAI APG: patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)) |
| Native select / combobox | Value selection; editable filtering when it genuinely helps | A custom “dropdown” that lacks the appropriate value/focus/keyboard contract ([WAI APG: combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)) |
| Slider / spinbutton / numeric entry | Relative adjustment, bounded values, or precise numeric tasks | A slider as the only practical way to enter an exact value; hidden units and constraints ([WAI APG: patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)) |
| Search with filters | Known-item finding and narrowing a meaningful result set | Unclear active filters, no reset/recovery, or “no results” that looks like data failure |
| Tabs | Peer panels within one context | Sequential steps disguised as peers; automatic activation when panel latency makes navigation disruptive ([WAI APG: tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)) |
| Accordion / disclosure | Optional detail or grouped content whose expansion is discoverable | Hiding every essential action or forcing repeated comparison across collapsed sections ([progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)) |
| Navigation disclosure | Show/hide groups of ordinary destination links | Adding application-menu roles solely because the visual is called a menu ([WAI: disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)) |
| Action menu | Compact command choices with a menu keyboard contract | Applying it to every list of links or concealing a dominant frequent action ([WAI APG: menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)) |
| Modal dialog | A bounded interaction that genuinely interrupts the current context | Long parallel workflows, missing initial/return focus, background content that remains operable ([WAI APG: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)) |
| Popover | Contextual non-page content with a deliberate dismissal policy | Assuming top-layer positioning supplies modality or a complete interaction contract ([MDN: popover](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)) |
| Drawer / inspector panel | Preserve context while viewing or editing related information | Ambiguous modal/non-modal behavior, narrow-screen clipping, hidden close path |
| Tooltip | Brief supplementary description available on focus/hover | Required instructions or interactive controls hidden in a tooltip; APG's tooltip pattern itself remains work in progress ([WAI APG: tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)) |
| Toast / inline status / alert | Match feedback prominence and persistence to importance | A disappearing toast as the only record of a consequential failure; assertive announcements for every update ([WAI: status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)) |
| Card / tile / list | Content grouping, browsing, or repeated objects | Putting independent nested controls inside one undifferentiated click target |
| Table | Aligned comparison of row/column information | Converting every data set into cards when comparison is the task; cramped nested table containers ([Carbon: data table](https://carbondesignsystem.com/components/data-table/usage/)) |
| Interactive grid | Spreadsheet-like directional navigation/editing when justified | Adding `role="grid"` merely because a table has a few links; the grid introduces managed focus/keyboard responsibility ([WAI APG: grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)) |
| Tree / treegrid | Meaningful hierarchy with expansion and appropriate navigation | A complex tree replacing a simple list or search; focus and selection conflated ([WAI APG: tree view](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)) |
| Resizable split panes | Side-by-side expert work with adjustable space | Drag-only operation or invisible handles; APG's splitter guidance notes incomplete review ([WAI APG: window splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)) |
| Toolbar / command palette | Frequent commands and expert acceleration | Shortcuts or a palette as the only discoverable route to essential actions |
| Stepper / wizard | Distinct stages with meaningful dependencies | Preventing review or backtracking, losing entered values, or hiding interdependent comparisons |
| Pagination / load more / infinite feed | Bounded navigation, deliberate expansion, or continuous browsing | Endless loading for tasks needing stable position, comparison, or access to content below the feed |
| Skeleton / progress / empty state | Explain waiting, expected structure, absence, and next action | Fabricated completion, an empty illustration without explanation, or motion that masks a stalled state |
| Charts / maps / complex visuals | Spatial/relational understanding that the task requires | Color-only distinctions, hover-only values, no appropriate accessible equivalent ([WAI: images](https://www.w3.org/WAI/tutorials/images/)) |

### Interaction contracts that visual customization must preserve

- **Modal:** opening, initial focus, contained tab sequence, dismissal, title, and return focus are part of the dialog pattern; initial focus can vary for long content or irreversible actions ([WAI APG: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)). A dim backdrop alone does not make something modal.
- **Tabs:** focused and selected tabs may differ in manual activation, and automatic activation is appropriate only when the panel appears without noticeable latency ([WAI APG: tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)). Styling only the selected tab leaves focus visibility unresolved.
- **Grid:** managed directional navigation can reduce tab stops but introduces interaction with editing keys and nested controls ([WAI APG: grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)). It is a behavioral investment, not a decorative role.
- **Tooltip:** extra hover/focus content needs appropriate dismissal, pointer access, and persistence where the criterion applies ([WAI: hover/focus content](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)). A tooltip with focusable content is a different interaction to design.
- **Tree:** selection and keyboard focus are distinct, particularly in multi-select trees, so selected/focused/expanded states need different communication ([WAI APG: tree view](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)). A single background color cannot always carry all three meanings clearly.

## Evaluation knowledge and diagnostic coverage

Usability testing observes representative participants performing realistic tasks, while qualitative problem discovery and quantitative benchmarking answer different questions ([Nielsen Norman Group: usability testing](https://www.nngroup.com/articles/usability-testing-101/)). An attractive screen, automated pass, component snapshot, and successful scripted journey each establish different things.

### Evidence categories and limits

| Evidence | Useful for | Does not establish by itself |
|---|---|---|
| Heuristic review | Plausible problems in visibility, control, consistency, error handling, and other known principles ([usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)) | That representative users will succeed or that no unanticipated problems remain |
| Content/information testing | Naming, grouping, finding, comprehension, and navigation questions ([research methods](https://www.nngroup.com/articles/which-ux-research-methods/)) | Complete visual/interaction quality |
| Formative task testing | How and why users struggle while a design can still change ([usability testing](https://www.nngroup.com/articles/usability-testing-101/)) | A stable population benchmark from an arbitrary small convenience sample |
| Quantitative benchmark | Defined task success, time, errors, or ratings under a specified protocol ([usability testing](https://www.nngroup.com/articles/usability-testing-101/)) | Comparability to a study with different tasks, users, or conditions |
| Visual review | Hierarchy, grouping, type, alignment, state coherence, and expression ([visual-design principles](https://www.nngroup.com/articles/principles-visual-design/)) | Functional correctness or a universal aesthetic preference |
| Component stories | Explicit rendered states with args and, where added, scripted interactions ([Storybook: stories](https://storybook.js.org/docs/writing-stories)) | All real combinations or complete end-to-end journeys |
| Automated accessibility checks | Detectable issues in the checked rendered DOM/ruleset ([Storybook: accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)) | Full conformance, correct task experience, or every browser/AT interaction |
| Visual regression | Changes relative to an approved rendered baseline ([Playwright: visual comparisons](https://playwright.dev/docs/test-snapshots)) | That the baseline was good, the change is harmful, or keyboard behavior is correct |
| Browser/AT interaction testing | Actual relevant keyboard, screen-reader, browser, and interaction combinations ([WAI APG cautions](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)) | Every untested combination or every disability-related need |
| Field/lab performance | Real-world distributions and controlled diagnostic comparisons respectively ([web.dev: Web Vitals](https://web.dev/articles/vitals)) | The complete UX or an explanation of every observed task problem |

- **Representative tasks:** use goals rather than instructions that reveal the interface's answer. “Find the invoice for March” reveals more than “click Billing, then Invoices.”
- **Sampling:** participant needs follow study purpose, user groups, variability, and desired precision. NN/g's small qualitative-study guidance should not become “five users proves this app is usable” ([Nielsen Norman Group: usability testing](https://www.nngroup.com/articles/usability-testing-101/)).
- **Behavior versus ratings:** perceived usability instruments and task outcomes are separate measures; Tuch's study, for example, reports perceived-usability scales alongside completion time, clicks, and success ([Tuch et al.](https://bpb-us-e1.wpmucdn.com/wp.wwu.edu/dist/8/2868/files/2018/04/Tuch-et-al-2012-Is-Beautiful-Usable-2don1em.pdf)). A favorable rating is not a completion rate.
- **Experiments:** define the question, comparison, population, outcome, and harm guardrails before interpreting results. Short-term conversion is an especially incomplete answer when cancellation, recovery, or long-session performance is affected.
- **Prototype fidelity:** a sketch, clickable prototype, and implemented UI can each answer useful questions. Do not infer browser semantics, keyboard interaction, performance, or actual content handling from a prototype that does not implement them.

### State and context coverage

The useful coverage follows the question or change, not a requirement to test the entire Cartesian product on every prompt. A typography change, overlay change, and new library entry point have different evidence needs.

| Axis | Representative conditions |
|---|---|
| Interaction | Pointer, keyboard, touch, focus entry/return, repeated activation, dismissal, cancellation |
| Content | Empty, short, long, translated, RTL/mixed direction, large numbers, unknown/missing values |
| State | Default, selected/current, focused, invalid, busy, disabled, read-only, success, failure, stale |
| Layout | Narrow/intermediate/wide regions, embedded component widths, zoom, text spacing, overflow |
| Preference | Light/dark, explicit theme, forced colors/high contrast, reduced motion, larger text |
| Journey | First use, return, correction, backtracking, interruption, retry, unsaved edits |
| Distribution | Development and production builds, minimal external consumer, style assets present, permitted exports |
| Runtime | Supported browser/AT combinations, relevant native platforms, low-end or busy devices |

- **Stories:** useful stories encode meaningful named states and can include interaction assertions rather than only a static screenshot ([Storybook: writing stories](https://storybook.js.org/docs/writing-stories)). A story matrix should include content and composition cases that can actually break the component.
- **Visual stability:** fonts, browser/OS rendering, hardware, and environment can change screenshots; Playwright recommends keeping baseline and test environments consistent and reviewing baseline updates ([Playwright: visual comparisons](https://playwright.dev/docs/test-snapshots)). Silencing every difference or accepting every new baseline removes the diagnostic value.
- **Accessibility configuration:** an automated check can run too early, omit a ruleset, or report an incomplete result requiring manual assessment ([Storybook: accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)). “Zero reported violations” must retain the tested state and configuration.
- **Behavioral assertions:** names, roles, relationships, focus, state transitions, and visible outcomes usually make better public contracts than private component instances. Visual evidence should complement, not replace, interaction evidence.

## Performance as part of visual and interaction quality

Core Web Vitals evaluate loading, responsiveness, and visual stability rather than the entirety of UX; the reviewed guidance uses LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile, segmented across mobile and desktop ([web.dev: Web Vitals](https://web.dev/articles/vitals)). Lab diagnostics and field experience are complementary, and a lab proxy is not the same as measured field interaction ([web.dev: Web Vitals](https://web.dev/articles/vitals)).

| Styling/UI cost | Relevant questions and options |
|---|---|
| CSS delivery | How much style output is shipped, which parts are used, and whether rendering depends on late arrival |
| JavaScript styling | Whether serialization, dynamic class generation, and theme logic are materially affecting the task; measure before blaming the tool ([Emotion: performance](https://emotion.sh/docs/performance)) |
| Fonts | Required families/weights/scripts, fallback metrics, display policy, and whether preload competes with other important resources ([web.dev: fonts](https://web.dev/articles/font-best-practices)) |
| Motion/effects | Layout/paint/compositing work, large surfaces, blur, shadows, and unnecessary promoted layers ([web.dev: animations](https://web.dev/articles/animations-guide)) |
| Stability | Reserved space, predictable content growth, font changes, and controls shifting while a user targets them |
| Data-rich UI | Actual row/cell/rendering cost versus the interaction and accessibility cost of pagination or virtualization |
| Feedback | Whether a user sees a useful response quickly and retains a clear distinction between accepted input, pending work, and completion |
| Theme changes | Recalculation and first-paint behavior, plus whether nested scopes and overlays remain coherent |

- **Measure the cause:** an expensive image, font request, application computation, or layout can dominate a page whose team suspects the CSS methodology. Architectural preference is not a profiler result.
- **Budget by task:** a rich visual experience and a repetitive administrative tool can justify different visual costs. Both still benefit from purposeful effects and usable fallbacks.
- **Virtualization:** consider it when the measured content/rendering cost warrants the complexity, not merely because a table could grow. Focus persistence, search, screen-reader representation, row context, and variable heights remain design responsibilities.
- **Perceived speed:** immediate acknowledgment and retained context can improve the experience without lying about completion. A fast spinner is not a fast operation.
- **Scope:** caching, service workers, asset pipelines, and broader front-end lifecycle belong in the existing front-end reference. Here the emphasis is the visual/interaction consequences of delivery and rendering choices.

## Documentation, governance, and evolution

Design-system maintenance includes keeping guidelines and resources current and managing contribution and adoption, not simply publishing a first component release ([Nielsen Norman Group: Design Systems 101](https://www.nngroup.com/articles/design-systems-101/)). The appropriate governance can range from a few maintainers with clear ownership to a coordinated multi-team system.

### Useful public knowledge

- **Purpose/use/avoid:** explain what problem a component solves, what nearby alternatives mean, and when a feature-local solution is preferable.
- **Anatomy and behavior:** identify meaningful parts, state ownership, events, keyboard/focus rules, and required content relationships. A screenshot is not the complete contract.
- **Visual decisions:** document roles and constraints rather than only literal CSS values. Include relevant states, themes, density, and content growth.
- **Customization:** identify supported variants, semantic tokens, slots/parts, classes, and escape hatches; distinguish them from private implementation details.
- **Examples in context:** pair isolated stories with realistic content and compositions. Include limits and counterexamples rather than only the most attractive configuration.
- **Ownership:** identify maintainers, proposal/contribution expectations, supported environments, release policy, and the path for reporting defects.
- **Adoption:** evaluate whether the system reduces repeated work and supports real product needs; counts of components, tokens, or imports alone are incomplete measures.

### Compatibility and change

SemVer bases major/minor/patch meaning on a declared public API, and deprecation should be documented before removal through the corresponding release policy ([Semantic Versioning 2.0.0](https://semver.org/)). A UI library must therefore clarify whether its promised contract includes token names, slots, visual geometry, state behavior, CSS entry points, and accessibility behavior rather than assuming TypeScript signatures describe everything.

| Change | Compatibility question |
|---|---|
| Renamed semantic token | Are consumers expected to use it, and does an alias/migration preserve the role? |
| Changed padding or type metrics | Does it break promised composition, target sizing, truncation, or content fit? |
| Different rendered element | Does semantics, focusability, form submission, or styling change? |
| New default state/behavior | Does existing consumer logic or the user's learned workflow change? |
| Removed part/class/slot | Was it documented public customization or only an internal accident? |
| New exports map | Does it preserve the supported entry points consumers already use? ([Node.js: packages](https://nodejs.org/api/packages.html)) |
| Different style entry/injection | Will production consumers still receive styles in the intended cascade? |
| Accessibility correction | What user behavior improves, what migration is needed, and what downstream assumptions change? |

- **Policy over guesswork:** a visual change is not automatically a patch or automatically a major release. Its status follows the public contract and downstream impact.
- **Deprecation:** a meaningful replacement, documented rationale, compatibility period, and migration example can be more useful than an unexplained removal warning.
- **Exception handling:** a product-specific exception can be legitimate. Record why it differs and whether the shared system should evolve, rather than turning every exception into another global boolean.
- **Contribution evidence:** a new component or variant should solve a recognizable need and demonstrate coexistence with existing patterns. A one-off screenshot does not automatically justify a public abstraction.
- **Design/code drift:** align names, anatomy, states, and supported variations across design resources and implementation. A visual-only audit can miss an API that permits combinations the design never considered.
- **Sustainable scope:** maintaining fewer well-understood components can be better than publishing a broad incomplete catalog. Optional complexity should follow actual consumers.

## Context-specific design judgment

These comparisons are contextual synthesis, not universal performance claims. They illustrate why a single fashionable style or component stack cannot answer every product question.

| Context | Often-important priorities | Reconsider when |
|---|---|---|
| Expert productivity tool | Density, stable placement, comparison, keyboard efficiency, bulk operations, recovery | A sparse consumer-style layout adds repeated navigation or hides essential context |
| Dashboard/monitoring | Hierarchy, units, update status, meaningful alerts, time range, anomaly explanation | Equal-sized decorative cards obscure the truly consequential signal |
| Public-service or high-stakes form | Clear wording, labels, instructions, error recovery, confidence, review | Novel controls or hidden instructions increase uncertainty and correction work |
| Consumer transaction | Understandable choices, honest cost, progress, reversibility, trustworthy confirmation | Conversion emphasis suppresses refusal, material terms, or recovery |
| Editor/creative workspace | Persistent work state, tool discoverability, selection/focus distinctions, precision | Icon-only commands and gestures lack discoverable alternatives |
| Mobile/one-handed task | Reach, target spacing, interruption, useful input types, contextual actions | A compressed desktop composition preserves appearance but not operability |
| Rich brand/marketing experience | Expression, reading flow, content priority, purposeful motion, performance | Visual novelty competes with comprehension, preference support, or required action |
| Embedded widget/library | Host compatibility, isolated responsibility, explicit themes/styles, bounded dependencies | Global reset or hard-coded app assumptions leak into unrelated host content |
| Multi-brand/multi-platform system | Semantic roles, supported adapters, controlled variants, ownership | A universal component erases platform conventions or accumulates contradictory props |

- **Transferable principles:** truthful state, readable content, clear relationships, meaningful actions, and recovery remain valuable. Their visual and technical realization can differ.
- **Evidence standard:** preference, convention, conformance, and measured effectiveness answer different questions. A contextual recommendation should retain its assumptions rather than become a prohibition elsewhere.

## Failure patterns and diagnostic alternatives

This catalog connects symptoms to plausible causes and options; it is not proof that any one cause applies to an unseen project. The earlier topic sections provide the mechanisms and evidence behind the relevant diagnoses.

| Symptom | Plausible cause | Useful alternatives |
|---|---|---|
| Everything looks equally important | Too many strong accents, weights, surfaces, or competing headings | Re-establish content/action roles; reduce redundant emphasis rather than making all text smaller |
| A clean screen is hard to use | Essential actions, labels, or context were hidden for minimalism | Expose common needs, label uncommon icons, and make disclosure discoverable |
| A polished prototype fails with real text | Fixed sample content and geometry drove the design | Test long, translated, missing, and mixed-direction content; permit growth and wrapping |
| Components have dozens of booleans | Unrelated concepts and exceptions share one API | Separate semantic axes, use composition, or split genuinely different components |
| Similar components cannot be shared cleanly | Appearance was mistaken for shared semantics | Share tokens/recipes while retaining different behavior components |
| Shared UI contains product permissions | Feature/domain ownership leaked into reusable controls | Keep domain rules in a feature owner and pass meaningful generic state/actions |
| Dialog or menu has incorrect colors | Physical DOM location lies outside the CSS theme scope | Theme the appropriate portal host or use a deliberately scoped overlay container |
| Production UI is unstyled | Missing style entry, dropped side-effect CSS, or undetected utilities | Inspect production output, CSS metadata/imports, and Tailwind consumer-source registration |
| Increasing `z-index` does nothing | The component is confined by another stacking context | Inspect ancestor contexts; choose a justified overlay/top-layer strategy |
| A more specific selector still loses | Origin, importance, or layer priority wins earlier | Diagnose the cascade before adding more selector weight |
| A nested theme ignores a palette override | Alias was resolved in an ancestor scope | Resolve/redeclare at the right boundary or use the appropriate inline mapping |
| A disabled-looking control still works | Styling or ARIA was mistaken for behavioral disabling | Choose native disabling or implement the full advertised unavailable contract |
| Keyboard focus disappears in a selected item | Selected and focused states share one visual treatment | Design their combinations and test focus movement independently |
| Zoomed text is clipped | Fixed heights, restrictive overflow, or fluid-size assumptions | Permit growth, inspect intrinsic sizing, and test actual resizing/reflow |
| Forced colors erase controls | Shadow/background-only boundaries or inappropriate adjustment overrides | Use meaningful semantics, system-aware boundaries, and preference-compatible fallbacks |
| Component is accessible alone, broken in a page | Composition changed names, nesting, props, focus, or relationships | Test the rendered combination and real journey, not only the primitive story |
| Every update is announced | Overbroad alerts/live regions | Distinguish status from ordinary state changes and match urgency to importance |
| Snapshot suite passes but users fail | Baseline reflects appearance, not task success | Add behavioral, content, keyboard/AT, and task-based evidence |
| Library upgrades require fragile selector surgery | Consumers depend on generated hashes or private DOM | Use documented variants, parts, slots, tokens, or a meaningful local adapter |
| Style tool is blamed without evidence | Delivery, data, fonts, layout, or app work dominate | Profile the representative task and compare the actual output/cost |

## Specification vocabulary and illustrative examples

These schemas describe knowledge behind design and implementation choices. They can help explain relationships when relevant, but they are not a required output template or a task checklist.

```text
Experience:
  user goal; audience/context; frequency; consequence of error
  information needed; actions; feedback; recovery; evidence/uncertainty

Visual role:
  meaning; hierarchy; typography; color/surface; spacing/alignment
  states; themes; content growth; preference and platform behavior

Component:
  purpose; use/avoid; anatomy; semantic/behavior contract
  inputs/events; state owner; variants; composition; extension points
  layout responsibility; content constraints; public/private boundary

Token:
  semantic meaning; type/unit; value/reference; resolution scope
  modes; platform transforms; consumers; override/deprecation policy

Styling decision:
  problem; mechanism/layer; alternatives; version/platform assumptions
  output/runtime cost; cascade/scope; consumer contract; failure modes

Evidence:
  question; method; tasks/users; rendered state/environment
  observed outcome; limits; untested conditions; interpretation
```

### An ordinary form

Consider a settings form containing a contact address, notification preference, and save action. A coherent design can use visible labels, nearby instructions, a readable hierarchy, restrained grouping, and persistent outcome feedback rather than decorative cards around every field.

- **Component relationships:** a feature owns the draft and save outcome; fields own label/hint/error composition; controls implement entry/selection behavior; an action group owns arrangement rather than the save operation.
- **Visual decisions:** the page title, section title, field label, hint, error, and save action have distinct roles. Supporting text remains readable instead of becoming nearly invisible.
- **States:** a filled field, invalid field, read-only value, pending save, save failure, and saved outcome need coherent treatment. Error text should explain correction, and progress should not pretend completion.
- **Associations:** labels and instructions must remain associated with their controls, and placeholders do not replace them ([WAI: labels](https://www.w3.org/WAI/tutorials/forms/labels/), [WAI: instructions](https://www.w3.org/WAI/tutorials/forms/instructions/)). When a field becomes invalid, the visible error and programmatic relationship need to agree.
- **Alternatives:** a short form may use native controls and local CSS; several product forms may justify shared field/control components. Neither case implies a form framework, global store, or a separately published UI library.

### A consequential confirmation

Consider removing a workspace with effects the user may not expect. A bounded dialog can explain the object and consequences, make cancellation understandable, and preserve the actual modal focus/dismissal contract rather than relying only on a red button and backdrop ([WAI APG: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).

- **UI and UX together:** legible hierarchy, specific wording, and a clearly differentiated destructive action can improve clarity without making the dialog visually incoherent. The least destructive initial focus can be appropriate for an irreversible final step ([WAI APG: modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)).
- **Alternative:** a long review of affected items can deserve its own page rather than an increasingly complex modal. A reversible low-risk action can instead use a simpler interaction with useful undo.
- **Pitfall:** adding the same confirmation to every harmless action trains repeated dismissal without resolving the most consequential ambiguity. The case for friction depends on consequence, reversibility, and observed mistakes.

### A dense comparison workspace

Consider an inventory workspace with quantities, costs, status, and row actions. A stable table with aligned units, restrained row grouping, useful sort/filter state, and appropriate density can be more useful than a collection of visually dramatic cards; Carbon illustrates coordinated table, toolbar, selection, and batch-action patterns ([Carbon: data table](https://carbondesignsystem.com/components/data-table/usage/)).

- **Visual decisions:** distinguish data from metadata and action affordances; keep selected, hovered, and focused rows/cells understandable in combination. Numeric alignment should support the actual comparison.
- **Behavioral choice:** an ordinary table with normal links/buttons can be sufficient. Spreadsheet-style navigation/editing is a different requirement that may justify a grid and its managed keyboard behavior ([WAI APG: grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)).
- **Responsive alternatives:** column priority, a justified horizontal comparison region, expanded row detail, or a different narrow-screen workflow are options. Automatic conversion to cards is not inherently superior.
- **Pitfall:** virtualization can improve a measured rendering bottleneck while introducing interaction obligations. It should not be added just because “enterprise tables use it.”

### A responsive settings layout

The earlier container-query example allows a settings form and explanatory panel to change arrangement according to available component space. Its useful property is the relationship between content and container, not the illustrative `42rem` number.

- **Preserved meaning:** source order, labels, instructions, and primary action remain coherent before and after the layout change. CSS reordering should not replace meaningful document order ([MDN: ordering flex items](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)).
- **Adaptation:** explanatory content can move below the form, remain alongside it, or become a clearly labelled disclosure if its role and frequency justify that choice. Space constraints alone do not justify deleting required instructions.
- **Pitfall:** a layout that works at two screenshot widths can still fail between them, with translated strings, or at zoom. A component-sized layout needs evidence in its actual containers.

### A reusable themed control

Consider a button shared by two products with different brand colors and a dark theme. A common native action contract, finite emphasis/intent variants, semantic tokens, and deliberate theme scopes can share useful knowledge without forcing both products to use every visual detail.

- **Responsibility:** the button owns appropriate native behavior and presentation; the feature owns the business operation. A layout parent owns placement and available space.
- **Styling alternatives:** CSS Modules, conventional CSS, Tailwind recipes, and generated static styles can all express the same semantic decisions. Tool selection follows the consumer build and maintenance context.
- **Token relationship:** palette values feed semantic roles, with component-specific tokens only where independent adjustment is useful. Alias resolution and portal scope remain part of the implementation.
- **Evidence:** examine default, focus, pressed, disabled, pending, long-label, theme, forced-color, and relevant composition cases. Storybook can represent those states, but browser/AT behavior and whole journeys need their own evidence ([Storybook: stories](https://storybook.js.org/docs/writing-stories), [WAI APG cautions](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)).
- **Scope restraint:** if the product needs only one ordinary button, a native element with coherent local styling can be enough. The example explains a reusable option rather than assigning a UI-library project.

Strong interfaces make relationships, actions, state, and consequences understandable while expressing a coherent visual identity. Durable UI systems preserve those meanings through content changes, input methods, accessibility preferences, platforms, and maintenance; no particular aesthetic, component taxonomy, or styling tool establishes that quality on its own.
