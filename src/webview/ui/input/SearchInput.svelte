<script lang="ts">
  import IconButton from '../button/IconButton.svelte';

  let {
    value = '',
    placeholder = 'Search…',
    ariaLabel = 'Search',
    oninput
  }: {
    value?: string;
    placeholder?: string;
    ariaLabel?: string;
    oninput?: (value: string) => void;
  } = $props();
</script>

<div class="vz-ui-search">
  <span class="search-icon" aria-hidden="true">⌕</span>
  <input
    class="search-input"
    type="search"
    {value}
    {placeholder}
    aria-label={ariaLabel}
    oninput={(event) => oninput?.(event.currentTarget.value)}
  />
  {#if value}
    <IconButton title="Clear search" onclick={() => oninput?.('')}>×</IconButton>
  {/if}
</div>

<style>
  .vz-ui-search {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 26px;
    padding: 2px 3px 2px 7px;
    border: 1px solid var(--vscode-input-border, var(--vz-widget-border));
    border-radius: var(--vz-radius-md);
    background: var(--vscode-input-background);
  }

  .vz-ui-search:focus-within {
    border-color: var(--vz-accent);
    outline: 1px solid var(--vz-accent);
    outline-offset: -1px;
  }

  .search-icon {
    color: var(--vz-muted-fg);
    font-size: 14px;
    line-height: 1;
  }

  .search-input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--vscode-input-foreground);
    font-size: var(--vz-font-size-sm);
    outline: none;
  }

  .search-input::-webkit-search-cancel-button {
    display: none;
  }
</style>
