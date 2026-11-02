<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    ariaLabel,
    disabled = false,
    active = false,
    danger = false,
    onclick,
    children
  }: {
    title: string;
    ariaLabel?: string;
    disabled?: boolean;
    active?: boolean;
    danger?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  } = $props();
</script>

<button
  type="button"
  class="vz-ui-icon-button"
  class:active
  class:danger
  title={title}
  aria-label={ariaLabel ?? title}
  aria-pressed={active}
  {disabled}
  onclick={(event) => onclick?.(event)}
>
  {@render children?.()}
</button>

<style>
  .vz-ui-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--vz-radius-sm);
    background: transparent;
    color: var(--vz-fg);
    line-height: 1;
  }

  .vz-ui-icon-button:hover:not(:disabled) {
    background: var(--vscode-toolbar-hoverBackground, rgba(128, 128, 128, 0.16));
    border-color: var(--vz-widget-border);
  }

  .vz-ui-icon-button.active {
    background: var(--vscode-inputOption-activeBackground, rgba(128, 128, 128, 0.24));
    border-color: var(--vscode-inputOption-activeBorder, var(--vz-accent));
  }

  .vz-ui-icon-button.danger {
    color: var(--vz-danger);
  }
</style>
