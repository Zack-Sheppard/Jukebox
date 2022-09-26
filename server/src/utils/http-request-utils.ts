
// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
// +
// https://developer.mozilla.org/en-US/docs/Web/API/URL

function isValidHttpUrl(url: string) {
    let valid_url;

    try {
        valid_url = new URL(url);
    }
    catch (e) {
        return false;  
    }

    return valid_url.protocol === "http:" || valid_url.protocol === "https:";
}

export { isValidHttpUrl }
