"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(rn) {
        this.token = "";
        this.tokenExpiresAt = 0; // Unix timestamp
        this.num = rn;
        this.tokenExpiresAt = Date.now();
    }
}
exports.Room = Room;
