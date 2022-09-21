"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Post = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
async function Get(url, headers, params) {
    try {
        const response = await axios_1.default.get(url, {
            headers: headers,
            params: params
        });
        return response;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.log("GET: got an axios error");
        }
        else {
            console.log("GET: got an unexpected error");
        }
        return null;
    }
}
exports.Get = Get;
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
            console.log("POST: got an axios error");
        }
        else {
            console.log("POST: got an unexpected error");
        }
        return null;
    }
}
exports.Post = Post;
