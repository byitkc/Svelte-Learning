<script>
    export let productTitle;
</script>

<article>
    <h1>{productTitle}</h1>
    <!-- If we just set the event listener "on:click" without pointing it to a function it will forward the event -->
    <!-- to the parent component. It only forwards up one component! -->
    <button on:click>Add to Cart</button>
    <!-- Just using the raw "on:click" will cause problems if we have multiple items that use "on:click" -->
    <button on:click>Delete</button>
</article>
