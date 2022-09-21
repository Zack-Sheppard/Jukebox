
import axios from "axios";
import qs from "qs";

async function Get(url: string, headers: any, params: any) {
    try {
        const response = await axios.get(url, { 
            headers: headers,
            params: params
        });
        return response;
    }
    catch(error) {
        if (axios.isAxiosError(error)) {
            console.log("GET: got an axios error");
        }
        else {
            console.log("GET: got an unexpected error");
        }
        return null;
    }
}

async function Post(url: string, headers: any, params: any, body: any) {
    if(body) {
        body = qs.stringify(body);
    }
    try {
        const response = await axios.post(url, body, {
            headers: headers,
            params: params
        });
        return response;
    }
    catch(error) {
        if (axios.isAxiosError(error)) {
            console.log("POST: got an axios error");
        }
        else {
            console.log("POST: got an unexpected error");
        }
        return null;
    }
}

export { Post, Get };
