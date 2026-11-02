<script lang="ts">
  interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  let {
    value,
    options,
    placeholder = 'Select…',
    ariaLabel,
    disabled = false,
    onchange
  }: {
    value?: string;
    options: SelectOption[];
    placeholder?: string;
    ariaLabel?: string;
    disabled?: boolean;
    onchange?: (value: string) => void;
  } = $props();

  let open = $state(false);
  let activeIndex = $state(-1);
  let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
  let menuEl = $state<HTMLDivElement | undefined>(undefined);
  let menuStyle = $state('');

  const selectedIndex = $derived(options.findIndex((option) => option.value === value));
  const selectedOption = $derived(selectedIndex >= 0 ? options[selectedIndex] : undefined);

  function updateMenuPosition(): void {
    if (!open || !triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const width = Math.max(rect.width, 140);
    const height = menuEl?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = height > 0 && spaceBelow < height + 8 && rect.top > spaceBelow;
    const top = openAbove ? rect.top - height - 3 : rect.bottom + 3;
    const left = Math.min(rect.left, window.innerWidth - width - 8);
    menuStyle = `left: ${Math.max(8, left)}px; top: ${Math.max(8, top)}px; width: ${width}px;`;
  }

  $effect(() => {
    if (!open) return;
    updateMenuPosition();
    const frame = requestAnimationFrame(updateMenuPosition);
    const handleViewportChange = () => updateMenuPosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  });

  function firstEnabledIndex(): number {
    const index = options.findIndex((option) => !option.disabled);
    return index >= 0 ? index : 0;
  }

  function openMenu(): void {
    if (disabled || options.length === 0) return;
    open = true;
    activeIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex();
  }

  function closeMenu(): void {
    open = false;
  }

  function moveActive(delta: number): void {
    if (options.length === 0) return;
    let next = activeIndex;
    for (let step = 0; step < options.length; step += 1) {
      next = (next + delta + options.length) % options.length;
      if (!options[next].disabled) {
        activeIndex = next;
        return;
      }
    }
  }

  function selectOption(option: SelectOption | undefined): void {
    if (!option || option.disabled) return;
    closeMenu();
    if (option.value !== value) onchange?.(option.value);
    requestAnimationFrame(() => triggerEl?.focus());
  }

  function handleTriggerKeydown(event: KeyboardEvent): void {
    if (disabled) return;

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        event.preventDefault();
        activeIndex = firstEnabledIndex();
        break;
      case 'End':
        event.preventDefault();
        activeIndex = options.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(options[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu();
        break;
    }
  }
</script>

<div class="vz-ui-select" data-vz-select>
  <button
    bind:this={triggerEl}
    type="button"
    class="vz-ui-select-trigger"
    class:open
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label={ariaLabel ?? placeholder}
    {disabled}
    onclick={() => (open ? closeMenu() : openMenu())}
    onkeydown={handleTriggerKeydown}
  >
    <span class:placeholder={!selectedOption}>{selectedOption?.label ?? placeholder}</span>
    <span class="vz-ui-select-chevron" aria-hidden="true">▾</span>
  </button>

  {#if open}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="vz-ui-select-backdrop"
      onpointerdown={(event) => {
        event.preventDefault();
        closeMenu();
        triggerEl?.focus();
      }}
    ></div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={menuEl}
      class="vz-ui-select-menu"
      style={menuStyle}
      role="listbox"
      aria-label={ariaLabel ?? placeholder}
    >
      {#each options as option, index (option.value)}
        <button
          type="button"
          class="vz-ui-select-option"
          class:highlighted={index === activeIndex}
          class:active={option.value === value}
          role="option"
          aria-selected={option.value === value}
          disabled={option.disabled}
          onpointerenter={() => (activeIndex = index)}
          onclick={() => selectOption(option)}
        >
          <span>{option.label}</span>
          {#if option.value === value}
            <span class="vz-ui-select-check" aria-hidden="true">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .vz-ui-select {
    position: relative;
    width: 100%;
  }

  .vz-ui-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-height: 26px;
    padding: 4px 6px;
    border: 1px solid var(--vscode-input-border, var(--vz-widget-border));
    border-radius: var(--vz-radius-md);
    background: var(--vscode-input-background);
    color: var(--vscode-input-foreground);
    font-family: inherit;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
  }

  .vz-ui-select-trigger:hover:not(:disabled),
  .vz-ui-select-trigger.open {
    border-color: var(--vz-accent);
  }

  .vz-ui-select-trigger:focus-visible {
    border-color: var(--vz-accent);
    outline: 1px solid var(--vz-accent);
    outline-offset: -1px;
  }

  .vz-ui-select-trigger:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .vz-ui-select-trigger .placeholder {
    color: var(--vscode-input-placeholderForeground, var(--vz-muted-fg));
  }

  .vz-ui-select-chevron {
    flex-shrink: 0;
    color: var(--vscode-descriptionForeground);
    font-size: 10px;
    line-height: 1;
    transition: transform var(--vz-transition-fast);
  }

  .vz-ui-select-trigger.open .vz-ui-select-chevron {
    transform: rotate(180deg);
  }

  .vz-ui-select-backdrop {
    position: fixed;
    inset: 0;
    z-index: 120;
  }

  .vz-ui-select-menu {
    position: fixed;
    z-index: 121;
    display: flex;
    flex-direction: column;
    gap: 1px;
    max-height: 220px;
    overflow-y: auto;
    padding: 3px;
    border: 1px solid var(--vscode-menu-border, var(--vscode-focusBorder, rgba(128, 128, 128, 0.45)));
    border-radius: var(--vz-radius-md);
    background-color: var(--vscode-editor-background);
    background-color: color-mix(in srgb, var(--vscode-editor-background) 82%, #000000 18%);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.5);
  }

  .vz-ui-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 5px 8px;
    border: none;
    border-radius: var(--vz-radius-sm);
    background: transparent;
    color: var(--vscode-menu-foreground, var(--vscode-editor-foreground));
    font-family: inherit;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
  }

  .vz-ui-select-option:hover,
  .vz-ui-select-option.highlighted {
    background-color: var(
      --vscode-menu-selectionBackground,
      var(--vscode-list-activeSelectionBackground, rgba(0, 122, 204, 0.28))
    );
    color: var(
      --vscode-menu-selectionForeground,
      var(--vscode-list-activeSelectionForeground, inherit)
    );
  }

  .vz-ui-select-option.active {
    font-weight: 600;
  }

  .vz-ui-select-option:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .vz-ui-select-check {
    color: var(--vz-accent);
    font-size: 11px;
  }

  .vz-ui-select-option:hover .vz-ui-select-check,
  .vz-ui-select-option.highlighted .vz-ui-select-check {
    color: currentColor;
  }
</style>
