export function isEmpty(value) {
    return value.trim().length == 0;
}

export function isValidEmail(value) {
    var emailPattern = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    console.log("emailPattern.test(value)", emailPattern.test(value));
    return emailPattern.test(value);
}