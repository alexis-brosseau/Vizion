<script lang="ts">
  let {
    value = '',
    placeholder,
    ariaLabel,
    disabled = false,
    readonly = false,
    type = 'text',
    oninput,
    onchange,
    oncommit
  }: {
    value?: string;
    placeholder?: string;
    ariaLabel?: string;
    disabled?: boolean;
    readonly?: boolean;
    type?: 'text' | 'search' | 'number';
    oninput?: (value: string) => void;
    onchange?: (value: string) => void;
    oncommit?: (value: string) => void;
  } = $props();
</script>

<input
  class="vz-ui-input"
  {type}
  {value}
  {placeholder}
  {disabled}
  {readonly}
  aria-label={ariaLabel ?? placeholder}
  oninput={(event) => oninput?.(event.currentTarget.value)}
  onchange={(event) => {
    onchange?.(event.currentTarget.value);
    oncommit?.(event.currentTarget.value);
  }}
  onkeydown={(event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
    }
  }}
/>

<style>
  .vz-ui-input {
    width: 100%;
    min-height: 24px;
    padding: 3px 7px;
    border: 1px solid var(--vscode-input-border, var(--vz-widget-border));
    border-radius: var(--vz-radius-md);
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-size: var(--vz-font-size-sm);
    outline: none;
  }

  .vz-ui-input::placeholder {
    color: var(--vscode-input-placeholderForeground, var(--vz-muted-fg));
  }

  .vz-ui-input:focus {
    border-color: var(--vz-accent);
    outline: 1px solid var(--vz-accent);
    outline-offset: -1px;
  }
</style>
