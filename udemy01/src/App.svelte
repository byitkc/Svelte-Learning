<script>
	import Button from "./lib/Button.svelte";
	import FaAngellist from "svelte-icons/fa/FaAngellist.svelte";
	import FaAllergies from "svelte-icons/fa/FaAllergies.svelte";
</script>

<Button
	on:click|once={(event) => {
		alert(true);
	}}
	size="small"
	shadow
	disabled
>
	<div style:width="20px" slot="leftContent">
		<FaAngellist />
	</div>
	Button Text
</Button>

<style>
</style>
