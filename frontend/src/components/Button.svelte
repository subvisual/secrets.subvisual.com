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
    cursor: pointer;
    padding: 16px;
    display: inline-block;
  }
  .sec {
    background-color: #FFFFFF;
    border-radius: 50px;
    color: #0263f4;
    border: 0;
    border: 1px solid #0263F4;
    cursor: pointer;
    padding: 16px;
    display: inline-block;
  }
  .sm {
    width: 180px;
  }
  .lg {
    display: inline-block;
    flex: 1 1 200px;
    max-width: 250px;
    height: 55px;
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    margin: 10px;
    padding: 16px;


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
