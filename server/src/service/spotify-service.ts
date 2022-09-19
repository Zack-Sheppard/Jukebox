
import { Response } from "express";
import path from "path";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
const SPOTIFY_ID: string = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET: string = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK: string = process.env.SPOTIFY_CALLBACK || "";

function RegisterThroughSpotify(res: Response) {

    let scopes: string = "user-read-email" +
                        " user-read-private";

    res.redirect("https://accounts.spotify.com/authorize" +
               "?response_type=code" +
               "&client_id=" + SPOTIFY_ID +
               "&scope=" + encodeURIComponent(scopes) +
               "&redirect_uri=" + encodeURIComponent(SPOTIFY_CALLBACK) +
               "&show_dialog=true"
    );
}

function GetUserInfo() {
    // TODO
}

export { RegisterThroughSpotify };
