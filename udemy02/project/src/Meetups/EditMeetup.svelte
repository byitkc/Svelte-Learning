<script>
    import { createEventDispatcher } from "svelte";
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import Modal from "../UI/Modal.svelte";
    import { isEmpty, isValidEmail } from "../Helpers/validation.js";

    let title = "";
    let subtitle = "";
    let address = "";
    let email = "";
    let imageUrl = "";
    let description = "";
    let formIsValid = false;

    const dispatch = createEventDispatcher();

    $: titleValid = !isEmpty(title);
    $: subtitleValid = !isEmpty(subtitle);
    $: addressValid = !isEmpty(address);
    $: emailValid = isValidEmail(email);
    $: imageUrlValid = !isEmpty(imageUrl);
    $: descriptionValid = !isEmpty(description);
    $: formIsValid =
        titleValid &&
        subtitleValid &&
        addressValid &&
        emailValid &&
        imageUrlValid &&
        descriptionValid;

    function submitForm() {
        dispatch("save", {
            title: title,
            subtitle: subtitle,
            address: address,
            email: email,
            imageUrl: imageUrl,
            description: description,
        });
    }

    function cancel() {
        dispatch("cancel");
    }
</script>

<Modal title="Edit Meetup" on:cancel>
    <form on:submit|preventDefault={submitForm}>
        <TextInput
            id="title"
            label="Title"
            valid={titleValid}
            validityMessage="Please enter a valid Title"
            value={title}
            on:input={(event) => (title = event.target.value)}
        />
        <TextInput
            id="subtitle"
            label="Subtitle"
            valid={subtitleValid}
            validityMessage="Please enter a valid Subtitle"
            value={subtitle}
            on:input={(event) => (subtitle = event.target.value)}
        />
        <TextInput
            id="address"
            label="Address"
            valid={addressValid}
            validityMessage="Please enter a valid Address"
            value={address}
            on:input={(event) => (address = event.target.value)}
        />
        <TextInput
            id="imageUrl"
            label="Image URL"
            valid={imageUrlValid}
            validityMessage="Please enter a valid Image URL"
            value={imageUrl}
            on:input={(event) => (imageUrl = event.target.value)}
        />
        <TextInput
            id="email"
            label="Email"
            valid={emailValid}
            validityMessage="Please enter a valid Email Address"
            value={email}
            type="email"
            on:input={(event) => (email = event.target.value)}
        />
        <TextInput
            id="description"
            label="Description"
            valid={descriptionValid}
            validityMessage="Please enter a valid Description"
            value={description}
            controlType="textarea"
            on:input={(event) => (description = event.target.value)}
        />
    </form>
    <div slot="footer">
        <Button type="button" on:click={submitForm} disabled={!formIsValid}
            >Save</Button
        >
        <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    </div>
</Modal>

<style>
    form {
        width: 100%;
        max-width: 90%;
        margin: auto;
    }
</style>
