
import express, { Express, Request, Response } from "express";
const app: Express = express();

import path from "path";

import dotenv from "dotenv";
dotenv.config();
const host: string | undefined = process.env.host;
const port: string | undefined = process.env.port;

app.use(express.static(path.join(__dirname, "../../webapp/public")));

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Jukebox server listening at http://${host}:${port}`);
});
