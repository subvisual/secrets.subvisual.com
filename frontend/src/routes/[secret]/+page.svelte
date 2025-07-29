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
    isImageFile,
    decryptData,
    formatFileSize,
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
  let files = [];
  let showModal = false;
  let selectedFile = "";
  let imageModalVisible = false;

  async function revealSecret() {
    try {
      const secret = await getRoomSecret(room);
      const encryptionKey = location.hash.substring(1);
      let decryptedSecret = await decryptData(secret, encryptionKey);
      const parsedSecret = JSON.parse(decryptedSecret);
      secretText = parsedSecret.text;
      // Handle backward compatibility
      files = parsedSecret.files || parsedSecret.images || [];
      revealed = true;
    } catch (error) {
      goto("/error");
    }
  }

  function newSecret() {
    goto("/");
    files = [];
    secretText = "";
    copyLabel = "Copy link!";
  }

  function copyToClipboard() {
    copyLabel = "Copied!";
    navigator.clipboard.writeText(secretText);
  }

  function openImageModal(image) {
    selectedFile = image;
    imageModalVisible = true;
  }

  function downloadFile(file) {
    const link = document.createElement("a");
    if (typeof file === "string") {
      link.href = file; // Old format: file is a string
    } else if (
      file &&
      typeof file === "object" &&
      file.hasOwnProperty("data")
    ) {
      link.href = file.data; // New format: file is an object with a data property
    } else {
      console.error("Invalid file format:", file);
      return; // Exit the function if the file format is invalid
    }
    link.download = file.name || "downloaded-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<div class="page-container relative z-2">
  {#if revealed}
    <div align="center">
      <p class="text-[18px] font-inter m-[25px]">
        Secret is revealed and is now permanently deleted from the system.
      </p>
      <div
        class="w-full max-w-[880px] h-[240px] border border-[#f8fbfd] rounded-[20px] shadow-custom bg-white p-[60px]"
      >
        <p
          class="font-inter text-[16px] font-semibold leading-[24px] text-[#729cc5] mb-[10px] text-start whitespace-pre"
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
        <Button
          class="lg primary md:h-[55px] h-[45px]"
          on:click={() => copyToClipboard()}>{copyLabel}</Button
        >
      </div>
      <div class="flex flex-wrap justify-center items-center mt-[10px]">
        {#each files as file, index}
          <div
            class="relative m-[5px] p-[10px] bg-white rounded border border-gray-200 flex items-center shadow-sm"
          >
            {#if isImageFile(file)}
              <!-- Handle old format (string) or new image format -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <img
                class="w-[50px] h-[50px] object-cover cursor-pointer rounded mr-[10px]"
                alt="Uploaded"
                src={file.data || file}
                on:click={() => openImageModal(file.data || file)}
              />
              <div class="flex flex-col">
                <span class="text-[14px] font-medium text-gray-800"
                  >{file.name || "Image"}</span
                >
                {#if file.size}
                  <span class="text-[12px] text-gray-500"
                    >{formatFileSize(file.size)}</span
                  >
                {/if}
              </div>
            {:else}
              <!-- Handle non-image files -->
              <div
                class="w-[50px] h-[50px] bg-gray-100 rounded mr-[10px] flex items-center justify-center cursor-pointer"
                on:click={() => downloadFile(file)}
                on:keydown={(e) => e.key === "Enter" && downloadFile(file)}
                role="button"
                tabindex="0"
              >
                <span class="text-[20px]">📄</span>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[14px] font-medium text-gray-800 truncate max-w-[250px]"
                  title={file.name}>{file.name}</span
                >
                <span class="text-[12px] text-gray-500"
                  >{formatFileSize(file.size)}</span
                >
                <button
                  class="text-[12px] text-blue-600 hover:text-blue-800 mt-1"
                  on:click={() => downloadFile(file)}
                >
                  Download
                </button>
              </div>
            {/if}
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
        <Button
          on:click={() => revealSecret()}
          class="lg primary md:h-[55px] h-[45px]">Reveal Secret</Button
        >
      </div>
    </div>
  {/if}

  <ImageModal bind:showModal={imageModalVisible} imageUrl={selectedFile} />
</div>
