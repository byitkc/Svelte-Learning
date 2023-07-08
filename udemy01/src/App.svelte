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

	function handleAddTodo(event) {
		event.preventDefault();
		console.log(event.detail.title);
	}
</script>

<!-- If we bind instead of just passing "todos" it will sync and update here when it is updated in the component -->
<TodoList {todos} on:addtodo={handleAddTodo} />

<style>
</style>
