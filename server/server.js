
import express from "express";
const app = express();

import { env } from "./config/env-vars.js";
const host = env.host;
const port = env.port;

app.use(express.static("webapp"));

app.listen(port, () => {
    console.log(`Jukebox server listening at http://${host}:${port}`);
});
