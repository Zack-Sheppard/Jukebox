
import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();

import path from "path";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
const host: string | undefined = process.env.HOST || "host";
const port: string | undefined = process.env.PORT || "80";

app.use(express.static(path.join(__dirname, "../../webapp/public")));

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

// logs path + IP address for every request
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.render("home");
});

// handle 5XXs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("error!", err.stack);
    res.status(500).send("Sorry, something went wrong!");
});

// handle 404s - must be last! before app.listen
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry, we can't find that! Double check your URL");
});

app.listen(port, () => {
    console.log(`Jukebox server listening at ${host}:${port}`);
});
