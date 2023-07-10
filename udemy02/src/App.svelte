<script>
    import ContactCard from "./ContactCard.svelte";

    let name = "Max";
    let title = "";
    let image = "";
    let description = "";
    let formState = "empty";

    let createdContacts = [];

    function addContact() {
        if (
            name.trim().length == 0 ||
            title.trim().length == 0 ||
            description.trim().length == 0 ||
            description.trim().length == 0
        ) {
            formState = "invalid";
            return;
        }
        createdContacts = [
            ...createdContacts,
            {
                name: name,
                jobTitle: title,
                imageUrl: image,
                description: description,
            },
        ];
        formState = "done";
    }
</script>

<div id="form">
    <div class="form-control">
        <label for="userName">User Name</label>
        <input type="text" bind:value={name} id="userName" />
    </div>
    <div class="form-control">
        <label for="jobTitle">Job Title</label>
        <input type="text" bind:value={title} id="jobTitle" />
    </div>
    <div class="form-control">
        <label for="image">Image URL</label>
        <input type="text" bind:value={image} id="image" />
    </div>
    <div class="form-control">
        <label for="desc">Description</label>
        <textarea rows="3" bind:value={description} id="desc" />
    </div>
</div>

<button on:click={addContact}>Add Contact Card</button>

{#if formState === "invalid"}
    <p class="error">Please fill in all fields</p>
{:else}
    <p>Fill out the form to add a contact card</p>
{/if}

{#each createdContacts as contact, index}
    <h2># {index + 1}</h2>
    <ContactCard
        userName={contact.name}
        jobTitle={contact.jobTitle}
        description={contact.description}
        userImage={contact.imageUrl}
    />
{:else}
    <p class="warning">⚠️ No contacts created yet!</p>
{/each}

<style>
    #form {
        width: 30rem;
        max-width: 100%;
    }

    .warning {
        color: orange;
    }

    .error {
        color: red;
    }
</style>
