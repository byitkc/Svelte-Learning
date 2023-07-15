<script>
    import CustomInput from "./CustomInput.svelte";
    import Toggle from "./Toggle.svelte";

    let value = "Brandon";
    let price;
    let selectedOption = 1;
    let agreed;
    let favoriteColor;

    $: console.log(value);
    $: console.log(selectedOption);
    $: console.log(price);
    $: console.log(agreed);
    $: console.log(favoriteColor);

    function setValue(event) {
        value = event.target.value;
    }
</script>

<!-- <input type="text" {value} on:input={setValue} /> -->
<!-- <input type="text" bind:value /> -->
<CustomInput bind:value />
<Toggle bind:chosenOption={selectedOption} />

<input type="number" bind:value={price} />

<div>
    <input type="checkbox" bind:checked={agreed} />
    Agree to terms?
</div>

<div>
    <h1>Favorite Color</h1>
    <label>
        <input
            type="radio"
            name="color"
            value="red"
            bind:group={favoriteColor}
        />
        Red
    </label>
    <label>
        <input
            type="radio"
            name="color"
            value="green"
            bind:group={favoriteColor}
        />
        Green
    </label>
    <label>
        <input
            type="radio"
            name="color"
            value="blue"
            bind:group={favoriteColor}
        />
        Blue
    </label>
</div>
