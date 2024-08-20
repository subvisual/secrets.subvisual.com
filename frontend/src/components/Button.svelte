<script lang="ts">
  // @ts-nocheck

  export let disabled = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  {...$$restProps}
  class={`inline-block rounded-full text-sm font-medium ${
    disabled ? 'cursor-not-allowed border-gray-400 bg-[#0263F43D] text-white' : 'border-0'
  } ${$$restProps.class}`}
>
  <slot />
</button>

<style lang="postcss">
  :global(button.primary) {
    @apply bg-[#0263f4] text-white;
  }
  :global(button.sec) {
    @apply text-[#0263f4] border border-[#0263f4];
  }
  :global(button.sm) {
    @apply w-[180px];
  }
  :global(button.lg) {
    @apply cursor-pointer font-inter text-center m-[10px] text-[16px] font-medium leading-[20px];
  }
  :global(button.dropbtn) {
    @apply bg-white text-[#0263f4] text-[16px] border border-[#0263f4] cursor-pointer;
  }
  :global(button.disabled) {
    @apply cursor-not-allowed border border-gray-400 opacity-60 bg-[#0263F43D] text-white;
  }

  :global(button) {
    @apply w-[250px] text-[16px];

  }
</style>
