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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
// custom URI for pre-alpha invitations
router.get("/register", (req, res) => {
    console.log("got a request to register!");
    SpotifyService.RegisterThroughSpotify(res);
});
router.get("/callback", (req, res) => {
    console.log("Spotify returned:");
    console.log(req.query);
    if (req.query.error) {
        if (req.query.error == "access_denied") { // client denied access
            res.redirect("/");
            return;
        }
        else {
            throw new Error("Spotify login error"); // actual error happened
        }
    }
    res.redirect("/thank-you");
});
router.get("/thank-you", (req, res) => {
    console.log("got a request for the thank-you page");
    res.render("thank-you");
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
