
import express from "express";
const app: express.Application = express();

import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config();
const host = process.env.host;
const port = process.env.port;

app.use(express.static(path.join(__dirname, "../../webapp/public")));

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

app.get("/", (req: express.Request, res: express.Response) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Jukebox server listening at http://${host}:${port}`);
});
