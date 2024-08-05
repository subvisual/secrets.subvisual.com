<script>
  // @ts-nocheck

  import Button from "../components/Button.svelte";

  let menuOpen = false;
  let inputValue = "";
  $: console.log(inputValue);

  const menuItems = ["6 hours", "1 hour", "30 min", "15 min"];
  let filteredItems = [];

</script>

<p align="center">
  Share information securely and ephemerally. <br />The generated link will only
  work once, then it will disappear forever.
</p>
<p align="center">
  How it works?
</p>
<div align="center">
  <section class="dropdown">
    <div>
      <textarea placeholder="Write your information here..." />
    </div>
    <div class="actions">

      <Button
        class="lg primary dropbtn"
        on:click={() => (menuOpen = !menuOpen)}
        {menuOpen}>Button 2</Button
      >
      <div id="myDropdown" class:show={menuOpen} class="dropdown-content">
        {#if menuOpen}
          {#each menuItems as item}
            <div>{item}</div>
          {/each}
        {/if}
      </div>
      <Button class="lg primary">Button 3</Button>
    </div>
  </section>
</div>

<style>
  p {
    font-family: Inter;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    text-align: center;
  }
  textarea {
    width: 880px;
    height: 240px;
    border: 1px solid #f8fbfd;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    font-family: Inter;
    font-size: 16px;
    color: #729cc5;
    line-height: 24px;
    text-align: left;
    padding: 30px;
    resize: none;
  }
  .actions {
    width: 880px;
    height: 65px;
    border: 1px solid #f8fbfd;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    padding: 30px;
    background-color: white;
  }
  .dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f6f6f6;
    min-width: 230px;
    border: 1px solid #ddd;
    z-index: 1;
  }
  .dropdown-content.show {
    display: block;
  }
</style>
