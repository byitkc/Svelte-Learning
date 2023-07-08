<script>
    import Button from "./Button.svelte";

    export let todos = [];
    let inputText = "";

    function handleAddTodo() {
        console.log(inputText);
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
    {inputText}
    <form class="add-todo-form" on:submit|preventDefault={handleAddTodo}>
        <input bind:value={inputText} />
        <Button type="submit">Add</Button>
    </form>
</div>
