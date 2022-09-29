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
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../../.env") });
const CB_URI = process.env.CB_URI || "/callback";
const SpotifyService = __importStar(require("../service/spotify-service"));
const router = (0, express_1.Router)();
// logs path + IP address for every request
router.use((req, res, next) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});
router.get("/", (req, res) => {
    res.render("home");
});
// custom URI for closed-alpha invitations
router.get("/register", (req, res) => {
    let url = SpotifyService.GetUserAuthURL();
    res.redirect(url);
});
router.get("/callback", (req, res) => {
    console.log("something went wrong! This is the old callback URI");
    throw new Error("invalid callback URI");
});
router.get(CB_URI, async (req, res, next) => {
    if (req.query.error) {
        if (req.query.error == "access_denied") { // client denied access
            res.redirect("/");
        }
        else {
            next(new Error("Spotify: login error")); // other error happened
        }
        return;
    }
    if (!req.query.code) {
        next(new Error("Spotify: null authorization code"));
        return;
    }
    let authorization_code = req.query.code;
    let token = await SpotifyService.AuthorizeUser(authorization_code);
    if (!token) {
        next(new Error("Spotify: null access token"));
        return;
    }
    let user_info = await SpotifyService.GetUserInfo(token);
    if (!user_info) {
        next(new Error("Spotify: failed to get user info"));
        return;
    }
    let screen_name = user_info.display_name;
    if (screen_name == null) {
        screen_name = "";
    }
    screen_name = encodeURIComponent(screen_name);
    res.redirect("/thank-you?name=" + screen_name);
});
router.get("/thank-you", (req, res) => {
    let screen_name = "";
    if (req.query.name) {
        screen_name = req.query.name;
        if (screen_name.length > 32) { // potentially malicious?
            throw new Error("bad name param");
        }
    }
    res.render("thank-you", { name: screen_name });
});
// handle 5XXs
router.use((err, req, res, next) => {
    console.log("error!", err.stack);
    res.render("5XX");
});
// handle 404s - must be last!
router.use((req, res, next) => {
    res.render("404");
});
exports.default = router;
