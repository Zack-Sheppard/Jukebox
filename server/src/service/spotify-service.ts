
import path from "path";
import { Get, Post } from "./http-request-service";
import { GetTokenExp, GetTokens, SetTokens } from "./room-service";

import { AxiosError } from "axios";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const SPOTIFY_ID:       string = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET:   string = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK: string = process.env.SPOTIFY_CALLBACK || "";

const ACCOUNTS_SPOTIFY: string = "https://accounts.spotify.com";
const API_SPOTIFY:      string = "https://api.spotify.com";
const QUEUE:            string = "/v1/me/player/queue";

const SEARCH_LIMIT: number = 5;

let jukeboxToken: string = "";
let jbTokenExpiresAt: number = Date.now();

type dataBearingObject = {
    data: any
}

function responseContainsData(response: any): response is dataBearingObject {
    if("data" in response) {
        // console.log("got data from Spotify:");
        // console.log(response.data);
        return true;
    }
    else {
        console.log("error: missing data from Spotify");
        return false;
    }
}

function shouldRefreshJukeboxToken(): boolean {

    let tokenExpiresIn: number = jbTokenExpiresAt - Date.now();

    // if token expires in 5 minutes or less
    if (tokenExpiresIn <= (5 * 60 * 1000)) {
        return true;
    }
    else {
        return false;
    }
}

function shouldRefreshUserToken(roomNum: string): boolean {

    let tokenExpiresIn: number = GetTokenExp(roomNum) - Date.now();

    // if token expires in 5 minutes or less
    if (tokenExpiresIn <= (5 * 60 * 1000)) {
        return true;
    }
    else {
        return false;
    }
}

// need to authenticate "Jukebox" using "Client Credentials" Spotify auth flow
async function clientCredentials() {

    //console.log("refreshing Jukebox token...");

    const body = {
        grant_type: "client_credentials"
    }

    const id_secret_buffer = Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET);
    const base64_encoded_id_secret = id_secret_buffer.toString("base64");

    const headers = {
        "Authorization": "Basic " + base64_encoded_id_secret,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    let resp = await Post(ACCOUNTS_SPOTIFY + "/api/token", body, headers);
    // rcv { access_token, token_type (Bearer, here), expires_in (3600) }

    if(responseContainsData(resp)) {
        jbTokenExpiresAt = Date.now() + (resp.data.expires_in * 1000);
        return resp.data.access_token;
    }
    else {
        return null;
    }
}

async function refreshUserToken(roomNum: string) {

    console.log("refreshing Spotify user token in room " + roomNum);

    // get user refresh token from room N
    let userRefreshToken = GetTokens(roomNum)[1];

    const body = {
        grant_type: "refresh_token",
        refresh_token: userRefreshToken
    }

    const id_secret_buffer = Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET);
    const base64_encoded_id_secret = id_secret_buffer.toString("base64");

    const headers = {
        "Authorization": "Basic " + base64_encoded_id_secret,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    let resp = await Post(ACCOUNTS_SPOTIFY + "/api/token", body, headers);
    // should receive { access_token, token_type, scope, expires_in }

    if(responseContainsData(resp)) {
        SetTokens(roomNum, resp.data.access_token, userRefreshToken);
        return resp.data.access_token;
    }
    else {
        return "";
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

function GetUserAuthURL(clientStateKey: string): string {

    // developer.spotify.com/documentation/general/guides/authorization/scopes
    let scopes: string = "user-read-email" +
                        " user-read-private" +
                        " user-read-currently-playing" +
                        " user-read-playback-state" +
                        " user-modify-playback-state";

    let queryString = "?response_type=code" +
                      "&client_id=" + encodeURIComponent(SPOTIFY_ID) +
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
        return [ response.data.access_token, response.data.refresh_token ];
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

async function Search(song: string) {

    if(shouldRefreshJukeboxToken()) {
        jukeboxToken = await clientCredentials();
    }

    const headers = {
        "Authorization": `Bearer ${jukeboxToken}`,
        "Content-Type": "application/json"
    }

    const params = {
        q: song,
        type: "track",
        limit: SEARCH_LIMIT
    }

    let resp = await Get(API_SPOTIFY + "/v1/search", headers, params);

    if(responseContainsData(resp)) {
        return resp.data.tracks.items;
    }
    else {
        return null;
    }
}

// it's the bread and butter!
async function AddToQueue(songID: string, roomNum: string) {

    let user_token: string = "";

    if(shouldRefreshUserToken(roomNum)) {
        user_token = await refreshUserToken(roomNum);
    }
    else {
        user_token = GetTokens(roomNum)[0];
    }

    if(user_token == "") {
        console.log("failed to refresh user token");
        return { "result": "fail" }
    }

    const headers = {
        "Authorization": `Bearer ${user_token}`,
        "Content-Type": "application/json"
    };

    const params = {
        uri: `spotify:track:${songID}`
    };

    let resp = await Post(API_SPOTIFY + QUEUE, null, headers, params);

    if(resp && resp.status == 204) {
        return { "result": "success" };
    }
    else if(resp instanceof AxiosError) { // functionify
        if(resp && resp.response) {
            if(resp.response.status == 401) {
                return { 
                    "result": "fail",
                    "code": 401
                }
            }
            else if(resp.response.status == 403) {
                return { 
                    "result": "fail",
                    "code": 403
                }
            }
            else if(resp.response.status == 404) {
                return { 
                    "result": "fail",
                    "code": 404
                }
            }
            else {
                return { "result": "fail" };
            }
        }
    }
    else {
        return { "result": "fail" };
    }
}

export { GetUserAuthURL, AuthorizeUser, GetUserInfo, Search, AddToQueue };
