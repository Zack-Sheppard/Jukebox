
import { Get, Post } from "../../src/service/http-request-service";

const testEndpoint: string = "https://httpbin.org";

// valid GETs
test("valid GET request should return 200", async () => {
    const data = await Get(testEndpoint + "/get");
    expect(data.status).toBe(200);
});

test("valid GET with null headers/params should still return 200", async () => {
    const data = await Get(testEndpoint + "/get", null, null);
    expect(data.status).toBe(200);
});

// invalid GETs
test("invalid GET URL should return null", async () => {
    const data = await Get("");
    expect(data).toBe(null);
});

test("unauth'd GET to accounts.spotify should return 401", async () => {
    const headers = {
        "Content-Type": "application/json"
    }
    const data = await Get("https://api.spotify.com/v1/me", headers);
    expect(data.response?.status).toBe(401);
});

test("non-existent GET URL should return 404", async () => {
    const data = await Get(testEndpoint + "/nowaythisexists");
    expect(data.response?.status).toBe(404);
});

// valid POST
test("valid POST request should return 200", async () => {
    const headers = {
        "Content-Type": "application/json"
    }
    const body = {
        sendString: "hello"
    }
    const data = await Post(testEndpoint + "/post", headers, null, body);
    expect(data.status).toBe(200);
});

// invalid POSTs
test("invalid POST URL should return null", async () => {
    const data = await Post("", {});
    expect(data).toBe(null);
});

test("POST without data should return null", async () => {
    const data = await Post("", null);
    expect(data).toBe(null);
});
