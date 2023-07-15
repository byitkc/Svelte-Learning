<script>
    let value = "Brandon";

    $: console.log(value);

    function setValue(event) {
        value = event.target.value;
    }
</script>

<!-- <input type="text" {value} on:input={setValue} /> -->
<input type="text" bind:value />
