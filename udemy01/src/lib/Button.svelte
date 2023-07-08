<script>
</script>

<!-- We can use "slot" to pull the text from the button defined between tags in App.svelte -->
<!-- If we use the slot tags and place something in them, it will be used if no slot is passed -->
<button><slot>Fallback</slot></button>

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
            background-color: variables.$color;
        }
    }
</style>
