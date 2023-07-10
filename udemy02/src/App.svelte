<script>
	import ContactCard from "./ContactCard.svelte";

	let name = "Brandon";
	let age = 32;
	let jobTitle = "Infrastructure Engineer";
	let description = "I don't really do anything.";
	let imageUrl;

	// Labeled statements will listen for changes to the variables
	$: upperCaseName = name.toUpperCase();

	$: console.log(name);

	$: if (name === "Bob") {
		console.log("Bob is here!");
		age = 31;
	}

	function incrementAge() {
		age += 1;
	}

	function changeName() {
		name = "Bob";
	}

	function nameInput(event) {
		name = event.target.value;
	}
</script>

<h1>Hello {upperCaseName}, my age is {age}!</h1>
<button on:click={incrementAge}>Change Age</button>
<div><input type="text" bind:value={name} /></div>
<div><input type="text" bind:value={jobTitle} /></div>
<div><textarea rows="3" bind:value={description} /></div>
<div><input type="text" bind:value={imageUrl} /></div>
<ContactCard {name} {jobTitle} {description} {imageUrl} />

<!-- <input type="text" bind:value={name} /> -->

<!-- <button on:click={changeName}>Change Name</button> -->

<style>
	h1 {
		color: purple;
	}
</style>
