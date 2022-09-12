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
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../.env") });
const host = process.env.HOST || "host";
const port = process.env.PORT || "80";
app.use(express_1.default.static(path_1.default.join(__dirname, "../../webapp/public")));
app.set("views", path_1.default.join(__dirname, "../../webapp/views"));
app.set("view engine", "ejs");
// logs path + IP address for every request
app.use((req, res, next) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});
app.get("/", (req, res) => {
    res.render("home");
});
// handle 5XXs
app.use((err, req, res, next) => {
    console.log("error!", err.stack);
    res.status(500).send("Sorry, something went wrong!");
});
// handle 404s - must be last! before app.listen
app.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that! Double check your URL");
});
app.listen(port, () => {
    console.log(`Jukebox server listening at ${host}:${port}`);
});
