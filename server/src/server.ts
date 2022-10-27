
import express, { Express } from "express";
const app: Express = express();

import router from "./api/routes";

import path from "path";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
const PORT: string = process.env.PORT || "80";

// Spotify variables
const SPOTIFY_ID: string = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET: string = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK: string = process.env.SPOTIFY_CALLBACK || "";

if(SPOTIFY_ID == "" || SPOTIFY_SECRET == "" || SPOTIFY_CALLBACK == "") {
    console.log("ERROR couldn't find a Spotify variable. Terminating...");
    process.exit();
}
else {
    console.log("Environment variables all set. Starting server...");
}

app.use(express.static(path.join(__dirname, "../../webapp/public")));
app.use("/", router);

app.set("views", path.join(__dirname, "../../webapp/views/pages"));
app.set("view engine", "ejs");
app.set("trust proxy", true);

app.listen(PORT, () => {
    console.log(`Jukebox server listening on port ${PORT}`);
});
