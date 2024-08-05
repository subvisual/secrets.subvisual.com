<script>
  // @ts-nocheck

  let buttonProps = {
    class: [$$restProps.class],
  };

</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button on:click on:mouseover on:mouseenter on:mouseleave {...buttonProps}>
  <slot />
</button>

<style>
  .primary {
    background-color: #0263f4;
    border-radius: 50px;
    color: white;
    border: 0;
  }
  .sm {
    width: 180px;
  }
  .lg {
    width: 322px;
    height: 60px;
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    margin: 10px;
    padding: 0;
  }
  .dropbtn {
    background-color: #FFFFFF;
    color: #0263F4;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border: 1px solid #0263F4

  }
</style>
