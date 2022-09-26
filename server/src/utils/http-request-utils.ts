
function isValidHttpUrl(url: string): boolean {
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
