<script>
  import IconLayout from "../components/IconLayout.svelte";
  import IconLogo from "../components/IconLogo.svelte";
</script>

<div
  class="h-full w-full overflow-hidden bg-smoked-white font-body tracking-tight text-dark-grey antialiased outline-dark-grey"
>
  <div class="IconLayout">
    <IconLayout />
  </div>

  <div class="relative w-full h-full">
    <!-- Ensure this div has relative positioning -->
    <div
      class="mx-auto flex min-h-screen w-full flex-col justify-between gap-6 py-6 sm:w-5/6 md:gap-0 md:pt-8"
    >
      <main>
        <div class="logo-and-text">
          <div class="IconLogo">
            <IconLogo />
          </div>
        </div>
      </main>

      <footer
        class="mx-auto flex w-7/12 flex-col items-center justify-between gap-6 justify-self-end text-sm tracking-tight md:flex-row"
      >
        <div class="source">
          <p class="text-center">
            <a
              href="https://github.com/finiam/secrets.finiam.com"
              target="_blank"
              rel="noopener"
              >Open source project
            </a>
            powered by
            <a
              href="https://subvisual.com/"
              target="_blank"
              rel="noreferrer"
              >Subvisual
            </a>
          </p>
        </div>
        
      </footer>
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #f0f7fe;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .IconLayout {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .logo-and-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    top: 55px;
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .source {
    width: 524px;
    height: 28px;
    position: absolute;
    left: 121px;
    top: 969px;
    opacity: 0px;
  }
</style>
