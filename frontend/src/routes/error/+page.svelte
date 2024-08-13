<script lang="ts">
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import Button from "../../components/Button.svelte";
  import Modal from "../../components/Modal.svelte";

  let showModal = false;


  function createNewSecret() {
    goto("/");
  }
</script>

<div class="page-container relative z-2">
  <div align="center">
    <p>
      This secret was either already revealed or never existed in the first
      place.
    </p>
    <button
        on:click={() => (showModal = true)}
        align="center"
        class="text-[18px] font-inter mb-[25px] underline text-[#0263F4]"
      >
        How it works?
      </button>

      <Modal bind:showModal></Modal>
    <div
      class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
    >
      <Button on:click={() => createNewSecret()} class="lg sec"
        >Create New Secret</Button
      >
    </div>
  </div>
</div>
