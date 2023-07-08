<!-- When rendered, the script only runs once! -->
<script>
	// This is how we can use props in our components, if we don't define a default it will be required to be passed when calling the component
	export let initialCount;
	// If we want to, we can set a default value for our props so we don't have to pass it explicitly when calling the component
	export let maxCount = undefined;

	// We can also use the props that we pass using $$props, and the rest of the props that we don't use in our component using $$restProps
	// Recommended to not use these unless necessary as they can cause performance problems
	console.log($$props, $$restProps);

	let count = initialCount;

	function increment() {
		if (count === maxCount) return;
		count += 1;
	}
</script>

<button on:click={increment}>Clicks: {count}</button>

<style>
	button {
		padding: 15px 20px;
	}
</style>
