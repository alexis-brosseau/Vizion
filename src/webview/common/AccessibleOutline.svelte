<script lang="ts">
  import {
    getUmlNodeKind,
    getUmlRelationPreset,
    UML_SHAPE_GEOMETRIES
  } from '../../shared/registry/uml-registry';
  import type { VizionWebviewStore } from '../state.svelte';

  let {
    store,
    onDeleteSelected,
    onDuplicateSelected
  }: {
    store: VizionWebviewStore;
    onDeleteSelected: () => void;
    onDuplicateSelected: () => void;
  } = $props();

  let outlineSectionEl = $state<HTMLElement | undefined>(undefined);
  let showAddMenu = $state<boolean>(false);
  let addDropdownWrapEl = $state<HTMLElement | undefined>(undefined);
  let resizingVertical = $state<{
    startY: number;
    initialRatio: number;
    sidebarHeight: number;
  } | null>(null);

  function handleWindowPointerDown(e: PointerEvent): void {
    if (!showAddMenu) return;
    if (addDropdownWrapEl && !addDropdownWrapEl.contains(e.target as Node)) {
      showAddMenu = false;
    }
  }

  function handleWindowKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && showAddMenu) {
      showAddMenu = false;
    }
  }

  const umlCreationOptions: {
    kind: 'class' | 'note';
    label: string;
    shortcut: string;
  }[] = [
    { kind: 'class', label: 'Class', shortcut: 'Alt+C' },
    { kind: 'note', label: 'Note', shortcut: 'Alt+N' }
  ];

  const allItems = $derived.by(() => {
    if (store.umlDoc) {
      const nodeMap = new Map(store.umlDoc.nodes.map((n) => [n.id, n]));
      const nodeItems = store.umlDoc.nodes.map((n) => {
        const desc = getUmlNodeKind(n.kind);
        const stereotype = n.stereotype || desc?.defaultStereotype || '';
        const iconKey = n.kind === 'shape' && n.shape ? n.shape : n.kind;
        const label = n.name || n.id;
        return {
          id: n.id,
          isEdge: false,
          label,
          stereotype,
          iconKey,
          iconTitle: n.kind === 'shape' ? `Shape: ${n.shape}` : `Node: ${n.kind}`,
          tooltip: stereotype ? `${label} «${stereotype}»` : label,
          contextLabel: label
        };
      });

      const edgeItems = store.umlDoc.edges.map((e) => {
        const sourceNode = nodeMap.get(e.source.nodeId);
        const targetNode = nodeMap.get(e.target.nodeId);
        const sourceName = sourceNode?.name || e.source.nodeId;
        const targetName = targetNode?.name || e.target.nodeId;
        const edgeLabel = e.label?.trim() || '';

        const preset = getUmlRelationPreset(e.kind);
        const line = (e.visual?.line ?? preset?.line ?? 'solid') as 'solid' | 'dashed';
        const isDashed = line === 'dashed';
        const startShape = e.visual?.start?.shape ?? preset?.start?.shape ?? 'none';
        const startFill = e.visual?.start?.fill ?? preset?.start?.fill ?? 'hollow';
        const endShape = e.visual?.end?.shape ?? preset?.end?.shape ?? 'none';
        const endFill = e.visual?.end?.fill ?? preset?.end?.fill ?? 'hollow';

        const repr = edgeLabel ? `${sourceName} ── ${edgeLabel} ── ${targetName}` : `${sourceName} ── ${targetName}`;
        return {
          id: e.id,
          isEdge: true,
          sourceName,
          targetName,
          edgeLabel,
          edgeKind: e.kind,
          isDashed,
          edgeVisual: {
            line,
            isDashed,
            startShape,
            startFill,
            endShape,
            endFill
          },
          label: repr,
          stereotype: '',
          iconKey: e.kind,
          iconTitle: `Relation: ${e.kind} (${line})`,
          tooltip: repr,
          contextLabel: repr
        };
      });
      return [...nodeItems, ...edgeItems];
    }
    return [];
  });

  const filteredItems = $derived.by(() => {
    const q = store.outlineSearchQuery.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => {
      if (item.isEdge) {
        return (
          item.sourceName.toLowerCase().includes(q) ||
          item.targetName.toLowerCase().includes(q) ||
          item.edgeLabel.toLowerCase().includes(q) ||
          item.edgeKind.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      }
      return (
        item.label.toLowerCase().includes(q) ||
        item.stereotype.toLowerCase().includes(q) ||
        `«${item.stereotype.toLowerCase()}»`.includes(q) ||
        item.iconKey.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  });

  function openItemContextMenu(e: MouseEvent, itemId: string, itemLabel: string): void {
    e.preventDefault();
    e.stopPropagation();
    store.selectSingle(itemId, false);
    store.openContextMenu(
      e.clientX,
      e.clientY,
      [
        {
          label: 'Copy',
          shortcut: 'Ctrl+C',
          action: () => store.copySelection()
        },
        {
          label: 'Duplicate',
          shortcut: 'Ctrl+D',
          action: () => onDuplicateSelected()
        },
        {
          label: 'Paste as new',
          shortcut: 'Ctrl+Shift+V',
          action: () => {
            store.copySelection();
            store.pasteClipboard(true);
          }
        },
        {
          label: 'Delete',
          shortcut: 'Del',
          danger: true,
          dividerBefore: true,
          action: () => onDeleteSelected()
        }
      ],
      itemLabel
    );
  }

  function handleSplitterPointerDown(e: PointerEvent): void {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
    const parentSidebar = outlineSectionEl?.parentElement;
    const sidebarHeight = Math.max(200, parentSidebar?.clientHeight ?? 600);
    resizingVertical = {
      startY: e.clientY,
      initialRatio: store.elementsPaneRatio,
      sidebarHeight
    };
  }

  function handleWindowPointerMove(e: PointerEvent): void {
    if (!resizingVertical) return;
    const dy = e.clientY - resizingVertical.startY;
    const deltaRatio = dy / resizingVertical.sidebarHeight;
    store.setElementsPaneRatio(resizingVertical.initialRatio + deltaRatio);
  }

  function handleWindowPointerUp(): void {
    if (resizingVertical) {
      resizingVertical = null;
    }
  }
</script>

<svelte:window
  onpointerdown={handleWindowPointerDown}
  onpointermove={handleWindowPointerMove}
  onpointerup={handleWindowPointerUp}
  onkeydown={handleWindowKeyDown}
/>

{#snippet itemIcon(item: any)}
  <svg
    class="vz-outline-icon-svg"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    {#if item.isEdge && item.edgeVisual}
      {@const v = item.edgeVisual}
      {@const hasLeftShape = v.startShape === 'diamond' || v.startShape === 'circle' || v.startShape === 'square' || v.startShape === 'triangle'}
      {@const hasRightShape = v.endShape === 'diamond' || v.endShape === 'circle' || v.endShape === 'square' || v.endShape === 'triangle'}
      {@const startX = hasLeftShape ? 6 : 1.5}
      {@const endX = hasRightShape ? 10 : 14.5}

      <!-- Center connecting line (solid or dashed) -->
      <line
        x1={startX}
        y1="8"
        x2={endX}
        y2="8"
        stroke-width="1.3"
        stroke-dasharray={v.line === 'dashed' ? '2 1.5' : undefined}
      />

      <!-- Start marker (left side) -->
      {#if v.startShape === 'diamond'}
        <polygon points="1,8 3.5,5.5 6,8 3.5,10.5" stroke-width="1.2" fill={v.startFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.startShape === 'circle'}
        <circle cx="3.5" cy="8" r="2.5" stroke-width="1.2" fill={v.startFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.startShape === 'square'}
        <rect x="1" y="5.5" width="5" height="5" stroke-width="1.2" fill={v.startFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.startShape === 'triangle'}
        <polygon points="6,5 1,8 6,11" stroke-width="1.2" fill={v.startFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.startShape === 'open-arrow'}
        <path d="M5 5.5 L1.5 8 L5 10.5" stroke-width="1.3" />
      {/if}

      <!-- End marker (right side) -->
      {#if v.endShape === 'diamond'}
        <polygon points="10,8 12.5,5.5 15,8 12.5,10.5" stroke-width="1.2" fill={v.endFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.endShape === 'circle'}
        <circle cx="12.5" cy="8" r="2.5" stroke-width="1.2" fill={v.endFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.endShape === 'square'}
        <rect x="10" y="5.5" width="5" height="5" stroke-width="1.2" fill={v.endFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.endShape === 'triangle'}
        <polygon points="10,5 15,8 10,11" stroke-width="1.2" fill={v.endFill === 'filled' ? 'currentColor' : 'var(--vscode-editor-background, #1e1e1e)'} />
      {:else if v.endShape === 'open-arrow'}
        <path d="M11 5.5 L14.5 8 L11 10.5" stroke-width="1.3" />
      {/if}
    {:else if item.iconKey === 'class'}
      <!-- UML Class with 3 compartments -->
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke-width="1.3" />
      <line x1="2" y1="6" x2="14" y2="6" stroke-width="1.1" />
      <line x1="2" y1="10" x2="14" y2="10" stroke-width="1.1" />
    {:else if item.iconKey === 'note'}
      <!-- Folded corner note -->
      <path d="M3 2 h7 l3 3 v8 a1 1 0 0 1 -1 1 h-9 a1 1 0 0 1 -1 -1 v-10 a1 1 0 0 1 1 -1 z" stroke-width="1.3" />
      <path d="M10 2 v3 h3" stroke-width="1.1" />
      <line x1="5" y1="8" x2="11" y2="8" stroke-width="1" />
      <line x1="5" y1="11" x2="9" y2="11" stroke-width="1" />
    {:else if item.iconKey === 'rectangle'}
      <rect x="2" y="3.5" width="12" height="9" rx="1" stroke-width="1.3" />
    {:else if item.iconKey === 'ellipse'}
      <ellipse cx="8" cy="8" rx="6" ry="4.5" stroke-width="1.3" />
    {:else if item.iconKey === 'rhombus'}
      <polygon points="8,2 14,8 8,14 2,8" stroke-width="1.3" />
    {:else if item.iconKey === 'trapezoid'}
      <polygon points="4.5,4 11.5,4 13.5,12 2.5,12" stroke-width="1.3" />
    {:else if item.iconKey === 'parallelogram'}
      <polygon points="4.5,4 13.5,4 11.5,12 2.5,12" stroke-width="1.3" />
    {:else}
      <!-- Generic element outline -->
      <rect x="2" y="2" width="12" height="12" rx="2" stroke-width="1.3" />
    {/if}
  </svg>
{/snippet}

<section
  bind:this={outlineSectionEl}
  class="vz-outline-section"
  style="height: {store.elementsPaneRatio * 100}%;"
  aria-label="Elements List"
>
  <div class="vz-outline-header">
    <span class="vz-sidebar-title">Elements ({filteredItems.length})</span>

    {#if store.expectedKind === 'uml' && !store.isReadOnly}
      <div class="vz-add-dropdown-wrap" bind:this={addDropdownWrapEl}>
        <button
          type="button"
          class="vz-plus-btn"
          title="Add New UML Element"
          aria-label="Add New UML Element"
          aria-expanded={showAddMenu}
          onclick={() => {
            showAddMenu = !showAddMenu;
          }}
        >
          ＋
        </button>

        {#if showAddMenu}
          <div class="vz-add-dropdown" role="menu">
            {#each umlCreationOptions as opt (opt.kind)}
              <button
                type="button"
                class="vz-add-dropdown-item"
                role="menuitem"
                onclick={() => {
                  showAddMenu = false;
                  store.createQuickUmlNode(opt.kind);
                }}
              >
                <span>{opt.label}</span>
                <kbd class="vz-kbd">{opt.shortcut}</kbd>
              </button>
            {/each}

            <div class="vz-context-divider"></div>
            <div class="vz-dropdown-section-label">Shapes</div>
            {#each UML_SHAPE_GEOMETRIES as sh (sh.kind)}
              <button
                type="button"
                class="vz-add-dropdown-item"
                role="menuitem"
                onclick={() => {
                  showAddMenu = false;
                  store.createQuickUmlNode('shape', undefined, undefined, sh.kind);
                }}
              >
                <span>{sh.label}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="vz-outline-search-row">
    <input
      type="search"
      class="vz-input"
      placeholder="Search elements or «stereotypes»…"
      aria-label="Search elements"
      bind:value={store.outlineSearchQuery}
    />
  </div>

  {#if filteredItems.length === 0}
    <div class="vz-empty-hint">
      {#if store.outlineSearchQuery.trim()}
        No matching elements for "{store.outlineSearchQuery}".
      {:else}
        No elements yet. Click <strong>＋</strong> or right-click the canvas to add one.
      {/if}
    </div>
  {:else}
    <ul class="vz-outline-list" role="listbox" aria-label="Diagram elements">
      {#each filteredItems as item (item.id)}
        {@const isSelected = store.selectedIds.includes(item.id)}
        <li role="option" aria-selected={isSelected}>
          <button
            type="button"
            class="vz-outline-item"
            class:selected={isSelected}
            title={item.tooltip}
            onclick={(e) => store.selectSingle(item.id, e.shiftKey || e.metaKey || e.ctrlKey)}
            oncontextmenu={(e) => openItemContextMenu(e, item.id, item.contextLabel)}
          >
            <span class="vz-outline-icon" title={item.iconTitle} aria-hidden="true">
              {@render itemIcon(item)}
            </span>
            {#if item.isEdge}
              <div class="vz-outline-edge-row">
                <span class="vz-outline-endpoint" title={item.sourceName}>{item.sourceName}</span>
                <span class="vz-outline-connector" aria-hidden="true">
                  {#if item.edgeLabel}
                    <span class="vz-outline-connector-line" class:dashed={item.isDashed}></span>
                    <span class="vz-outline-edge-label" title={item.edgeLabel}>{item.edgeLabel}</span>
                    <span class="vz-outline-connector-line" class:dashed={item.isDashed}></span>
                  {:else}
                    <span class="vz-outline-connector-line" class:dashed={item.isDashed}></span>
                  {/if}
                </span>
                <span class="vz-outline-endpoint" title={item.targetName}>{item.targetName}</span>
              </div>
            {:else}
              <span class="vz-outline-label">{item.label}</span>
              {#if item.stereotype}
                <span class="vz-outline-stereotype">«{item.stereotype}»</span>
              {/if}
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<!-- Horizontal Resizer Splitter between Elements section and Property Inspector -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="vz-section-splitter"
  role="separator"
  aria-orientation="horizontal"
  aria-label="Resize Elements and Inspector sections"
  tabindex="0"
  onpointerdown={handleSplitterPointerDown}
></div>
