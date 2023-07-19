import { writable } from "svelte/store";

const cart = writable([
    {
        id: "123",
        title: "Test",
        price: 9.99
    },
    {
        id: "124",
        title: "Test",
        price: 9.99
    }
]);

export default cart;