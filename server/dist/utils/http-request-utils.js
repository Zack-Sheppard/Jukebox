"use strict";
// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
// +
// https://developer.mozilla.org/en-US/docs/Web/API/URL
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHttpUrl = void 0;
function isValidHttpUrl(url) {
    let valid_url;
    try {
        valid_url = new URL(url);
    }
    catch (e) {
        return false;
    }
    return valid_url.protocol === "http:" || valid_url.protocol === "https:";
}
exports.isValidHttpUrl = isValidHttpUrl;
