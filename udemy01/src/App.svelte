<script>
	import DiBootstrap from "svelte-icons/di/DiBootstrap.svelte";
	import Button from "./lib/Button.svelte";
</script>

<!-- If we setup the button like this, we can use "slots" to pass the text in `./src/Button.svelte` -->
<Button size="small" shadow>
	<div style:width="20px" slot="leftContent"><DiBootstrap /></div>
	Button Text
</Button>

<style>
</style>
