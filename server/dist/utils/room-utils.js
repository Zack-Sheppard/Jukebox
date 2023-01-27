"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidRoomNumber = void 0;
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
