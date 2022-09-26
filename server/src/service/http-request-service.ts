
// external (node modules)
import axios from "axios";
import { AxiosError, AxiosRequestConfig,
         AxiosRequestHeaders, AxiosResponse } from "axios";

import qs from "qs";

// internal
import { isValidHttpUrl } from "../utils/http-request-utils";

// HTTP GET request
async function Get(url: string,
                   headers?: AxiosRequestHeaders,
                   params?: any) {

    if(!isValidHttpUrl(url)) {
        console.log("error: invalid URL for GET");
        return null;
    }
    const request_config: AxiosRequestConfig = {
        headers: headers,
        params: params
    }
    try {
        const response: AxiosResponse = await axios.get(url, request_config);
        return response;
    }
    catch(error) {
        console.log("request-service: GET error");
        return handleError(error);
    }
}

// HTTP POST request
async function Post(url: string, 
                    body: any,
                    headers?: AxiosRequestHeaders,
                    params?: any) {

    if(!isValidHttpUrl(url)) {
        console.log("error: invalid URL for POST");
        return null;
    }
    if(body) {
        body = qs.stringify(body);
    }
    else if(!params) { // POST contains no body or parameters
        console.log("error: trying to POST without sending data");
        return null;
    }
    const request_config: AxiosRequestConfig = {
        headers: headers,
        params: params
    }
    try {
        const response: AxiosResponse = await axios.post(url, body, request_config);
        return response;
    }
    catch(error) {
        console.log("request-service: POST error");
        return handleError(error);
    }
}

// https://axios-http.com/docs/handling_errors
function handleError(error: any) {
    if (axios.isAxiosError(error)) {
        console.log("request-service: axios error occured:");
        return handleAxiosError(error);
    }
    else {
        console.log("request-service: unexpected error occured:");
        return handleUnexpectedError(error);
    }
}

// 4XX
function handleAxiosError(error: AxiosError) {
    console.log(error.code);
    console.log(error.message);
    console.log(error.response?.status);
    console.log(error.response?.statusText);
    return error;
}

// 5XX
function handleUnexpectedError(error: unknown) {
    console.log(error);
    return null;
}

export { Get, Post };
