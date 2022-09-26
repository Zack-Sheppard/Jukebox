"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Get = void 0;
// external (node modules)
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
// internal
const http_request_utils_1 = require("../utils/http-request-utils");
// HTTP GET request
async function Get(url, headers, params) {
    if (!(0, http_request_utils_1.isValidHttpUrl)(url)) {
        console.log("error: invalid URL for GET");
        return null;
    }
    const request_config = {
        headers: headers,
        params: params
    };
    try {
        const response = await axios_1.default.get(url, request_config);
        return response;
    }
    catch (error) {
        console.log("request-service: GET error");
        return handleError(error);
    }
}
exports.Get = Get;
// HTTP POST request
async function Post(url, body, headers, params) {
    if (!(0, http_request_utils_1.isValidHttpUrl)(url)) {
        console.log("error: invalid URL for POST");
        return null;
    }
    if (body) {
        body = qs_1.default.stringify(body);
    }
    else if (!params) { // POST contains no body or parameters
        console.log("error: trying to POST without sending data");
        return null;
    }
    const request_config = {
        headers: headers,
        params: params
    };
    try {
        const response = await axios_1.default.post(url, body, request_config);
        return response;
    }
    catch (error) {
        console.log("request-service: POST error");
        return handleError(error);
    }
}
exports.Post = Post;
// https://axios-http.com/docs/handling_errors
function handleError(error) {
    if (axios_1.default.isAxiosError(error)) {
        console.log("request-service: axios error occured:");
        return handleAxiosError(error);
    }
    else {
        console.log("request-service: unexpected error occured:");
        return handleUnexpectedError(error);
    }
}
// 4XX
function handleAxiosError(error) {
    console.log(error.code);
    console.log(error.message);
    console.log(error.response?.status);
    console.log(error.response?.statusText);
    return error;
}
// 5XX
function handleUnexpectedError(error) {
    console.log(error);
    return null;
}
