<script>
    export let size = "small";
    export let shadow = false;
    export let bgColor = "inherit";
    export let textColor = "inherit";

    console.log($$slots);
</script>

<!-- We can use "slot" to pull the text from the button defined between tags in App.svelte -->
<!-- If we use the slot tags and place something in them, it will be used if no slot is passed -->
<button
    style:--buttonBgColor={bgColor}
    style:--buttonTextColor={textColor}
    class:size-lg={size === "large"}
    class:size-md={size === "medium"}
    class:size-sm={size === "small"}
    class:shadow
    class:has-left={$$slots.leftContent}
>
    {#if $$slots.leftContent}
        <div class="left-content">
            <slot name="leftContent" />
        </div>
    {/if}
    <slot>Fallback</slot>
</button>

<style lang="scss">
    button {
        display: flex;
        align-items: center;
        border: none;
        background-color: var(--buttonBgColor);
        color: var(--buttonTextColor);
        padding: 15px 20px;
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        .left-content {
            margin-right: 10px;
        }
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
