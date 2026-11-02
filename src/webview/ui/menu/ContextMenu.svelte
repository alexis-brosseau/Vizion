<script lang="ts">
  import type { ContextMenuItem, VizionWebviewStore } from '../../state.svelte';

  let { store }: { store: VizionWebviewStore } = $props();

  let activePath = $state<string>('');

  function isPathOpen(pathKey: string): boolean {
    return activePath === pathKey || activePath.startsWith(`${pathKey}.`);
  }

  function keepMenuInView(node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    let adjustedX = rect.left;
    let adjustedY = rect.top;

    if (rect.right > window.innerWidth - 8) {
      adjustedX = Math.max(8, window.innerWidth - rect.width - 8);
    }
    if (rect.left < 8) {
      adjustedX = 8;
    }
    if (rect.bottom > window.innerHeight - 8) {
      adjustedY = Math.max(8, window.innerHeight - rect.height - 8);
    }
    if (rect.top < 8) {
      adjustedY = 8;
    }

    node.style.left = `${adjustedX}px`;
    node.style.top = `${adjustedY}px`;
  }

  function keepSubmenuInView(node: HTMLElement) {
    const rect = node.getBoundingClientRect();

    // Horizontal: If submenu extends beyond right edge, flip to open on left
    if (rect.right > window.innerWidth - 8) {
      node.style.left = 'auto';
      node.style.right = '100%';
      node.style.marginLeft = '0px';
      node.style.marginRight = '2px';
    }

    // Check if it overflows left
    const updatedRect = node.getBoundingClientRect();
    if (updatedRect.left < 8) {
      node.style.left = '8px';
      node.style.right = 'auto';
      node.style.margin = '0px';
    }

    // Vertical: If submenu extends below window bottom, shift up
    if (updatedRect.bottom > window.innerHeight - 8) {
      const overflowY = updatedRect.bottom - (window.innerHeight - 8);
      node.style.top = `${-4 - overflowY}px`;
    }

    const finalRect = node.getBoundingClientRect();
    if (finalRect.top < 8) {
      const curTop = parseInt(node.style.top || '-4', 10);
      node.style.top = `${curTop + (8 - finalRect.top)}px`;
    }
  }
</script>

{#snippet menuList(items: ContextMenuItem[], parentPath: string)}
  {#each items as item, idx}
    {@const itemPath = parentPath ? `${parentPath}.${idx}` : `${idx}`}
    {#if item.dividerBefore}
      <div class="vz-context-divider"></div>
    {/if}

    {#if item.submenu && item.submenu.length > 0}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="vz-context-submenu-wrap"
        onpointerenter={() => (activePath = itemPath)}
      >
        <button
          type="button"
          class="vz-context-item"
          role="menuitem"
          aria-haspopup="true"
          aria-expanded={isPathOpen(itemPath)}
          onclick={(e) => {
            e.stopPropagation();
            activePath = isPathOpen(itemPath) ? parentPath : itemPath;
          }}
        >
          <span>{item.label}</span>
          <span class="vz-submenu-arrow">▸</span>
        </button>

        {#if isPathOpen(itemPath)}
          <div
            class="vz-context-submenu"
            use:keepSubmenuInView
            role="menu"
            tabindex="-1"
          >
            {@render menuList(item.submenu, itemPath)}
          </div>
        {/if}
      </div>
    {:else}
      <button
        type="button"
        class="vz-context-item"
        class:danger={item.danger}
        role="menuitem"
        onpointerenter={() => (activePath = parentPath)}
        onclick={(e) => {
          e.stopPropagation();
          const fn = item.action;
          activePath = '';
          store.closeContextMenu();
          fn?.();
        }}
      >
        <span>{item.label}</span>
        {#if item.shortcut}
          <kbd class="vz-kbd">{item.shortcut}</kbd>
        {/if}
      </button>
    {/if}
  {/each}
{/snippet}

{#if store.contextMenu}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="vz-context-backdrop"
    onpointerdown={() => {
      activePath = '';
      store.closeContextMenu();
    }}
    oncontextmenu={(e) => {
      e.preventDefault();
      activePath = '';
      store.closeContextMenu();
    }}
  >
    <div
      class="vz-context-menu"
      use:keepMenuInView
      style="left: {store.contextMenu.x}px; top: {store.contextMenu.y}px;"
      role="menu"
      tabindex="-1"
      onpointerdown={(e) => e.stopPropagation()}
    >
      {#if store.contextMenu.title}
        <div class="vz-context-menu-title">{store.contextMenu.title}</div>
      {/if}
      {@render menuList(store.contextMenu.items, '')}
    </div>
  </div>
{/if}
