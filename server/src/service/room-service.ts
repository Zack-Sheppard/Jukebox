
// room service LOL

import { Room } from "../model/room";

const rooms: Room[] = [];

import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const CA_00: string = process.env.CA_00_EMAIL || "";
const CA_01: string = process.env.CA_01_EMAIL || "";
const CA_02: string = process.env.CA_02_EMAIL || "";
const CA_03: string = process.env.CA_03_EMAIL || "";
const CA_04: string = process.env.CA_04_EMAIL || "";
const CA_05: string = process.env.CA_05_EMAIL || "";
const CA_06: string = process.env.CA_06_EMAIL || "";
const CA_07: string = process.env.CA_07_EMAIL || "";
const CA_08: string = process.env.CA_08_EMAIL || "";
const CA_09: string = process.env.CA_09_EMAIL || "";
const CA_10: string = process.env.CA_10_EMAIL || "";
const CA_11: string = process.env.CA_11_EMAIL || "";
const CA_12: string = process.env.CA_12_EMAIL || "";
const CA_13: string = process.env.CA_13_EMAIL || "";

const CA_EMAIL: string[] = [CA_00, CA_01, CA_02, CA_03, CA_04, CA_05, CA_06,
                            CA_07, CA_08, CA_09, CA_10, CA_11, CA_12, CA_13];

const CA_ROOMS: string[] = ["999", "715", "210", "081", "414", "206", "545",
                            "041", "087", "707", "416", "302", "822", "069"];

interface ClosedAlphaUser {
    email: string,
    room: string
}

const closed_alpha: ClosedAlphaUser[] = [];

function init() {

    // get closed alpha users info
    for(let i = 0; i < CA_EMAIL.length; i++) {
        if(CA_EMAIL[i] == "" || !CA_ROOMS[i]) {
            console.log("Error reading configs: missing user/room", i);
            process.exit();
        }
        closed_alpha[i] = { "email": CA_EMAIL[i], "room": CA_ROOMS[i] };
    }

    console.log("Closed alpha users:");
    for(let i = 0; i < closed_alpha.length; i++) {
        console.log(closed_alpha[i]);
    }

    // then initialize all 1000 rooms
    console.log("Booting up rooms...");
    for(let i = 0; i < 1000; i++) {
        rooms[i] = new Room(i);
    }
    console.log("Rooms are ready");
}

init();

// only valid for closed alpha users
function FindRoomNumber(email: string): string {
    // closed alpha validation
    for(let i = 0; i < closed_alpha.length; i++) {
        if(closed_alpha[i].email == email) {
            let room: string = closed_alpha[i].room;
            console.log("Found user x with room y:");
            console.log(email);
            console.log(room);
            return room;
        }
    }
    return "";
}

function GetTokens(roomNum: string) {
    let roomNumber: number = 0;
    roomNumber = Number(roomNum);
    return [ rooms[roomNumber].token, rooms[roomNumber].refreshToken ];
}

function GetTokenExp(roomNum: string) {
    let roomNumber: number = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].tokenExpiresAt;
}

// set token expiry to one hour minus 3 minutes for a cushion
function SetTokens(roomNum: string, token: string, refreshToken: string) {
    let roomNumber: number = Number(roomNum);
    rooms[roomNumber].token = token;
    rooms[roomNumber].refreshToken = refreshToken;
    rooms[roomNumber].tokenExpiresAt = Date.now() + (60 * (60 - 3) * 1000);
}

export { FindRoomNumber, GetTokens, GetTokenExp, SetTokens };
