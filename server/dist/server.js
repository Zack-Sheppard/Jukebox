"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = process.env.host;
const port = process.env.port;
app.use(express_1.default.static(path_1.default.join(__dirname, "../../webapp/public")));
app.set("views", path_1.default.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("home");
});
app.listen(port, () => {
    console.log(`Jukebox server listening at http://${host}:${port}`);
});
