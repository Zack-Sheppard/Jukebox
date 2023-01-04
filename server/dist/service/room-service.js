"use strict";
// room service LOL
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetTokenExp = exports.GetTokenExp = exports.GetToken = exports.FindRoomNumber = void 0;
const room_1 = require("../model/room");
const rooms = [];
const path_1 = __importDefault(require("path"));
// closed alpha
const promises_1 = require("fs/promises");
let closed_alpha;
async function init() {
    let ca_file;
    console.log("Reading closed alpha config file...");
    try {
        ca_file = JSON.parse(await (0, promises_1.readFile)(path_1.default.join(__dirname, "../../config/closed-alpha.json"), "utf8"));
    }
    catch (e) {
        console.log("Error reading configs:");
        console.log(e);
        process.exit();
    }
    console.log("Closed alpha config contents:");
    closed_alpha = ca_file.authorized_users;
    console.log(closed_alpha.length);
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
function GetToken(roomNum) {
    let roomNumber = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].token;
}
exports.GetToken = GetToken;
function GetTokenExp(roomNum) {
    let roomNumber = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].tokenExpiresAt;
}
exports.GetTokenExp = GetTokenExp;
// set token expiry to one hour minus 5 minutes for a cushion
function SetTokenExp(roomNum, token) {
    let roomNumber = Number(roomNum);
    rooms[roomNumber].token = token;
    rooms[roomNumber].tokenExpiresAt = Date.now() + (60 * (60 - 5) * 1000);
}
exports.SetTokenExp = SetTokenExp;
