
import { NextFunction, Request, Response, Router } from "express";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
const CB_URI: string = process.env.CB_URI || "/callback";

import * as SpotifyService from "../service/spotify-service";

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

// custom URI for closed-alpha invitations
router.get("/register", (req: Request, res: Response) => {
    let url = SpotifyService.GetUserAuthURL();
    res.redirect(url);
});

router.get("/callback", (req: Request, res: Response) => {
    console.log("something went wrong! This is the old callback URI");
    throw new Error("invalid callback URI");
});

router.get(CB_URI, async (req: Request, res: Response, next: NextFunction) => {
    if(req.query.error) {
        if(req.query.error == "access_denied") {     // client denied access
            res.redirect("/");
        }
        else {
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
        return
    }

    let user_info = await SpotifyService.GetUserInfo(token);

    if(!user_info) {
        next(new Error("Spotify: failed to get user info"));
        return
    }

    let screen_name: string = user_info.display_name as string;
    if(screen_name == null) {
        screen_name = "";
    }

    screen_name = encodeURIComponent(screen_name);
    res.redirect("/thank-you?name=" + screen_name);
});

router.get("/thank-you", (req: Request, res: Response) => {
    let screen_name: string = "";
    if(req.query.name) {
        screen_name = req.query.name as string;
        if(screen_name.length > 32) { // potentially malicious?
            throw new Error("bad name param");
        }
    }
    res.render("thank-you", { name: screen_name });
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
