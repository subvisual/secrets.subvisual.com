<script lang="ts">
  // @ts-nocheck
  import Button from "../components/Button.svelte";
  import {
    encryptData,
    generatePassphrase,
    convertFileToBase64,
  } from "$lib/crypto";
  import { createSecret, deleteSecret } from "$lib/api";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  const progress = tweened(0, {
    duration: 400,
    easing: cubicOut,
  });

  const duration = [
    { value: 900, label: `Secret's Lifetime` },
    { value: 21600, label: `6 hours` },
    { value: 3600, label: `1 hour` },
    { value: 1800, label: `30 min` },
    { value: 900, label: `15 min` },
  ];
  let expiry = 900;
  let submitting = false;
  let secretText = "";
  let fileinput;
  let images = [];
  let imageBase64Strings = []; // To store the base64 strings

  let encryptedText: string;
  let encryptionKey: string;
  let sharingUrl: string;
  let roomId: string;

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
        console.log("Base64 Encoded Files:", imageBase64Strings);
      }

      const combinedData = {
        text: secretText,
        images: imageBase64Strings,
      };
      const combinedString = JSON.stringify(combinedData);
      console.log("Combined Data:", combinedString);

      await progress.set(0.5);
      encryptionKey = generatePassphrase();
      encryptedText = await encryptData(combinedData, encryptionKey);
      await progress.set(0.7);
      console.log("encryptedText -> ", encryptedText);

      roomId = await createSecret({
        secret: encryptedText,
        expiry: Number(expiry),
      });
      await progress.set(0.9);

      sharingUrl = `${location.protocol}//${location.host}/${roomId}#${encryptionKey}`;
      console.log("sharing url ", sharingUrl);

      await progress.set(1);
      submitting = false;
    } catch (error) {
      console.error("Error:", error);
      // Handle or display the error appropriately
      // goto("/error");
      submitting = false;
    }
  }
</script>

{#if !submitting}
  <div class="page-container">
    <p align="center">
      Share information securely and ephemerally. <br />The generated link will
      only work once, then it will disappear forever.
    </p>
    <p align="center">How it works?</p>
    <div align="center">
      <div>
        <textarea
          bind:value={secretText}
          placeholder="Write your information here..."
        />
      </div>
      <div class="actions">
        <select class="picklist" bind:value={expiry}>
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

        <Button on:click={handleClick} disabled={!secretText} class="lg primary"
          >Create a secret link</Button
        >
      </div>
      <div class="images">
        {#each images as image, index}
          <div class="image-wrapper">
            <img src={URL.createObjectURL(image)} alt="Uploaded" />
            <button class="remove-btn" on:click={() => removeImage(index)}
              >x</button
            >
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="page-container">
    <div align="center">
      <p>
        Share information securely and ephemerally. <br />The generated link
        will only work once, then it will disappear forever.
      </p>
      <p>How it works?</p>
      <div class="loading">
        <p class="encryptingText">Encrypting your secret...</p>
        <progress value={$progress} max="1" />
      </div>
    </div>
  </div>
{/if}

<style>
  .page-container * {
    position: relative;
    z-index: 2;
  }
  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    text-align: center;
  }
  textarea {
    width: 100%;
    max-width: 880px;
    height: 240px;
    border: 1px solid #f8fbfd;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    font-size: 16px;
    color: #729cc5;
    line-height: 24px;
    text-align: left;
    padding: 30px;
    resize: none;
  }

  .loading {
    width: 100%;
    max-width: 880px;
    height: 240px;
    border: 1px solid #f8fbfd;
    border-radius: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    background-color: white;
    padding: 60px;
    resize: none;
  }
  progress {
    display: block;
    width: 100%;
    max-width: 880px;
    height: 16px;
    border-radius: 24px;
  }
  progress::-webkit-progress-bar {
    background: #f3f3f3; 
    border-radius: 24px;
  }

  progress::-webkit-progress-value {
    background: linear-gradient(
      90deg,
      #2c8dff 0%,
      #0263f4 100%
    ); 
    border-radius: 24px;
  }
  progress::-moz-progress-bar {
    background: linear-gradient(90deg, #2C8DFF 0%, #0263F4 100%);
    border-radius: 24px;
}

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 880px;
    border: 1px solid #f8fbfd;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    padding: 30px;
    background-color: white;
  }
  .picklist {
    flex: 1 1 200px;
    max-width: 250px;
    height: 55px;
    margin: 10px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    border: 1px solid #0263f4;
    background-color: #ffffff;
    color: #0263f4;
    padding: 16px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 50px;
  }
  .images {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .image-wrapper {
    position: relative;
    margin: 5px;
  }

  .image-wrapper img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: white;
    color: black;
    border: none;
    cursor: pointer;
    padding: 2px 5px;
    font-size: 12px;
  }
  .encryptingText {
    font-family: "Inter", sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    color: #045cfc;
  }
</style>
