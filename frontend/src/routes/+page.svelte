<script lang="ts">
  // @ts-nocheck
  import Button from "../components/Button.svelte";
  import Modal from "../components/Modal.svelte";
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

  let showModal = false;

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  const duration = [
    { value: 800, label: `Secret's Lifetime` },
    { value: 21600, label: `6 hours` },
    { value: 3600, label: `1 hour` },
    { value: 1800, label: `30 min` },
    { value: 900, label: `15 min` },
  ];
  let expiry = 800;
  let submitting = false;
  let secretText: string;
  let fileinput;
  let images = [];
  let imageBase64Strings = [];

  let encryptedText: string;
  let encryptionKey: string;
  let sharingUrl: string;
  let roomId: string;
  let copyLabel = "Copy link";

  function handleFileInput(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      images = [...images, file];
    }
  }

  function removeImage(index) {
    images = images.filter((_, i) => i !== index);
  }

  async function handleClick() {
    try {
      submitting = true;
      await progress.set(0);

      if (images.length > 0) {
        const promises = images.map((file) => convertFileToBase64(file));
        imageBase64Strings = await Promise.all(promises);
        await progress.set(0.4);
      }

      const combinedData = {
        text: secretText,
        images: imageBase64Strings,
      };
      const combinedString = JSON.stringify(combinedData);

      await progress.set(0.5);
      encryptionKey = generatePassphrase();
      encryptedText = await encryptData(combinedString, encryptionKey);
      await progress.set(0.7);

      roomId = await createSecret({
        secret: encryptedText,
        expiry: Number(expiry),
      });
      await progress.set(0.9);
      sharingUrl = `${location.protocol}//${location.host}/${roomId}#${encryptionKey}`;

      await progress.set(1);
      submitting = false;
    } catch (error) {
      goto("/error");
      submitting = false;
    }
  }

  function newSecret() {
    goto("/");
    submitting = false;
    sharingUrl = "";
    images = [];
    imageBase64Strings = [];
    secretText = "";
    copyLabel = "Copy link!";
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(sharingUrl);
    copyLabel = "Copied!";
  }
</script>

<!-- svelte-ignore empty-block -->
{#if !submitting && !sharingUrl}
  <div class="page-container relative z-2">
    <div align="center">
      <p align="center" class="text-[20px] font-inter m-[25px]">
        Share information securely and ephemerally. <br />The generated link
        will only work once, then it will disappear forever.
      </p>

      <button
        on:click={() => (showModal = true)}
        align="center"
        class="text-[18px] font-inter mb-[25px] underline text-[#0263F4]"
      >
        How it works?
      </button>

      <Modal bind:showModal></Modal>
    </div>
    <div align="center" class="flex flex-col items-center w-full">
      <textarea
        class="w-full max-w-[980px] h-[240px] border border-[#f8fbfd] rounded-t-[20px] rounded-b-none shadow-md text-[16px] text-[#729cc5] leading-[30px] text-left p-[30px] resize-none box-border"
        bind:value={secretText}
        placeholder="Write your information here..."
      />

      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[980px] rounded-b-[20px] shadow-md p-[15px] bg-white box-border"
      >
        <select
          class="flex-1 min-w-[200px] max-w-[250px] h-[55px] m-[10px] font-inter text-[16px] font-medium leading-[20px] text-center border border-[#0263f4] bg-white text-[#0263f4] p-[16px] rounded-full cursor-pointer"
          bind:value={expiry}
        >
          {#each duration as { value, label }}
            <option {value}>{label}</option>
          {/each}
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          on:change={handleFileInput}
          style="display:none"
          bind:this={fileinput}
        />
        <Button
          class="lg sec"
          on:click={() => {
            fileinput.click();
          }}>Import Image</Button
        >

        <Button
          on:click={handleClick}
          class={`lg primary ${!secretText ? "lg primary disabled" : "lg primary"} `}
          >Create a secret link</Button
        >
      </div>
      <div class="flex flex-wrap justify-center items-center mt-[10px]">
        {#each images as image, index}
          <div class="relative m-[5px] mt-[15px]">
            <img
              class="max-w-[200px] max-h-[100px] object-cover cursor-pointer"
              src={URL.createObjectURL(image)}
              alt="Uploaded"
            />
            <button
              class="absolute top-0 right-0 bg-white text-black border-none cursor-pointer py-[2px] px-[5px] text-[12px]"
              on:click={() => removeImage(index)}>x</button
            >
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if !submitting && sharingUrl}
  <div class="page-container relative z-2">
    <div align="center">
      <p class="text-[20px] font-inter m-[25px]">
        Your secret is ready. Keep in mind the link can only be revealed once,
        then it is utterly destroyed.
      </p>
      <div
        class="inline-block break-words w-full max-w-[880px] h-[112px] rounded-[12px] bg-white flex justify-center items-center text-center"
      >
        <a
          href={sharingUrl}
          class="inline-block break-words w-[880px] max-w-[880px] font-inter text-[20px] font-normal leading-[32px] text-center mx-auto underline text-[#0263F4]"
          >{sharingUrl}</a
        >
      </div>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button class="lg sec" on:click={() => newSecret()}>Reset</Button>
        <Button class="lg primary" on:click={() => copyToClipboard()}
          >{copyLabel}</Button
        >
      </div>
    </div>
  </div>
{:else}
  <div class="page-container relative z-2">
    <div align="center">
      <p>
        Share information securely and ephemerally. <br />The generated link
        will only work once, then it will disappear forever.
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
        class="w-full max-w-[880px] h-[240px] border border-[#f8fbfd] rounded-[20px] shadow-md bg-white p-[60px]"
      >
        <p
          class="font-inter text-[20px] font-semibold leading-[24px] text-[#045cfc] mb-[10px]"
        >
          Encrypting your secret...
        </p>
        <div align="left">
          <progress
            class="w-full max-w-[880px] h-[16px] rounded-full"
            value={$progress}
            max="1"
          ></progress>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  p {
    @apply text-base font-inter leading-7 text-center;
  }

  progress {
    appearance: none;
  }

  progress::-webkit-progress-bar {
    background: #f3f3f3;
    border-radius: 24px;
  }

  progress::-webkit-progress-value {
    background: linear-gradient(90deg, #2c8dff 0%, #0263f4 100%);
    border-radius: 24px;
  }

  progress::-moz-progress-bar {
    background: linear-gradient(90deg, #2c8dff 0%, #0263f4 100%);
    border-radius: 24px;
  }
</style>
