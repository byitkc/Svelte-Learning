import { readable } from "svelte/store";

let count = 0;

// With a readable function you can only set the value from within the function.
export const timer = readable(count, (set) => {
    const interval = setInterval(() => {
        count++;
        set(count); // Set a new value in the store
    }, 1000);

    return () => {
        // count = 0;
        clearInterval(interval);
    }; // This is a cleanup function that will be called when the component is destroyed
});