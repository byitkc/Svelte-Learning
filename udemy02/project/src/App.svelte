<script>
    import Header from "./UI/Header.svelte";
    import MeetupItem from "./Meetups/MeetupItem.svelte";

    const meetups = [
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
</script>

<Header />

<section id="meetups">
    {#each meetups as meetup}
        <MeetupItem />
    {/each}
</section>

<style>
    #meetups {
        margin-top: 4rem;
    }
</style>
