
import { NextFunction, Request, Response, Router, urlencoded } from "express";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
const CB_URI: string = process.env.CB_URI || "/callback";

import * as SpotifyService from "../service/spotify-service";
import * as RoomService from "../service/room-service";
import * as StringUtils from "../utils/string-utils";
import * as RoomUtils from "../utils/room-utils";

const router = Router();

// logs path + IP address for every request
router.use((req: Request, res: Response, next: NextFunction) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

router.use("/room",
    urlencoded({
        extended: true
    })
);

router.post(/\/room$/, (req: Request, res: Response, next: NextFunction) => {

    let room_number: string = "";

    if(!req.body || !req.body.room) {
        console.log("did not find room param");
        res.send({ "result": "bad" });
        return;
    }

    room_number = req.body.room as string;

    if(room_number.length !== 3) {
        console.log("Room POST: string was not 3 chars");
        res.send({ "result": "bad" });
        return;
    }

    if(!StringUtils.IsAlphanumericString(room_number)) {
        console.log("Room POST: string was not alphanumeric!");
        res.send({ "result": "bad" });
        return;
    }

    room_number = RoomUtils.ConvertAlphanumToRoomNumber(room_number);

    if(!RoomUtils.IsValidRoomNumber(room_number)) {
        next(new Error("Room POST: invalid room number after conversion"));
        return;
    }

    res.send({ 
                "result": "ok",
                "room_to_join": room_number
             });
});

// join room as guest
router.get(/\/room\/[0-9][0-9][0-9]$/, (req: Request, res: Response) => {
    let roomNum: string = req.url.slice(6, 9);
    res.render("guest", { num: roomNum });
});

// custom URI for closed-alpha room creation
router.get("/ca/create", (req: Request, res: Response) => {
    let state: string = StringUtils.GenerateRandomAlphanumericString(16);
    res.cookie("stateKey", state);
    let url = SpotifyService.GetUserAuthURL(state);
    res.redirect(url);
});

router.get("/callback", (req: Request, res: Response) => {
    console.log("something went wrong! This is the old callback URI");
    throw new Error("invalid callback URI");
});

router.get(CB_URI, async (req: Request, res: Response, next: NextFunction) => {

    let state = req.query.state;
    let storedState = req.cookies ? req.cookies["stateKey"] : null;
    if(state === null || state != storedState) {
        next(new Error("callback URI: state mismatch"));
        return;
    }

    if(req.query.error) {
        if(req.query.error == "access_denied") {     // client denied access
            res.redirect("/");
        }
        else {
            console.log(req.query.error);
            next(new Error("Spotify: login error")); // other error happened
        }
        return;
    }

    if(!req.query.code) {
        next(new Error("Spotify: null authorization code"));
        return;
    }

    let authorization_code: string = req.query.code as string;
    let tokens: any = await SpotifyService.AuthorizeUser(authorization_code);
    if(!tokens) {
        next(new Error("Spotify: null access token(s)"));
        return;
    }

    let user_info = await SpotifyService.GetUserInfo(tokens[0]);

    if(!user_info) {
        // 1/2
        next(new Error("Spotify: failed to get user info"));
        return;
    }

    // user credentials
    let screen_name: string = user_info.display_name as string;
    if(screen_name == null) {
        console.log("couldn't find display name");
        screen_name = "";
    }

    let email: string = user_info.email as string;
    if(email == null) {
        next(new Error("Spotify: failed to get user email"));
        return;
    }

    // find dedicated client room number
    let room_num: string = RoomService.FindRoomNumber(email);

    if(room_num == "") {
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

router.get("/spotify/host", (req: Request,
                             res: Response,
                             next: NextFunction) => {

    let spotify_token = req.cookies ? req.cookies["SpofityToken"] : null;
    let screen_name: string = req.cookies ? req.cookies["ScreenName"] : "";
    let room_number: string = "";

    // req.query always true unless query-parser is set to false
    if(!req.query || !req.query.room) {
        next(new Error("Spotify host: failed to find room param"));
    }

    room_number = req.query.room as string;
    if(!RoomUtils.IsValidRoomNumber(room_number)) {
        next(new Error("Spotify host: invalid room number"));
    }

    if(!spotify_token) {
        next(new Error("Spotify host: no Spotify token found"));
    }

    let room_token: string = RoomService.GetTokens(room_number)[1];

    if(room_token == "") {
        res.redirect("/ca/create");
    }

    if(spotify_token != room_token) {
        console.log("new token who dis");
        res.redirect("/ca/create");
    }

    console.log("token matches internal room");

    if(screen_name.length > 32) { // potentially malicious? Spotify caps at 30
        next(new Error("Spotify host: bad name param"));
    }

    res.render("host", { num: room_number, name: screen_name });
});

router.use("/spotify/search",
    urlencoded({
        extended: true
    })
);

router.post("/spotify/search", async (req: Request,
                                      res: Response,
                                      next: NextFunction) => {

    let song: string = "Never Gonna Give You Up";
    if(req.body && req.body.song) {
        song = req.body.song as string;
    }

    if(song.length > 48) {
        next(new Error("Spotify search: param too long"));
        return;
    }

    let itemArray = await SpotifyService.Search(song);
    res.send({ "result": itemArray });
});

// add to queue
router.get(/\/room\/[0-9][0-9][0-9]\/add/, async (req: Request,
                                                  res: Response,
                                                  next: NextFunction) => {

    let roomNum: string = req.url.slice(6, 9);
    let songID: string = "";

    if(!req.query || !req.query.songID) {
        next(new Error("Room add: no song param"));
        return;
    }

    songID = req.query.songID as string

    console.log("Adding song to room", roomNum);
    console.log(req.query);

    let result = await SpotifyService.AddToQueue(songID, roomNum);
    res.send(result);
});

// handle 5XXs
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error!", err.stack);
    res.render("5XX");
});

// handle 404s - must be last!
router.use((req: Request, res: Response, next: NextFunction) => {
    res.render("404");
});

export default router;
