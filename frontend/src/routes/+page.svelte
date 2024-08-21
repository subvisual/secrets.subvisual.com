<script lang="ts">
  import Button from "../components/Button.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    encryptData,
    generatePassphrase,
    convertFileToBase64,
    compressImage,
  } from "$lib/crypto";
  import { createSecret } from "$lib/api";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { goto } from "$app/navigation";

  let showModal = false;

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  const duration = [
    { value: 21600, label: `6 hours` },
    { value: 3600, label: `1 hour` },
    { value: 1800, label: `30 min` },
    { value: 900, label: `15 min` },
  ];
  let submitting: boolean = false;
  let secretText: string;
  let fileinput: HTMLInputElement;
  let images: any[] = [];
  let imageBase64Strings: string[] = [];

  let encryptedText: string;
  let encryptionKey: string;
  let sharingUrl: string;
  let roomId: string;
  let copyLabel = "Copy link";
  let expiry = 900;

  let isOpen = false;
  let selectedOption = "";

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectOption(option: { value: any; label: any }) {
    selectedOption = option.label;
    expiry = option.value;
    isOpen = false;
  }

  function closeDropdown(event: { stopPropagation: () => void }) {
    isOpen = false;
    event.stopPropagation();
  }

  function handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input?.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        images = [...images, file];
      }
    }
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
  }

  async function compressAndConvertImages() {
    for (let file of images) {
      const compressedFile = await compressImage(file, { quality: 0.7 });
      const base64String = await convertFileToBase64(compressedFile);
      imageBase64Strings.push(base64String);
    }
  }

  async function handleClick() {
    try {
      submitting = true;
      await progress.set(0);

      if (images.length > 0) {
        await compressAndConvertImages();
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
      console.error(error);
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
    expiry = 900;
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
    <div class="flex flex-col items-center justify-center ">
      <p class="text-[20px] font-inter m-[25px] text-center">
        Share information securely and ephemerally. <br />The generated link
        will only work once, then it will disappear forever.
      </p>
      <button
        on:click={() => (showModal = true)}
        class="text-[18px] font-inter mb-[25px] underline text-[#0263F4]"
      >
        How it works?
      </button>
      <Modal bind:showModal></Modal>
    </div>
    <div class="flex flex-col items-center w-full content-center">
      <textarea
        class="w-full max-w-[380px] md:max-w-[980px] md:h-[290px] h-[240px] border border-[#f8fbfd] rounded-t-[20px] rounded-b-none shadow-md text-[16px] text-[#729cc5] leading-[30px] text-left p-[30px] resize-none box-border"
        bind:value={secretText}
        placeholder="Write your information here..."
      />

      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[380px] md:max-w-[980px] rounded-b-[20px] shadow-md p-[15px] bg-white box-border"
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="relative inline-block text-left w-full max-w-[250px] m-[10px]"
          on:click={toggleDropdown}
        >
          <div
            class="flex max-w-[250px] flex-col items-start justify-between md:h-[55px] h-[45px] p-[16px] bg-white text-[#0263f4] border border-[#0263f4] rounded-full cursor-pointer"
          >
            <!-- Selected Option -->
            {#if selectedOption}
              <span
                class="text-[14px] font-medium font-inter text-[#729CC5] justify-center"
              >
                Secret's Lifetime:
                <span class="text-[16px] font-medium font-inter text-[#0263f4]">
                  {selectedOption}
                </span>
              </span>
            {:else}
              <div class="text-[16px] font-medium font-inter text-left">
                Secret's Lifetime
              </div>
            {/if}
            <svg
              class="w-5 h-5 text-[#0263f4] absolute right-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          {#if isOpen}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-[5px]"
            >
              {#each duration as option}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  class="cursor-pointer text-[16px] font-medium text-[#0263f4] hover:bg-[#0263f4] hover:text-white rounded-lg px-[10px]"
                  on:click={(event) => {
                    event.stopPropagation();
                    selectOption(option);
                  }}
                >
                  {option.label}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#if isOpen}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="fixed inset-0 z-0" on:click={closeDropdown}></div>
        {/if}

        <input
          type="file"
          multiple
          accept="image/*"
          on:change={handleFileInput}
          style="display:none"
          bind:this={fileinput}
        />
        <Button
          class="lg sec md:h-[55px] h-[45px]"
          on:click={() => {
            fileinput.click();
          }}>Import Image</Button
        >

        <Button
          on:click={handleClick}
          class={`lg primary md:h-[55px] h-[45px] ${!secretText || !expiry ? "lg primary disabled" : "lg primary"} `}
          >Create a secret link</Button
        >
      </div>
      <div class="flex flex-wrap justify-center items-center mt-[10px]">
        {#each images as image, index}
          <div class="relative m-[5px]">
            <img
              class="w-[200px] h-[100px] object-cover cursor-pointer rounded"
              src={URL.createObjectURL(image)}
              alt="Uploaded"
            />
            <button
              class="absolute top-[5px] right-[5px] bg-white text-black border-none cursor-pointer text-[14px] rounded-full w-[20px] h-[20px] flex items-center justify-center"
              on:click={() => removeImage(index)}
            >
              x
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else if !submitting && sharingUrl}
  <div class="page-container relative z-2">
    <div class="flex flex-col items-center justify-center">
      <p class="text-[20px] font-inter m-[25px]">
        Your secret is ready. Keep in mind the link can only be revealed once,
        then it is utterly destroyed.
      </p>
      <div
        class="inline-block break-words w-full max-w-[380px] md:max-w-[980px] md:h-[190px] h-[160px] rounded-[12px] bg-white flex justify-center items-center text-center"
      >
        <a
          href={sharingUrl}
          class="inline-block break-words max-w-[380px] md:max-w-[980px] font-inter text-[20px] font-normal leading-[32px] text-center mx-auto underline text-[#0263F4]"
          >{sharingUrl}</a
        >
      </div>
      <div
        class="flex flex-wrap justify-center items-center w-full max-w-[880px] p-[30px]"
      >
        <Button class="lg sec md:h-[55px] h-[45px]" on:click={() => newSecret()}
          >Reset</Button
        >
        <Button
          class="lg primary md:h-[55px] h-[45px]"
          on:click={() => copyToClipboard()}>{copyLabel}</Button
        >
      </div>
    </div>
  </div>
{:else}
  <div class="page-container relative z-2">
    <div class="flex flex-col items-center justify-center">
      <p>
        Share information securely and ephemerally. <br />The generated link
        will only work once, then it will disappear forever.
      </p>
      <button
        on:click={() => (showModal = true)}
        class="text-[18px] font-inter mb-[25px] underline text-[#0263F4]"
      >
        How it works?
      </button>

      <Modal bind:showModal></Modal>
      <div
        class="w-full max-w-[380px] md:max-w-[980px] md:h-[190px] h-[160px] border border-[#f8fbfd] rounded-[20px] shadow-md bg-white p-[60px]"
      >
        <p
          class="font-inter text-[20px] font-semibold leading-[24px] text-[#045cfc] mb-[10px]"
        >
          Encrypting your secret...
        </p>
        <div class="content-start">
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
