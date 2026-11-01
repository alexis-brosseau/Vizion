<script lang="ts">
  import { postToHost } from '../bridge';
  import type { VizionWebviewStore } from '../state.svelte';

  let { store }: { store: VizionWebviewStore } = $props();

  const errorIssues = $derived(store.issues.filter((i) => i.severity === 'error'));
</script>

<div
  class="vz-error-panel"
  role="alert"
  aria-labelledby="vz-error-heading"
>
  <div class="vz-error-card">
    <h2 id="vz-error-heading" class="vz-error-title">
      {#if store.isEmptyDocument}
        Empty {store.expectedKind.toUpperCase()} document
      {:else}
        Cannot open {store.expectedKind.toUpperCase()} document
      {/if}
    </h2>

    {#if store.isEmptyDocument && store.canExplicitlyInitialize}
      <p class="vz-error-desc">
        This document is currently empty. Because it was cleared or undone during an active session,
        Vizion will not overwrite or regenerate it automatically unless you choose to initialize it.
      </p>
      <div class="vz-error-actions">
        <button
          type="button"
          class="vz-btn vz-btn-primary"
          onclick={() => postToHost({ type: 'webview.initializeEmpty' })}
        >
          Initialize {store.expectedKind.toUpperCase()} Template
        </button>
        <button
          type="button"
          class="vz-btn"
          onclick={() => postToHost({ type: 'webview.openAsText' })}
        >
          Open as Text
        </button>
      </div>
    {:else}
      <p class="vz-error-desc">
        Your file content has been preserved untouched. Fix the validation issue(s) below in the text editor
        and this visual canvas will recover automatically.
      </p>

      <ul class="vz-issue-list" aria-label="Document validation errors">
        {#each errorIssues as issue}
          <li class="vz-issue-item">
            <code class="vz-issue-path">
              {issue.path}{issue.line ? ` (line ${issue.line}, col ${issue.column ?? 1})` : ''}
            </code>
            <div class="vz-issue-msg">{issue.message}</div>
          </li>
        {/each}
      </ul>

      <div class="vz-error-actions">
        <button
          type="button"
          class="vz-btn vz-btn-primary"
          onclick={() => postToHost({ type: 'webview.openAsText' })}
        >
          Open as Text
        </button>
        <button
          type="button"
          class="vz-btn"
          onclick={() => postToHost({ type: 'webview.showProblems' })}
        >
          Show Problems
        </button>
        <button
          type="button"
          class="vz-btn"
          onclick={() => postToHost({ type: 'webview.recheck' })}
        >
          Recheck
        </button>
      </div>
    {/if}

    {#if store.lastValidDocument}
      <div class="vz-stale-notice">
        <strong>Stale Read-Only Preview Available:</strong> The last valid state is retained in memory
        for reference only and will never overwrite your current text.
      </div>
    {/if}
  </div>
</div>

