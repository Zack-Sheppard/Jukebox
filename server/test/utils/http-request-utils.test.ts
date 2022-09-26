
import { isValidHttpUrl } from "../../src/utils/http-request-utils";

const VALID_URL0 = "http://httpbin.org";
const VALID_URL1 = "https://httpbin.org";
const VALID_URL2 = "https://httpbin.org/endpoint";
const VALID_URL3 = "https://httpbin.org/endpoint?withQuery=abc";

const VALID_URLS = [VALID_URL0, VALID_URL1, VALID_URL2, VALID_URL3];

const INVALID_URL0 = "";
const INVALID_URL1 = "agrargaerhearh";
const INVALID_URL2 = "htt://httpbin.org";
const INVALID_URL3 = "httpbin.waytoolongsuffix";

const INVALID_URLS = [INVALID_URL0, INVALID_URL1, INVALID_URL2, INVALID_URL3];

test("good URLs should be valid", () => {
    for(let i = 0; i < VALID_URLS.length; i++) {
        expect(isValidHttpUrl(VALID_URLS[i])).toBe(true);
    }
});

test("bad URLs should not be valid", () => {
    for(let i = 0; i < INVALID_URLS.length; i++) {
        expect(isValidHttpUrl(INVALID_URLS[i])).toBe(false);
    }
});
