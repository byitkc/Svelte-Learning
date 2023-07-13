<script>
    import Header from "./UI/Header.svelte";
    import MeetupGrid from "./Meetups/MeetupGrid.svelte";
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
        },
    ];

    function addMeetup() {
        const newMeetup = {
            id: Math.random().toString(),
            title: title,
            subtitle: subtitle,
            imageUrl: imageUrl,
            address: address,
            contactEmail: email,
            description: description,
        };

        // meetups.push(newMeetup); // DOES NOT WORK!
        meetups = [newMeetup, ...meetups];
    }
</script>

<Header />

<main>
    <form on:submit|preventDefault={addMeetup}>
        <TextInput
            id="title"
            label="Title"
            value={title}
            type="text"
            on:input={(event) => (title = event.target.value)}
        />
        <TextInput
            id="subtitle"
            label="Subtitle"
            value={subtitle}
            type="text"
            on:input={(event) => (subtitle = event.target.value)}
        />
        <TextInput
            id="address"
            label="Address"
            value={address}
            type="text"
            on:input={(event) => (address = event.target.value)}
        />
        <TextInput
            id="imageUrl"
            label="Image URL"
            value={imageUrl}
            type="text"
            on:input={(event) => (imageUrl = event.target.value)}
        />
        <TextInput
            id="email"
            label="Email"
            value={email}
            type="email"
            on:input={(event) => (email = event.target.value)}
        />
        <TextInput
            id="description"
            label="Description"
            value={description}
            controlType="textarea"
            on:input={(event) => (description = event.target.value)}
        />
        <Button type="submit" caption="Save" />
    </form>
    <MeetupGrid {meetups} />
</main>

<style>
    main {
        margin-top: 4rem;
    }

    form {
        width: 30rem;
        max-width: 90%;
        margin: auto;
    }
</style>
