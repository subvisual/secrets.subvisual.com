<script lang="ts">
  import "../app.css";
  import IconLayout from "../components/IconLayout.svelte";
  import IconLogo from "../components/IconLogo.svelte";
  import { getStats } from "../lib/api";
  import { onMount } from 'svelte';
  
  let secretsCounter: string = '';

  onMount(async () => {
    try {
      const stats = await getStats();
      secretsCounter = stats.secretsCounter;
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  });


</script>

<div
  class="h-full w-full overflow-hidden bg-[#f0f7fe] font-inter tracking-tight text-[#333333] antialiased outline-[#333333]"
>
  <div class="fixed right-0 bottom-0 z-0">
    <IconLayout />
  </div>

  <div class="relative w-full h-full">
    <div
      class="mx-auto min-w-3  min-h-screen w-full flex-col justify-between gap-6 py-6 sm:w-5/6 md:gap-0 md:pt-8"
    >
      <main>
        <div class="flex flex-col items-center justify-center p-5">
          <div class="flex flex-col items-center justify-center">
            <IconLogo />
          </div>
        </div>
        <slot />
      </main>

      <footer
        class="mx-auto flex w-7/12 flex-col items-center justify-between text-sm tracking-tight"
      >
        <div
          class="fixed left-[40px] sm:left-[70px] md:left-[70px] bottom-[50px] sm:bottom-[70px] md:bottom-[70px] lg:bottom-[70px] xl:bottom-[70px] opacity-100 w-[524px] h-[48px]"
        >
          <div
            class="flex items-center text-center text-[16px] font-inter mr-auto"
          >
            <div
              class="flex items-center justify-center bg-[#cfe7ff] rounded-[32px] w-[88px] h-[48px]"
            >
              <p class="font-bold font-inter text-[#045cfc]">{secretsCounter}</p>
            </div>
            <p class="text-[18px] font-normal font-inter text-[#729cc5] ml-[10px]">Secrets Created</p>
          </div>
          <p class="absolute mr-auto mt-[18px] text-left text-[18px]">
            <a 
              href="https://github.com/finiam/secrets.finiam.com"
              target="_blank"
              rel="noopener"><b class='underline'>Open source</b></a
            >
            project powered by
            <a href="https://subvisual.com/" target="_blank" rel="noreferrer" class="font-bold font-inter text-[#045cfc] underline"
              >Subvisual</a
            >
          </p>
        </div>
      </footer>
    </div>
  </div>
</div>
