<script lang="ts">
  // @ts-nocheck
  import type { PageData } from "./$types";
  import Button from "../../components/Button.svelte";
  import Modal from "../../components/Modal.svelte";
  import ImageModal from "../../components/ImageModal.svelte"; 
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

  onMount(() => {
        // Code that relies on `window`
        console.log(window.location.href);
    });
  export let data: PageData;

  let { room, roomExists } = data;
  let revealed = false;
  let copyLabel = "Copy Information";
  let secretText: string;
  let images = [];
  let showModal = false;
  let selectedImage = ""; 
  let imageModalVisible = false; 


  async function revealSecret() {
    try {
      const secret = await getRoomSecret(room);
      const encryptionKey = location.hash.substring(1);
      let decryptedSecret = await decryptData(secret, encryptionKey);
      const parsedSecret = JSON.parse(decryptedSecret);
      secretText = parsedSecret.text;
      images = parsedSecret.images;
      revealed = true;
    } catch (error) {
      goto("/error");
    }
  }

  function newSecret() {
    goto("/");
    images = [];
    secretText = ""; 
    copyLabel = "Copy link!";
  }

  function copyToClipboard() {
    copyLabel = "Copied!";
    navigator.clipboard.writeText(secretText);
  }

  function openImageModal(image) {
    selectedImage = image;
    imageModalVisible = true;
  }
</script>

<div class="page-container relative z-2">
  {#if revealed}
    <div align="center">
      <p class="text-[18px] font-inter m-[25px]">
        Secret is revealed and is now permanently deleted from the system.
      </p>
      <div
        class="w-full max-w-[880px] h-[240px] border border-[#f8fbfd] rounded-[20px] shadow-md bg-white p-[60px]"
      >
        <p
          class="font-inter text-[16px] font-semibold leading-[24px] text-[#729cc5] mb-[10px] text-start"
        >
          {secretText}
        </p>
      </div>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button class="lg sec md:h-[55px] h-[45px]" on:click={() => newSecret()}
          >Create New Secret</Button
        >
        <Button class="lg primary md:h-[55px] h-[45px]" on:click={() => copyToClipboard()}
          >{copyLabel}</Button
        >
      </div>
      <div class="flex flex-wrap justify-center items-center mt-[10px]">
        {#each images as image, index}
          <div class="relative m-[5px]">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img
              class="max-w-[200px] max-h-[100px] object-cover cursor-pointer"
              alt="Uploaded"
              src={image}
              on:click={() => openImageModal(image)} 
            />
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div align="center">
      <p class="text-[18px] font-inter m-[25px]">
        This secret can only be revealed once, and then it will be immediately
        destroyed.
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
        <Button on:click={() => revealSecret()} class="lg primary md:h-[55px] h-[45px]"
          >Reveal Secret</Button
        >
      </div>
    </div>
  {/if}

  <ImageModal bind:showModal={imageModalVisible} imageUrl={selectedImage} />
</div>
