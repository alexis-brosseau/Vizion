<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from '../button/IconButton.svelte';

  let {
    severity = 'info',
    message,
    dismissible = true,
    ondismiss,
    children
  }: {
    severity?: 'info' | 'warning' | 'error';
    message?: string;
    dismissible?: boolean;
    ondismiss?: () => void;
    children?: Snippet;
  } = $props();
</script>

<div class="vz-ui-banner {severity}" role={severity === 'error' ? 'alert' : 'status'} aria-live="polite">
  <span class="message">
    {#if children}
      {@render children()}
    {:else}
      {message}
    {/if}
  </span>
  {#if dismissible}
    <IconButton title="Dismiss notification" onclick={() => ondismiss?.()}>×</IconButton>
  {/if}
</div>

<style>
  .vz-ui-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vz-space-2);
    padding: 4px var(--vz-space-3);
    border-bottom: 1px solid var(--vz-widget-border);
    background: var(--vscode-notifications-background, var(--vz-widget-bg));
    color: var(--vz-fg);
    font-size: var(--vz-font-size-sm);
  }

  .vz-ui-banner.warning {
    background: var(--vscode-inputValidation-warningBackground, var(--vz-widget-bg));
    color: var(--vscode-inputValidation-warningForeground, var(--vz-fg));
    border-bottom-color: var(--vscode-inputValidation-warningBorder, var(--vz-warning));
  }

  .vz-ui-banner.error {
    background: var(--vscode-inputValidation-errorBackground, var(--vz-widget-bg));
    color: var(--vscode-inputValidation-errorForeground, var(--vz-fg));
    border-bottom-color: var(--vscode-inputValidation-errorBorder, var(--vz-danger));
  }

  .message {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
