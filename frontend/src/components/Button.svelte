<script lang="ts">
  // @ts-nocheck

  export let disabled = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
  on:click
  on:mouseover
  on:mouseenter
  on:mouseleave
  {...$$restProps}  class:disabled={false || disabled}
>
  <slot />
</button>


<style>
  .primary {
    background-color: #0263f4;
    border-radius: 50px;
    color: white;
    border: 0;
    padding: 16px;
    display: inline-block;
  }
  .sec {
    background-color: #ffffff;
    border-radius: 50px;
    color: #0263f4;
    border: 1px solid #0263f4;
    padding: 16px;
    display: inline-block;
  }
  .sm {
    width: 180px;
  }
  .lg {
    cursor: pointer;
    display: inline-block;
    flex: 1 1 200px;
    max-width: 250px;
    height: 55px;
    font-family: "Inter", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    margin: 10px;
    padding: 16px;
  }
  .dropbtn {
    background-color: #ffffff;
    color: #0263f4;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border: 1px solid #0263f4;
  }

  .disabled {
    cursor: not-allowed;
    border: 1px solid #bdbdbd;
    opacity: 0.6;
    background-color: #0263F43D;
    color: white;


  }
</style>
