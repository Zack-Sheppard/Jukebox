
import path from "path";
import { Get, Post } from "./http-request-service";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
const SPOTIFY_ID: string = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET: string = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK: string = process.env.SPOTIFY_CALLBACK || "";

const ACCOUNTS_SPOTIFY: string = "https://accounts.spotify.com";
const API_SPOTIFY: string = "https://api.spotify.com";

type dataBearingObject = {
    data: any
}

function responseContainsData(response: any): response is dataBearingObject {
    if("data" in response) {
        console.log("got data from Spotify:");
        console.log(response.data);
        return true;
    }
    else {
        console.log("error: missing data from Spotify");
        return false;
    }
}

// Spotify authorization code should be at least 128 chars,
// containing A-Z, a-z, 0-9, -, or _
function validateAuthorizationCode(code: string) {
    console.log("validating authorization code");
    if(/^[0-9A-Za-z_-]{128,}$/.test(code)) {
        console.log("authorization code passed"); 
    }
    else {
        throw Error("invalid authorization code");
    }
}

// maybe rename this function, or split its functionality up
function GetUserAuthURL(clientStateKey: string): string {

    // developer.spotify.com/documentation/general/guides/authorization/scopes
    let scopes: string = "user-read-email" +
                        " user-read-private" +
                        " user-read-currently-playing" +
                        " user-read-playback-state" +
                        " user-modify-playback-state";

    let queryString = "?response_type=code" +
                      "&client_id=" + SPOTIFY_ID +
                      "&scope=" + encodeURIComponent(scopes) +
                      "&redirect_uri=" + encodeURIComponent(SPOTIFY_CALLBACK) +
                      "&state=" + encodeURIComponent(clientStateKey) +
                      "&show_dialog=true";

    return ( ACCOUNTS_SPOTIFY + "/authorize" + queryString );
}

async function AuthorizeUser(authorization_code: string) {

    try {
        validateAuthorizationCode(authorization_code);
    }
    catch(error) {
        console.log(error)
        return null;
    }

    console.log("authorizing Spotify user");

    const body = {
        grant_type: "authorization_code",
        redirect_uri: SPOTIFY_CALLBACK,
        code: authorization_code
    }

    const id_secret_buffer = Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET);
    const base64_encoded_id_secret = id_secret_buffer.toString("base64");

    const headers = {
        "Authorization": "Basic " + base64_encoded_id_secret,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    let response = await Post(ACCOUNTS_SPOTIFY + "/api/token", body, headers);

    if(responseContainsData(response)) {
        return response.data.access_token;
    }
    else {
        return null;
    }
}

async function GetUserInfo(user_token: string) {
    console.log("getting Spotify user info");

    const headers = {
        "Authorization": `Bearer ${user_token}`,
        "Content-Type": "application/json"
    }

    // nobody gets me
    let response = await Get(API_SPOTIFY + "/v1/me", headers);

    if(responseContainsData(response)) {
        return response.data;
    }
    else {
        return null;
    }
}

export { GetUserAuthURL, AuthorizeUser, GetUserInfo };
