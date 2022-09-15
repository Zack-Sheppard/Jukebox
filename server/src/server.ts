
import express, { Express } from "express";
const app: Express = express();

import router from "./api/routes";

import path from "path";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
const PORT: string | undefined = process.env.PORT || "80";

app.use(express.static(path.join(__dirname, "../../webapp/public")));
app.use("/", router);

app.set("views", path.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
    console.log(`Jukebox server listening on port ${PORT}`);
});
