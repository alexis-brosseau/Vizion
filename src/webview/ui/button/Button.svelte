<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'secondary',
    size = 'md',
    disabled = false,
    title,
    type = 'button',
    onclick,
    children
  }: {
    variant?: 'secondary' | 'primary' | 'danger';
    size?: 'sm' | 'md';
    disabled?: boolean;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  } = $props();
</script>

<button
  {type}
  {disabled}
  {title}
  class="vz-ui-button {variant} {size}"
  onclick={(event) => onclick?.(event)}
>
  {@render children?.()}
</button>

<style>
  .vz-ui-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 26px;
    padding: 3px 10px;
    border: 1px solid var(--vz-widget-border);
    border-radius: var(--vz-radius-sm);
    background: var(--vscode-button-secondaryBackground, transparent);
    color: var(--vscode-button-secondaryForeground, var(--vz-fg));
    font-size: var(--vz-font-size-sm);
    line-height: 1.4;
    white-space: nowrap;
    transition: background var(--vz-transition-fast), border-color var(--vz-transition-fast);
  }

  .vz-ui-button:hover:not(:disabled) {
    background: var(--vscode-button-secondaryHoverBackground, rgba(128, 128, 128, 0.16));
  }

  .vz-ui-button.primary {
    border-color: transparent;
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  .vz-ui-button.primary:hover:not(:disabled) {
    background: var(--vscode-button-hoverBackground);
  }

  .vz-ui-button.danger {
    border-color: var(--vz-danger);
    color: var(--vz-danger);
  }

  .vz-ui-button.sm {
    min-height: 22px;
    padding: 2px 7px;
    font-size: var(--vz-font-size-xs);
  }
</style>
