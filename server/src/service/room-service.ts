
// room service LOL

import { Room } from "../model/room";

const rooms: Room[] = [];

import path from "path";

// closed alpha
import { readFile } from 'fs/promises';

interface ClosedAlphaUser {
    email: string,
    name: string,
    room: string
}

let closed_alpha: ClosedAlphaUser[];

async function init() {
    let ca_file;
    console.log("Reading closed alpha config file...");
    try {
        ca_file = JSON.parse(await readFile(
            path.join(__dirname, "../../config/closed-alpha.json"), "utf8"));
    }
    catch(e) {
        console.log("Error reading configs:");
        console.log(e);
        //process.exit();
        console.log("Bypassing closed alpha file");
        console.log("Booting up rooms...");
        for(let i = 0; i < 1000; i++) {
            rooms[i] = new Room(i);
        }
        console.log("Rooms are ready");
        return;
    }
    console.log("Closed alpha config contents:");
    closed_alpha = ca_file.authorized_users;
    console.log(closed_alpha.length);
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
function FindRoomNumber(email: string) {
    // closed alpha validation
    // for(let i = 0; i < closed_alpha.length; i++) {
    //     if(closed_alpha[i].email == email) {
    //         let room: string = closed_alpha[i].room;
    //         console.log("Found user x with room y:");
    //         console.log(email);
    //         console.log(room);
    //         return room;
    //     }
    // }
    return "999";
}

function GetToken(roomNum: string) {
    let roomNumber: number = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].token;
}

function GetTokenExp(roomNum: string) {
    let roomNumber: number = 0;
    roomNumber = Number(roomNum);
    return rooms[roomNumber].tokenExpiresAt;
}

// set token expiry to one hour minus 5 minutes for a cushion
function SetTokenExp(roomNum: string, token: string) {
    let roomNumber: number = Number(roomNum);
    rooms[roomNumber].token = token;
    rooms[roomNumber].tokenExpiresAt = Date.now() + (60 * (60 - 5) * 1000);
}

export { FindRoomNumber, GetToken, GetTokenExp, SetTokenExp };
