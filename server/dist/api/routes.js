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
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../../.env") });
const CB_URI = process.env.CB_URI || "/callback";
const SpotifyService = __importStar(require("../service/spotify-service"));
const RoomService = __importStar(require("../service/room-service"));
const StringUtils = __importStar(require("../utils/string-utils"));
const RoomUtils = __importStar(require("../utils/room-utils"));
const router = (0, express_1.Router)();
// logs path + IP address for every request
router.use((req, res, next) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});
router.get("/", (req, res) => {
    res.render("home");
});
router.use("/room", (0, express_1.urlencoded)({
    extended: true
}));
router.post(/\/room$/, (req, res, next) => {
    let room_number = "";
    if (!req.body || !req.body.room) {
        console.log("did not find room param");
        res.send({ "result": "bad" });
        return;
    }
    room_number = req.body.room;
    if (room_number.length !== 3) {
        console.log("Room POST: string was not 3 chars");
        res.send({ "result": "bad" });
        return;
    }
    if (!StringUtils.IsAlphanumericString(room_number)) {
        console.log("Room POST: string was not alphanumeric!");
        res.send({ "result": "bad" });
        return;
    }
    room_number = RoomUtils.ConvertAlphanumToRoomNumber(room_number);
    if (!RoomUtils.IsValidRoomNumber(room_number)) {
        next(new Error("Room POST: invalid room number after conversion"));
        return;
    }
    res.send({
        "result": "ok",
        "room_to_join": room_number
    });
});
// join room as guest
router.get(/\/room\/[0-9][0-9][0-9]$/, (req, res) => {
    let roomNum = req.url.slice(6, 9);
    res.render("guest", { num: roomNum });
});
// custom URI for closed-alpha room creation
router.get("/ca/create", (req, res) => {
    let state = StringUtils.GenerateRandomAlphanumericString(16);
    res.cookie("stateKey", state);
    let url = SpotifyService.GetUserAuthURL(state);
    res.redirect(url);
});
router.get("/callback", (req, res) => {
    console.log("something went wrong! This is the old callback URI");
    throw new Error("invalid callback URI");
});
router.get(CB_URI, async (req, res, next) => {
    let state = req.query.state;
    let storedState = req.cookies ? req.cookies["stateKey"] : null;
    if (state === null || state != storedState) {
        next(new Error("callback URI: state mismatch"));
        return;
    }
    if (req.query.error) {
        if (req.query.error == "access_denied") { // client denied access
            res.redirect("/");
        }
        else {
            console.log(req.query.error);
            next(new Error("Spotify: login error")); // other error happened
        }
        return;
    }
    if (!req.query.code) {
        next(new Error("Spotify: null authorization code"));
        return;
    }
    let authorization_code = req.query.code;
    let tokens = await SpotifyService.AuthorizeUser(authorization_code);
    if (!tokens) {
        next(new Error("Spotify: null access token(s)"));
        return;
    }
    let user_info = await SpotifyService.GetUserInfo(tokens[0]);
    if (!user_info) {
        // 1/2
        next(new Error("Spotify: failed to get user info"));
        return;
    }
    // user credentials
    let screen_name = user_info.display_name;
    if (screen_name == null) {
        console.log("couldn't find display name");
        screen_name = "";
    }
    let email = user_info.email;
    if (email == null) {
        next(new Error("Spotify: failed to get user email"));
        return;
    }
    // find dedicated client room number
    let room_num = RoomService.FindRoomNumber(email);
    if (room_num == "") {
        // 2/2
        next(new Error("Room Service: failed to find user room"));
        return;
    }
    // passed all checks, set some cookies
    res.cookie("SpofityToken", tokens[1]);
    res.cookie("ScreenName", screen_name);
    RoomService.SetTokens(room_num, tokens[0], tokens[1]);
    room_num = encodeURIComponent(room_num);
    res.redirect("/spotify/host?room=" + room_num);
});
router.get("/spotify/host", (req, res, next) => {
    let spotify_token = req.cookies ? req.cookies["SpofityToken"] : null;
    let screen_name = req.cookies ? req.cookies["ScreenName"] : "";
    let room_number = "";
    // req.query always true unless query-parser is set to false
    if (!req.query || !req.query.room) {
        next(new Error("Spotify host: failed to find room param"));
    }
    room_number = req.query.room;
    if (!RoomUtils.IsValidRoomNumber(room_number)) {
        next(new Error("Spotify host: invalid room number"));
    }
    if (!spotify_token) {
        next(new Error("Spotify host: no Spotify token found"));
    }
    let room_token = RoomService.GetTokens(room_number)[1];
    if (room_token == "") {
        res.redirect("/ca/create");
    }
    if (spotify_token != room_token) {
        console.log("new token who dis");
        res.redirect("/ca/create");
    }
    console.log("token matches internal room");
    if (screen_name.length > 32) { // potentially malicious? Spotify caps at 30
        next(new Error("Spotify host: bad name param"));
    }
    res.render("host", { num: room_number, name: screen_name });
});
router.use("/spotify/search", (0, express_1.urlencoded)({
    extended: true
}));
router.post("/spotify/search", async (req, res, next) => {
    let song = "Never Gonna Give You Up";
    if (req.body && req.body.song) {
        song = req.body.song;
    }
    if (song.length > 48) {
        next(new Error("Spotify search: param too long"));
        return;
    }
    let itemArray = await SpotifyService.Search(song);
    res.send({ "result": itemArray });
});
// add to queue
router.get(/\/room\/[0-9][0-9][0-9]\/add/, async (req, res, next) => {
    let roomNum = req.url.slice(6, 9);
    let songID = "";
    if (!req.query || !req.query.songID) {
        next(new Error("Room add: no song param"));
        return;
    }
    songID = req.query.songID;
    console.log("Adding song to room", roomNum);
    console.log(req.query);
    let result = await SpotifyService.AddToQueue(songID, roomNum);
    res.send(result);
});
// handle 5XXs
router.use((err, req, res, next) => {
    console.log("error!", err.stack);
    res.render("5XX");
});
// handle 404s - must be last!
router.use((req, res, next) => {
    res.render("404");
});
exports.default = router;
