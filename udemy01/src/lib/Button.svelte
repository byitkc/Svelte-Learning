<script>
    export let size = "small";
    export let shadow = false;
</script>

<!-- We can use "slot" to pull the text from the button defined between tags in App.svelte -->
<!-- If we use the slot tags and place something in them, it will be used if no slot is passed -->
<button
    class:size-lg={size === "large"}
    class:size-md={size === "medium"}
    class:size-sm={size === "small"}
    class:shadow><slot>Fallback</slot></button
>

<style lang="scss">
    button {
        border: none;
        background-color: #ff3e00;
        color: white;
        padding: 15px 20px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
            background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
        }
        &:active {
            background-image: linear-gradient(rgba(255, 255, 255, 0.2) 0 0);
        }
        &.size-sm {
            padding: 15px 20px;
        }
        &.size-md {
            padding: 20px 25px;
        }
        &.size-lg {
            padding: 25px 30px;
        }
        &.shadow {
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        }
    }
</style>
