<script>
    export let todos = [];
</script>

<ul>
    {#each todos as { id, title }, index (id)}
        <!-- We can define a variable inside of our loop, it can only be used as a child (ex. of a each or if) -->
        {@const number = index + 1}
        <!-- Then we can use that variable -->
        <li>{number} - {title}</li>
    {/each}
</ul>
