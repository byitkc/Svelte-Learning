<script>
    import Header from "./UI/Header.svelte";
    import MeetupGrid from "./Meetups/MeetupGrid.svelte";
    import EditMeetup from "./Meetups/EditMeetup.svelte";
    import TextInput from "./UI/TextInput.svelte";
    import Button from "./UI/Button.svelte";
    import meetups from "./Meetups/meetups-store.js";
    import MeetupItem from "./Meetups/MeetupItem.svelte";

    let title = "";
    let subtitle = "";
    let imageUrl = "";
    let address = "";
    let email = "";
    let description = "";

    let editMode;

    function addMeetup(event) {
        const meetupData = {
            title: event.detail.title,
            subtitle: event.detail.subtitle,
            imageUrl: event.detail.imageUrl,
            address: event.detail.address,
            contactEmail: event.detail.email,
            description: event.detail.description,
        };

        // meetups.push(newMeetup); // DOES NOT WORK!
        meetups.addMeetup(meetupData);
        editMode = null;
    }

    function toggleFavorite(event) {
        meetups.toggleFavorite(event.detail);
    }

    function cancelEdit() {
        editMode = null;
    }
</script>

<Header />

<main>
    <div class="meetup-controls" />
    <Button on:click={() => (editMode = "add")}>New Meetup</Button>
    {#if editMode === "add"}
        <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
    {/if}
    <MeetupGrid meetups={$meetups} on:toggleFavorite={toggleFavorite} />
</main>

<style>
    main {
        margin-top: 4rem;
    }

    .meetup-controls {
        margin: 1rem;
    }
</style>
