<script lang="ts">
  // @ts-nocheck
  import Button from "../../components/Button.svelte";
  import {
    encryptData,
    generatePassphrase,
    convertFileToBase64,
  } from "$lib/crypto";
  import { createSecret, deleteSecret } from "$lib/api";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { goto } from "$app/navigation";

  let revealed = false;
  let secret = 'secret revealed';

  async function revealSecret() {
    try {
      revealed = true;
    } catch (error) {
      console.error("Error:", error);
      // goto("/error");
    }
  }

  function newSecret() {
    goto("/");
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(secret);
  }
</script>

<div class="page-container relative z-2">
  <!-- svelte-ignore empty-block -->
  {#if revealed}
    <div align="center">
      <div
        class="w-full max-w-[880px] h-[240px] border border-[#f8fbfd] rounded-[20px] shadow-md bg-white p-[60px]"
      >
        <p
          class="font-inter text-[20px] font-semibold leading-[24px] text-[#045cfc] mb-[10px]"
        >
          {secret}
        </p>
      </div>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button class="lg sec" on:click={() => newSecret()}
          >Create New Secret</Button
        >
        <Button class="lg primary" on:click={() => copyToClipboard()}>Copy Information</Button>
      </div>
    </div>
  {:else}
    <div align="center">
      <p>
        This secret can only be revealed once, and then it will be immediately
        destroyed.
      </p>
      <p>How it works?</p>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button on:click={() => revealSecret()} class="lg primary"
          >Reveal Secret</Button
        >
      </div>
    </div>
  {/if}
</div>
