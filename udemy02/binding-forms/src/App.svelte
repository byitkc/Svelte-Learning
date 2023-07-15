<script>
    import CustomInput from "./CustomInput.svelte";
    import Toggle from "./Toggle.svelte";

    let value = "Brandon";
    let price;
    let selectedOption = 1;

    $: console.log(value);
    $: console.log(selectedOption);
    $: console.log(price);

    function setValue(event) {
        value = event.target.value;
    }
</script>

<!-- <input type="text" {value} on:input={setValue} /> -->
<!-- <input type="text" bind:value /> -->
<CustomInput bind:value />
<Toggle bind:chosenOption={selectedOption} />

<input type="number" bind:value={price} />
