<!-- When rendered, the script only runs once! -->
<script>
	let count = 0;
	// let string = `You have clicked ${count} times`;

	// Reactive statements run whenever the values they depend on change
	$: string = `You have clicked ${count} times`;

	$: if (count > 5) {
		console.log(`The count is ${count}`);
	}
	// End Reactive statements

	function increment() {
		count += 1;
	}
</script>

<button on:click={increment}>Clicks: {count}</button>
<h3>{string}</h3>

<style>
	button {
		padding: 15px 20px;
	}
</style>
