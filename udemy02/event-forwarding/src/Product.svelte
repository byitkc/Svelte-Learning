<script>
    import { createEventDispatcher } from "svelte";

    export let id;
    export let title;
    export let price;
    // This is a prop that we don't necessarily need, we set a default value to avoid warnings
    export let bestseller = false;

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
    <h1>{title}</h1>
    <h2>${price}</h2>
    {#if bestseller}
        <h3>Best Seller</h3>
    {/if}
    <!-- If we just set the event listener "on:click" without pointing it to a function it will forward the event -->
    <!-- to the parent component. It only forwards up one component! -->
    <button on:click={addToCart}>Add to Cart</button>
    <!-- Just using the raw "on:click" will cause problems if we have multiple items that use "on:click" -->
    <button on:click={deleteProduct}>Delete</button>
</article>
