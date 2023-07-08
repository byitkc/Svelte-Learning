<script>
    import Button from "./Button.svelte";
    import { v4 as uuid } from "uuid";

    export let todos = [];
    let inputText = "";

    function handleAddTodo() {
        if (!inputText) return;
        // Add the input text to the todos array
        todos = [
            ...todos,
            {
                id: uuid(),
                title: inputText,
                completed: false,
            },
        ];
        // Clear the input after submission
        inputText = "";
    }
</script>

<div class="todo-list-wrapper">
    <ul>
        {#each todos as { id, title }, index (id)}
            <!-- We can define a variable inside of our loop, it can only be used as a child (ex. of a each or if) -->
            {@const number = index + 1}
            <!-- Then we can use that variable -->
            <li>{number} - {title}</li>
        {/each}
    </ul>
    <form class="add-todo-form" on:submit|preventDefault={handleAddTodo}>
        <input bind:value={inputText} />
        <Button type="submit" disabled={!inputText}>Add</Button>
    </form>
</div>
