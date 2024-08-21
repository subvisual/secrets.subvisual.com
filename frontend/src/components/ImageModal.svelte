<script lang="ts">
  export let showModal: boolean;
  export let imageUrl: string;
  import { onMount, onDestroy } from 'svelte';

  function closeModal() {
    showModal = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto"
    on:click={closeModal}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-auto"
      on:click|stopPropagation
    >
      <img src={imageUrl} alt="Full Size" class="object-contain max-w-full max-h-full" />
    </div>
  </div>
{/if}
