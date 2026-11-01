<script lang="ts">
  import type { UmlVisibility } from '../../shared/documents/types';
  import { formatVisibilitySign } from '../../shared/operations';

  let {
    value = '+',
    disabled = false,
    ariaLabel = 'Visibility',
    compact = false,
    onSelect
  }: {
    value?: UmlVisibility;
    disabled?: boolean;
    ariaLabel?: string;
    compact?: boolean;
    onSelect: (next: UmlVisibility) => void;
  } = $props();

  let open = $state<boolean>(false);

  const options: { symbol: UmlVisibility; display: string; label: string }[] = [
    { symbol: '+', display: '＋', label: 'Public' },
    { symbol: '-', display: '-', label: 'Private' },
    { symbol: '#', display: '#', label: 'Protected' },
    { symbol: '~', display: '~', label: 'Package' }
  ];
</script>

<div class="vz-vis-picker-wrap">
  <button
    type="button"
    class="vz-vis-picker-btn"
    class:compact
    aria-label={ariaLabel}
    aria-expanded={open}
    {disabled}
    onclick={(e) => {
      e.stopPropagation();
      if (!disabled) open = !open;
    }}
  >
    <span class="vz-vis-symbol">{formatVisibilitySign(value)}</span>
  </button>

  {#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="vz-vis-backdrop"
      onclick={(e) => {
        e.stopPropagation();
        open = false;
      }}
    ></div>

    <div class="vz-vis-popup" role="menu">
      {#each options as opt (opt.symbol)}
        <button
          type="button"
          class="vz-vis-popup-item"
          class:active={opt.symbol === value}
          role="menuitem"
          onclick={(e) => {
            e.stopPropagation();
            open = false;
            onSelect(opt.symbol);
          }}
        >
          <span class="vz-vis-popup-sym">{opt.display}</span>
          <span>{opt.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
