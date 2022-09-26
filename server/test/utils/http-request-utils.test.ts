
import { isValidHttpUrl } from "../../src/utils/http-request-utils";

test("good URL should be valid", () => {
    expect(isValidHttpUrl("https://httpbin.org")).toBe(true);
});

test("bad URL should not be valid", () => {
    expect(isValidHttpUrl("agrargaerhearh")).toBe(false);
});
