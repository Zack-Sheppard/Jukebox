"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidRoomNumber = exports.ConvertAlphanumToRoomNumber = void 0;
const RoomAlphabetMap = new Map([
    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"],
    ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"],
    ["A", "1"], ["B", "2"], ["C", "3"], ["D", "4"], ["E", "5"],
    ["F", "6"], ["G", "7"], ["H", "8"], ["I", "1"], ["J", "2"],
    ["K", "3"], ["L", "4"], ["M", "5"], ["N", "6"], ["O", "0"],
    ["P", "7"], ["Q", "8"], ["R", "1"], ["S", "2"], ["T", "3"],
    ["U", "4"], ["V", "5"], ["W", "6"], ["X", "7"], ["Y", "8"],
    ["Z", "9"]
]);
// input: alphanumeric string of length 3
function ConvertAlphanumToRoomNumber(s) {
    if (s.length !== 3) {
        console.log("warning: attempted to convert room_number != 3 chars");
        return "";
    }
    let room = "";
    s = s.toUpperCase();
    for (let i = 0; i < 3; i++) {
        let c = RoomAlphabetMap.get(s.charAt(i));
        if (c == undefined) {
            console.log("warning: could not convert room char using map");
            return "";
        }
        room += c;
    }
    return room;
}
exports.ConvertAlphanumToRoomNumber = ConvertAlphanumToRoomNumber;
// len == 3 and each char is between 0-9
function IsValidRoomNumber(roomNum) {
    if (/^[0-9]{3}$/.test(roomNum)) {
        return true;
    }
    else {
        return false;
    }
}
exports.IsValidRoomNumber = IsValidRoomNumber;
