<script>
    import { createEventDispatcher } from "svelte";

    export let productTitle;

    const dispatch = createEventDispatcher();

    function addToCart() {
        dispatch("add-to-cart", {
            id: "p1",
        });
    }

    function deleteProduct() {
        dispatch("delete", "p1");
    }
</script>

<article>
    <h1>{productTitle}</h1>
    <!-- If we just set the event listener "on:click" without pointing it to a function it will forward the event -->
    <!-- to the parent component. It only forwards up one component! -->
    <button on:click={addToCart}>Add to Cart</button>
    <!-- Just using the raw "on:click" will cause problems if we have multiple items that use "on:click" -->
    <button on:click={deleteProduct}>Delete</button>
</article>
