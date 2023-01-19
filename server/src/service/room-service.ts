
// room service LOL

import { Room } from "../model/room";

const rooms: Room[] = [];

import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });

const CA_0_EMAIL: string = process.env.CA_0_EMAIL || "";
const CA_0_ROOM: string = process.env.CA_0_ROOM || "";

interface ClosedAlphaUser {
    email: string,
    room: string
}

const closed_alpha: ClosedAlphaUser[] = [];

function init() {

    // get closed alpha users info
    if(CA_0_EMAIL == "" || CA_0_ROOM == "") {
        console.log("Error reading configs:");
        process.exit();
    }

    closed_alpha[0] = { "email": CA_0_EMAIL, "room": CA_0_ROOM };

    console.log("Closed alpha config contents:");
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
