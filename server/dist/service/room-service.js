"use strict";
// room service LOL
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
exports.SetTokens = exports.GetTokenExp = exports.GetTokens = exports.FindRoomNumber = void 0;
const room_1 = require("../model/room");
const rooms = [];
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path_1.default.join(__dirname, "../../.env") });
const CA_00 = process.env.CA_0_EMAIL || "";
const CA_01 = process.env.CA_1_EMAIL || "";
const CA_02 = process.env.CA_2_EMAIL || "";
const CA_03 = process.env.CA_3_EMAIL || "";
const CA_04 = process.env.CA_4_EMAIL || "";
const CA_EMAIL = [CA_00, CA_01, CA_02, CA_03, CA_04];
const CA_ROOMS = ["999", "715", "210", "081", "414"];
const closed_alpha = [];
function init() {
    // get closed alpha users info
    for (let i = 0; i < CA_EMAIL.length; i++) {
        if (CA_EMAIL[i] == "" || !CA_ROOMS[i]) {
            console.log("Error reading configs: missing user/room", i);
            process.exit();
        }
        closed_alpha[i] = { "email": CA_EMAIL[i], "room": CA_ROOMS[i] };
    }
    console.log("Closed alpha users:");
    for (let i = 0; i < closed_alpha.length; i++) {
        console.log(closed_alpha[i]);
    }
    // then initialize all 1000 rooms
    console.log("Booting up rooms...");
    for (let i = 0; i < 1000; i++) {
        rooms[i] = new room_1.Room(i);
    }
    console.log("Rooms are ready");
}
init();
// only valid for closed alpha users
function FindRoomNumber(email) {
    // closed alpha validation
    for (let i = 0; i < closed_alpha.length; i++) {
        if (closed_alpha[i].email == email) {
            let room = closed_alpha[i].room;
            console.log("Found user x with room y:");
            console.log(email);
            console.log(room);
            return room;
        }
    }
    return "";
}
exports.FindRoomNumber = FindRoomNumber;
function GetTokens(roomNum) {
    let roomNumber = 0;
    roomNumber = Number(roomNum);
    return [rooms[roomNumber].token, rooms[roomNumber].refreshToken];
}
exports.GetTokens = GetTokens;
function GetTokenExp(roomNum) {
    let roomNumber = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].tokenExpiresAt;
}
exports.GetTokenExp = GetTokenExp;
// set token expiry to one hour minus 3 minutes for a cushion
function SetTokens(roomNum, token, refreshToken) {
    let roomNumber = Number(roomNum);
    rooms[roomNumber].token = token;
    rooms[roomNumber].refreshToken = refreshToken;
    rooms[roomNumber].tokenExpiresAt = Date.now() + (60 * (60 - 3) * 1000);
}
exports.SetTokens = SetTokens;
