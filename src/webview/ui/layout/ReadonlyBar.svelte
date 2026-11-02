<script lang="ts">
  let { message = 'Read-Only Mode (Non-file URI or untrusted document)' }: { message?: string } =
    $props();
</script>

<div class="vz-ui-readonly" role="note">
  <span aria-hidden="true">🔒</span>
  <span>{message}</span>
</div>

<style>
  .vz-ui-readonly {
    display: flex;
    align-items: center;
    gap: var(--vz-space-2);
    padding: 3px var(--vz-space-3);
    border-bottom: 1px solid var(--vz-widget-border);
    background: var(--vscode-editorWidget-background);
    color: var(--vz-muted-fg);
    font-size: var(--vz-font-size-sm);
  }
</style>
