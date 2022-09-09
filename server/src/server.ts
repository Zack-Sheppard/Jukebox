
import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();

import path from "path";

import * as dotenv from "dotenv";
dotenv.config();
const host: string | undefined = process.env.HOST;
const port: string | undefined = process.env.PORT;

app.use(express.static(path.join(__dirname, "../../webapp/public")));

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

// logs path + IP address for every request
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("got a request for/from the following:");
    console.log(req.url); // log attempted URL here
    console.log(req.ip);  // log IP address here
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Jukebox server listening at ${host}:${port}`);
});
