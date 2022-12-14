"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("./api/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../.env") });
const PORT = process.env.PORT || "80";
// Spotify variables
const SPOTIFY_ID = process.env.SPOTIFY_ID || "";
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET || "";
const SPOTIFY_CALLBACK = process.env.SPOTIFY_CALLBACK || "";
if (SPOTIFY_ID == "" || SPOTIFY_SECRET == "" || SPOTIFY_CALLBACK == "") {
    console.log("ERROR couldn't find a Spotify variable. Terminating...");
    process.exit();
}
else {
    console.log("Environment variables all set. Starting server...");
}
app.use(express_1.default.static(path_1.default.join(__dirname, "../../webapp/public")));
app.use((0, cookie_parser_1.default)());
app.use("/", routes_1.default);
app.set("views", path_1.default.join(__dirname, "../../webapp/views/pages"));
app.set("view engine", "ejs");
app.set("trust proxy", true);
app.listen(PORT, () => {
    console.log(`Jukebox server listening on port ${PORT}`);
});
