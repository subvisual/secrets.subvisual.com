<script lang="ts">
  // @ts-nocheck
  import type { PageData } from "./$types";
  import Button from "../../components/Button.svelte";
  import {
    encryptData,
    generatePassphrase,
    convertFileToBase64,
    decryptData,
  } from "$lib/crypto";
  import { getRoomSecret } from "$lib/api";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let { room, roomExists } = data;
  let revealed = false;
  let copyLabel = "Copy Information";
  let secretText: string;
  let images = [];

  async function revealSecret() {
    const secret = await getRoomSecret(room);
    const encryptionKey = location.hash.substring(1);
    try {
      let decryptedSecret = await decryptData(secret, encryptionKey);
      const parsedSecret = JSON.parse(decryptedSecret);

      secretText = parsedSecret.text;
      console.log("Images:", parsedSecret.images);
      images = parsedSecret.images;
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
    copyLabel = "Copied!";
    navigator.clipboard.writeText(secretText);
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
          {secretText}
        </p>
      </div>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button class="lg sec" on:click={() => newSecret()}
          >Create New Secret</Button
        >
        <Button class="lg primary" on:click={() => copyToClipboard()}
          >{copyLabel}</Button
        >
      </div>
      <div class="flex flex-wrap justify-center items-center mt-[10px]">
        {#each images as image, index}
          <div class="relative m-[5px]">
            <img
              class="max-w-[100px] max-h-[100px] object-cover"
              alt="Uploaded"
              src={image}
            />
          </div>
        {/each}
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
