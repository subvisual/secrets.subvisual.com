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
    <div
      class="mx-auto flex min-h-screen w-full flex-col justify-between gap-6 py-6 sm:w-5/6 md:gap-0 md:pt-8"
    >
      <main>
        <div class="logo-and-text">
          <div class="IconLogo">
            <IconLogo />
          </div>
        </div>
        <slot />
      </main>

      <footer
        class="mx-auto flex w-7/12 flex-col items-center justify-between gap-6 justify-self-end text-sm tracking-tight md:flex-row"
      >
        <div class="source">
          <div class="secrets">
            <div class="rectangle">
              <p class="number">88</p>
            </div>
            <p class="secretsText">Secrets Created</p>
          </div>
          <p class="footer-text">
            <a
              href="https://github.com/finiam/secrets.finiam.com"
              target="_blank"
              rel="noopener"><b>Open source</b></a
            >
            project powered by
            <a href="https://subvisual.com/" target="_blank" rel="noreferrer"
              >Subvisual</a
            >
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
    z-index: 0;
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
    height: 48px;
    position: absolute;
    left: 121px;
    top: 80vh;
    opacity: 1;
  }

  .secrets {
    display: flex;
    align-items: center;
    width: auto;
    height: 48px;
    font-family: Inter;
    font-size: 18px;
    text-align: center;
    margin-right: auto;
  }

  .rectangle {
    width: 88px;
    height: 48px;
    background-color: #cfe7ff;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .number {
    font-weight: 700;
    color: #045cfc;
  }

  .secretsText {
    font-weight: 400;
    color: #729cc5;
    margin-left: 10px;
  }

  .footer-text {
    left: 121px;
    margin-top: 20px;
    text-align: left;
  }
</style>
