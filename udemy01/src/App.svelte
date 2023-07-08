<script>
	import Counter from "./lib/Counter.svelte";

	const props = {
		initialCount: 3,
		maxCount: 6
	};
</script>

<!-- We can also spread an object to pass props to our components -->
<Counter {...props} thing={0} />

<style>
</style>
