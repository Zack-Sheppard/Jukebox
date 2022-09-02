
import express from "express";
const app = express();

import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import { env } from "./config/env-vars.js";
const host = env.host;
const port = env.port;

app.use(express.static(path.join(__dirname, "../webapp/public")));

app.set("views", path.join(__dirname, "../webapp/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
    console.log(`Jukebox server listening at http://${host}:${port}`);
});
