import {HttpClient} from "./http-requester.interface";
import * as http from "request-promise-native";

export class SimpleHttpClient implements HttpClient{

    public post(url: string, payload: Object): Promise<any> {
        const options = {
            method: 'POST',
            uri: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: payload,
            json: true
        };

        return http.post(options) as any;
    }

}