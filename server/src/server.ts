
import express, { Express, Request, Response } from "express";
const app: Express = express();

import path from "path";

import * as dotenv from "dotenv";
dotenv.config();
const host: string | undefined = process.env.HOST;
const port: string | undefined = process.env.PORT;

app.use(express.static(path.join(__dirname, "../../webapp/public")));

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
    console.log("got a request for the homepage");
    res.render("home");
});

app.listen(80, () => {
    console.log(`Jukebox server listening at ${host}:${port}`);
});
