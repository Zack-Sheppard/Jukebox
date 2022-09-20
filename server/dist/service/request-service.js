"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
async function Post(url, headers, params, body) {
    if (body) {
        body = qs_1.default.stringify(body);
    }
    try {
        const response = await axios_1.default.post(url, body, {
            headers: headers,
            params: params
        });
        return response;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("got an axios error");
        }
        else {
            console.log("got an unexpected error");
        }
        return null;
    }
}
exports.Post = Post;
