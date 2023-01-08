"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToQueue = exports.Search = exports.GetUserInfo = exports.AuthorizeUser = exports.GetUserAuthURL = void 0;
const path_1 = __importDefault(require("path"));
const http_request_service_1 = require("./http-request-service");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../../.env") });
const SPOTIFY_ID = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK = process.env.SPOTIFY_CALLBACK || "";
const ACCOUNTS_SPOTIFY = "https://accounts.spotify.com";
const API_SPOTIFY = "https://api.spotify.com";
let JUKEBOX_TOKEN = "";
let ZACK_TOKEN = "";
let I_AM_LAZY = true;
function responseContainsData(response) {
    if ("data" in response) {
        console.log("got data from Spotify:");
        console.log(response.data);
        return true;
    }
    else {
        console.log("error: missing data from Spotify");
        return false;
    }
}
// need to authenticate "Jukebox" using "Client Credentials" Spotify auth flow
async function clientCredentials() {
    const body = {
        grant_type: "client_credentials"
    };
    const id_secret_buffer = Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET);
    const base64_encoded_id_secret = id_secret_buffer.toString("base64");
    const headers = {
        "Authorization": "Basic " + base64_encoded_id_secret,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    let resp = await (0, http_request_service_1.Post)("https://accounts.spotify.com/api/token", body, headers);
    if (responseContainsData(resp)) {
        // all we get is { access_token, token_type (Bearer, here), expires_in (3600) }
        I_AM_LAZY = false;
        return resp.data.access_token;
    }
    else {
        return null;
    }
}
// Spotify authorization code should be at least 128 chars,
// containing A-Z, a-z, 0-9, -, or _
function validateAuthorizationCode(code) {
    console.log("validating authorization code");
    if (/^[0-9A-Za-z_-]{128,}$/.test(code)) {
        console.log("authorization code passed");
    }
    else {
        throw Error("invalid authorization code");
    }
}
function GetUserAuthURL(clientStateKey) {
    // developer.spotify.com/documentation/general/guides/authorization/scopes
    let scopes = "user-read-email" +
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
    return (ACCOUNTS_SPOTIFY + "/authorize" + queryString);
}
exports.GetUserAuthURL = GetUserAuthURL;
async function AuthorizeUser(authorization_code) {
    try {
        validateAuthorizationCode(authorization_code);
    }
    catch (error) {
        console.log(error);
        return null;
    }
    console.log("authorizing Spotify user");
    const body = {
        grant_type: "authorization_code",
        redirect_uri: SPOTIFY_CALLBACK,
        code: authorization_code
    };
    const id_secret_buffer = Buffer.from(SPOTIFY_ID + ":" + SPOTIFY_SECRET);
    const base64_encoded_id_secret = id_secret_buffer.toString("base64");
    const headers = {
        "Authorization": "Basic " + base64_encoded_id_secret,
        "Content-Type": "application/x-www-form-urlencoded"
    };
    let response = await (0, http_request_service_1.Post)(ACCOUNTS_SPOTIFY + "/api/token", body, headers);
    if (responseContainsData(response)) {
        return response.data.access_token;
    }
    else {
        return null;
    }
}
exports.AuthorizeUser = AuthorizeUser;
async function GetUserInfo(user_token) {
    console.log("getting Spotify user info");
    const headers = {
        "Authorization": `Bearer ${user_token}`,
        "Content-Type": "application/json"
    };
    // nobody gets me
    let response = await (0, http_request_service_1.Get)(API_SPOTIFY + "/v1/me", headers);
    if (responseContainsData(response)) {
        ZACK_TOKEN = user_token;
        return response.data;
    }
    else {
        return null;
    }
}
exports.GetUserInfo = GetUserInfo;
async function Search(song) {
    if (I_AM_LAZY) {
        JUKEBOX_TOKEN = await clientCredentials();
    }
    const headers = {
        "Authorization": `Bearer ${JUKEBOX_TOKEN}`,
        "Content-Type": "application/json"
    };
    const params = {
        q: song,
        type: "track",
        limit: 5
    };
    let resp = await (0, http_request_service_1.Get)(API_SPOTIFY + "/v1/search", headers, params);
    if (responseContainsData(resp)) {
        return resp.data.tracks.items;
    }
    else {
        return null;
    }
}
exports.Search = Search;
// it's the bread and butter!
async function AddToQueue(songID) {
    const headers = {
        //"Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${ZACK_TOKEN}`,
        "Content-Type": "application/json"
    };
    const params = {
        uri: `spotify:track:${songID}`
    };
    let resp = await (0, http_request_service_1.Post)(API_SPOTIFY + "/v1/me/player/queue", null, headers, params);
    if (resp) {
        console.log(resp.status);
        return { "result": "gud" };
    }
    else {
        return { "result": "bad" };
    }
}
exports.AddToQueue = AddToQueue;
