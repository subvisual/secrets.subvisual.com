<script>
  // @ts-nocheck
  import Button from "../components/Button.svelte";

  const duration = [
		{ value: 6, label: `6 hours` },
		{ value: 1, label: `1 hour` },
		{ value: 0.5, label: `30 min` },
    { value: 0.25, label: `15 min` }
	];
  let selected = '';
  $: console.log('Changed selected:', selected)
</script>

<p align="center">
  Share information securely and ephemerally. <br />The generated link will only
  work once, then it will disappear forever.
</p>
<p align="center">How it works?</p>
<div align="center">
  <div>
    <textarea placeholder="Write your information here..." />
  </div>
  <div class="actions">
    <select class="picklist" bind:value={selected} >
      <option value="" disabled selected>SECRET'S LIFETIME </option>
      {#each duration as value}<option value={value.value}>{value.label}</option>{/each}
    </select>
    <Button class="lg sec">Import Image</Button>
    <Button class="lg primary">CREATE SECRET LINK</Button>
  </div>
</div>

<style>
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

</style>
