import { writable } from "svelte/store";

const meetups = writable([
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
]);

const customMeetupsStore = {
    subscribe: meetups.subscribe,
    addMeetup: (meetupData) => {
        const newMeetup = {
            id: Math.random().toString(),
            ...meetupData,
            isFavorite: false,
        };
        meetups.update(items => {
            return [newMeetup, ...items]
        })
    },
    toggleFavorite: (id) => {
        meetups.update(items => {
            // Find the meetup where the meetup id is equal to the id passed in
            const updatedMeetup = { ...items.find((m) => m.id === id) };
            // Now we toggle is "isFavorite" value on the meetup item
            updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
            // Find the index of the updated meetup
            const meetupIndex = items.findIndex((m) => m.id === id);
            // Create a new array with all the meetups
            const updatedMeetups = [...items];
            // Update the meetup at the index with the updated meetup
            updatedMeetups[meetupIndex] = updatedMeetup;
            // Override the existing meetups array
            return updatedMeetups;
        })

    },
}

export default customMeetupsStore;