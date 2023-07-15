<script>
    import Header from "./UI/Header.svelte";
    import MeetupGrid from "./Meetups/MeetupGrid.svelte";
    import EditMeetup from "./Meetups/EditMeetup.svelte";
    import TextInput from "./UI/TextInput.svelte";
    import Button from "./UI/Button.svelte";

    let title = "";
    let subtitle = "";
    let imageUrl = "";
    let address = "";
    let email = "";
    let description = "";

    let meetups = [
        {
            id: "m1",
            title: "Coding Bootcamp",
            subtitle: "Learn to code in 2 hours",
            description:
                "In this meetup, we will have some experts that teach you how to code!",
            imageUrl:
                "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg",
            address: "27th Nerd Road, 32523 New York",
            contactEmail: "code@test.com",
            isFavorite: false,
        },
        {
            id: "m2",
            title: "Swim Together",
            subtitle: "Let's go for some swimming",
            description: "We will simply swim some rounds!",
            imageUrl:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg/2880px-40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg",
            address: "27th Nerd Road, 32523 New York",
            contactEmail: "swim@test.com",
            isFavorite: false,
        },
    ];
    let editMode;

    function addMeetup(event) {
        const newMeetup = {
            id: Math.random().toString(),
            title: event.detail.title,
            subtitle: event.detail.subtitle,
            imageUrl: event.detail.imageUrl,
            address: event.detail.address,
            contactEmail: event.detail.email,
            description: event.detail.description,
        };

        // meetups.push(newMeetup); // DOES NOT WORK!
        meetups = [newMeetup, ...meetups];

        editMode = null;
    }

    function toggleFavorite(event) {
        const id = event.detail;
        // Find the meetup where the meetup id is equal to the id passed in
        const updatedMeetup = { ...meetups.find((m) => m.id === id) };
        // Now we toggle is "isFavorite" value on the meetup item
        updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
        // Find the index of the updated meetup
        const meetupIndex = meetups.findIndex((m) => m.id === id);
        // Create a new array with all the meetups
        const updatedMeetups = [...meetups];
        // Update the meetup at the index with the updated meetup
        updatedMeetups[meetupIndex] = updatedMeetup;
        // Override the existing meetups array
        meetups = updatedMeetups;
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
    <MeetupGrid {meetups} on:toggleFavorite={toggleFavorite} />
</main>

<style>
    main {
        margin-top: 4rem;
    }

    .meetup-controls {
        margin: 1rem;
    }
</style>
