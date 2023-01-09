
import { NextFunction, Request, Response, Router, urlencoded } from "express";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
const CB_URI: string = process.env.CB_URI || "/callback";

import * as SpotifyService from "../service/spotify-service";
import * as RoomService from "../service/room-service";
import { GenerateRandomAlphanumericString } from "../utils/string-utils";

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

// custom URI for closed-alpha room creation
router.get("/ca/create", (req: Request, res: Response) => {
    let state: string = GenerateRandomAlphanumericString(16);
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
    let token: string = await SpotifyService.AuthorizeUser(authorization_code);
    if(!token) {
        next(new Error("Spotify: null access token"));
        return;
    }

    let user_info = await SpotifyService.GetUserInfo(token);

    if(!user_info) {
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
        next(new Error("Room Service: failed to find user room"));
        return;
    }

    // passed all checks, set some cookies
    res.cookie("SpofityToken", token);
    res.cookie("ScreenName", screen_name);

    RoomService.SetTokenExp(room_num, token);

    room_num = encodeURIComponent(room_num);
    res.redirect("/spotify/host?room=" + room_num);
});

router.get("/spotify/host", (req: Request, res: Response) => {

    let spotify_token = req.cookies ? req.cookies["SpofityToken"] : null;
    let screen_name: string = req.cookies ? req.cookies["ScreenName"] : "";
    let room_number: string = "";

    if(req.query) { // always true unless query-parser is set to false
        if(req.query.room) {
            room_number = req.query.room as string;
            if(spotify_token) {
                if(spotify_token == RoomService.GetToken(room_number)) {
                    console.log("token matches internal room");
                }
                else {
                    throw new Error("Spotify token mismatch");
                }
            }
            else {
                throw new Error("no Spotify token found");
            }
        }
    }

    if(screen_name.length > 32) { // potentially malicious? Spotify caps at 30
        throw new Error("bad name param");
    }

    res.render("host", { room: room_number, name: screen_name });
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
    if(req.body) {
        console.log(req.body);
        if(req.body.song) {
            song = req.body.song as string;
            if(song.length > 48) {
                throw new Error("Spotify search: param too long");
            }
            console.log("Searching for track ^ on Spotify...");
        }
        let itemArray = await SpotifyService.Search(song);
        res.send({ "result": itemArray });
    }
    else {
        throw new Error("Spotify search: no payload found");
    }
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
