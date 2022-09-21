
import { Post } from "../../src/service/request-service";

test("null request should return null Promise", async () => {
    const data = await Post("", null, null, null);
    expect(data).toBe(null);
});
