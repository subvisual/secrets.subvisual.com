<script lang="ts">
  // @ts-nocheck
  import Button from "../components/Button.svelte";
  import { encryptData, generatePassphrase, convertFileToBase64} from '$lib/crypto';
  import { createSecret, deleteSecret } from '$lib/api';
  import { onMount } from "svelte";

  const duration = [
    { value: 21600, label: `6 hours` },
    { value: 3600, label: `1 hour` },
    { value: 1800, label: `30 min` },
    { value: 900, label: `15 min` },
  ];
  let expiry = "";
  let submitting = false;
  let secretText = "";
  let fileinput;
  let images = [];
  let encryptedText: string;
  let encryptionKey: string;
  let sharingUrl: string;

  // Handle file input change
  function handleFileInput(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        images = [...images, e.target.result];
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove an image
  function removeImage(index) {
    images = images.filter((_, i) => i !== index);
  }

  async function handleClick() {
    try {
      submitting = true;
      let encryptedFiles = '';
      if (images.length > 0) {
        images.forEach((image) => {
          encryptedFiles += convertFileToBase64(image);
        });
      }
      encryptionKey = generatePassphrase();
      encryptedText = await encryptData(secretText + encryptedFiles, encryptionKey);
      roomId = await createSecret({
        secret: encryptedText,
        expiry: Number(expiry),
      });
      sharingUrl = `${location.protocol}//${location.host}/${roomId}#${encryptionKey}`;
      console.log('sharing url ', sharingUrl);
      submitting = false;
    } catch (_) {
      console.log('error')
     // goto("/error");
    }
  }
</script>

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
        <option value="" disabled expiry>Secret's Lifetime</option>
        {#each duration as value}<option value={value.value}
            >{value.label}</option
          >{/each}
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

      {#if submitting}
        <Button loading={submitting} class="lg primary"
          >Encrypting data...</Button
        >
      {:else}
        <Button on:click={handleClick} disabled={!submitting} class="lg primary"
          >Create a secret link</Button
        >
      {/if}
    </div>
    <div class="images">
      {#each images as image, index}
        <div class="image-wrapper">
          <img src={image} alt="Uploaded" />
          <button class="remove-btn" on:click={() => removeImage(index)}
            >x</button
          >
        </div>
      {/each}
    </div>
  </div>
</div>

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
    font-family: Inter;
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
</style>
