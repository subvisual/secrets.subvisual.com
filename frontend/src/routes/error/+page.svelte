<script lang="ts">
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import Button from "../../components/Button.svelte";

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
    <p>How it works?</p>
    <div
      class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
    >
      <Button on:click={() => createNewSecret()} class="lg sec"
        >Create New Secret</Button
      >
    </div>
  </div>
</div>
