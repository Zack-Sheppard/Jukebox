
import axios from "axios";
import qs from "qs";

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
            console.log("got an axios error");
        }
        else {
            console.log("got an unexpected error");
        }
        return null;
    }
}

export { Post };
