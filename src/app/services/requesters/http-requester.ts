import {IHttpRequester} from "./http-requester.interface";
import * as http from "request-promise-native";

export class HttpRequester implements IHttpRequester{

    public post(url, payload: object) {
        const options = {
            method: 'POST',
            uri: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: payload,
            json: true
        };

        return http.post(options);
    }

}