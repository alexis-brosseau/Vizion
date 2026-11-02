<script lang="ts">
  let {
    value = '',
    placeholder,
    ariaLabel,
    rows = 4,
    disabled = false,
    readonly = false,
    autogrow = false,
    oninput,
    onchange,
    oncommit
  }: {
    value?: string;
    placeholder?: string;
    ariaLabel?: string;
    rows?: number;
    disabled?: boolean;
    readonly?: boolean;
    autogrow?: boolean;
    oninput?: (value: string) => void;
    onchange?: (value: string) => void;
    oncommit?: (value: string) => void;
  } = $props();

  let element = $state<HTMLTextAreaElement | undefined>(undefined);

  function resize(): void {
    if (!autogrow || !element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }

  $effect(() => {
    void value;
    resize();
  });
</script>

<textarea
  bind:this={element}
  class="vz-ui-textarea"
  {rows}
  {placeholder}
  {disabled}
  {readonly}
  aria-label={ariaLabel ?? placeholder}
  {value}
  oninput={(event) => {
    oninput?.(event.currentTarget.value);
    resize();
  }}
  onchange={(event) => {
    onchange?.(event.currentTarget.value);
    oncommit?.(event.currentTarget.value);
  }}
  onkeydown={(event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      (event.currentTarget as HTMLTextAreaElement).blur();
    }
  }}
></textarea>

<style>
  .vz-ui-textarea {
    width: 100%;
    min-height: 60px;
    padding: 5px 7px;
    border: 1px solid var(--vscode-input-border, var(--vz-widget-border));
    border-radius: var(--vz-radius-md);
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: var(--vz-mono-font-family);
    font-size: var(--vz-font-size-sm);
    line-height: 1.45;
    resize: vertical;
    outline: none;
  }

  .vz-ui-textarea::placeholder {
    color: var(--vscode-input-placeholderForeground, var(--vz-muted-fg));
  }

  .vz-ui-textarea:focus {
    border-color: var(--vz-accent);
    outline: 1px solid var(--vz-accent);
    outline-offset: -1px;
  }
</style>
