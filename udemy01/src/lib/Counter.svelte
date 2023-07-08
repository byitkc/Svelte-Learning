<!-- When rendered, the script only runs once! -->
<script>
	let count1 = 0;
	let count2 = 0;

	function setCount2(x) {
		count2 = x;
	}

	// Reactive statements run whenever the values they depend on change

	// Not going to work
	$: setCount2(count1);
	// Order of statements matters, so this will work, but if this statement is above the previous one, it won't work
	$: string = `Count2 is ${count2}`;

	// End Reactive statements

	function increment1() {
		count1 += 1;
	}
</script>

<button on:click={increment1}>Clicks: {count1}</button>

<h3>{string}</h3>

<style>
	button {
		padding: 15px 20px;
	}
</style>
