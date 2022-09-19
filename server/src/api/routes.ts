
import { NextFunction, Request, Response, Router } from "express";
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

// custom URI for pre-alpha invitations
router.get("/register", (req: Request, res: Response) => {
    console.log("got a request to register!");
    SpotifyService.RegisterThroughSpotify(res);
});

router.get("/callback", (req: Request, res: Response) => {
    console.log("Spotify returned:");
    console.log(req.query);

    if(req.query.error) {
        if(req.query.error == "access_denied") {    // client denied access
            res.redirect("/");
            return;
        }
        else {
            throw new Error("Spotify login error"); // actual error happened
        }
    }
    res.redirect("/thank-you");
});

router.get("/thank-you", (req: Request, res: Response) => {
    console.log("got a request for the thank-you page");
    res.render("thank-you");
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
