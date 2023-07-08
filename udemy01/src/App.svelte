<script>
	import TodoList from "./lib/TodoList.svelte";
	import { v4 as uuid } from "uuid";

	let todos = [
		{
			id: uuid(),
			title: "Todo 1",
			completed: true,
		},
		{
			id: uuid(),
			title: "Todo 2",
			completed: false,
		},
		{
			id: uuid(),
			title: "Todo 3",
			completed: true,
		},
	];
	$: console.log(todos);
</script>

<h2>{todos.length} Todos</h2>
<!-- If we bind instead of just passing "todos" it will sync and update here when it is updated in the component -->
<TodoList bind:todos />

<button
	on:click={() => {
		todos = [];
	}}>Clear todos</button
>

<style>
</style>
