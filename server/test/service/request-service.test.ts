
import { Get, Post } from "../../src/service/request-service";

test("null POST request should return null Promise", async () => {
    const data = await Post("", null, null, null);
    expect(data).toBe(null);
});

test("null GET request should return null Promise", async () => {
    const data = await Get("", null, null);
    expect(data).toBe(null);
});
