"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateRandomAlphanumericString = void 0;
// does what it says on the can
function GenerateRandomAlphanumericString(length) {
    let result = "";
    const possible_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789";
    const pc_len = possible_chars.length;
    for (let i = 0; i < length; i++) {
        result += possible_chars.charAt(Math.floor(Math.random() * pc_len));
    }
    return result;
}
exports.GenerateRandomAlphanumericString = GenerateRandomAlphanumericString;
