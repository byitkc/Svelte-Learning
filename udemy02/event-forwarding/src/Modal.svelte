<script>
    import {
        createEventDispatcher,
        onMount,
        onDestroy,
        beforeUpdate,
        afterUpdate,
    } from "svelte";

    const dispatch = createEventDispatcher();

    let agreed = false;
    let autoScroll = false;

    onMount(() => {
        console.log("mounted");
    });

    onDestroy(() => {
        console.log("destroyed");
    });

    // These functions run after every update to the component
    beforeUpdate(() => {
        console.log("before update");
        autoScroll = agreed;
    });

    afterUpdate(() => {
        console.log("after update");
        if (autoScroll) {
            const modal = document.querySelector(".modal");
            modal.scrollTo(0, modal.scrollHeight);
        }
    });

    console.log("script executed");
</script>

<div class="backdrop" on:click={() => dispatch("cancel")} />
<div class="modal">
    <header>
        <slot name="header" />
    </header>
    <div class="content">
        <!-- This tell Svelte that any content passed between the "Modal" tags in the parent should be put here -->
        <slot />
    </div>
    <div class="disclaimer">
        <p>Before you close, you need to agree to our terms!</p>
        <button on:click={() => (agreed = true)}>Agree</button>
    </div>
    <footer>
        <slot name="footer" didAgree={agreed}>
            <button on:click={() => dispatch("close")} disabled={!agreed}
                >Close</button
            >
        </slot>
    </footer>
</div>

<style>
    header {
        border-bottom: 1px solid #ccc;
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        z-index: 10;
    }

    .modal {
        padding: 1rem;
        position: fixed;
        top: 10vh;
        left: 10%;
        width: 80%;
        max-height: 10vh;
        background: white;
        border-radius: 5px;
        z-index: 100;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
        overflow: scroll;
    }
</style>
