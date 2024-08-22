<script lang="ts">
	// @ts-nocheck
	export let showModal;

	let dialog;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self={() => dialog.close()}
    class="max-w-5xl rounded-lg border-0 p-0"
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div 
        on:click|stopPropagation 
        class="p-10"
    >
    <p class="text-[20px] font-inter font-bold mb-[15px] text-[#0263F4] text-center">How it works?</p>
    <hr />
    <p class="text-[16px] font-inter text-start m-[25px] text-justify leading-7">
      Finiam Secrets transmits E2E messages safely by encrypting the user
      info locally and then generating a URL with a private key embedded on
      it. 
      When you generate a secret, the web app posts the encrypted information
      to our API, which in turn stores that encrypted information. 
      Each secret can only be opened once - secrets get destroyed after they
      have been opened or after they expire.
    </p>
    </div>
</dialog>

<style>
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
