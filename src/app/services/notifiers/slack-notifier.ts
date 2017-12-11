import {INotifier} from "./notifier.interface";
import {IHttpRequester} from "../requesters/http-requester.interface";

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';

export class SlackNotifier implements INotifier {

    constructor(private token: string, private requester: IHttpRequester) {

    }

    public notify(user, message: string): Promise<void> {
        const payload = {
            token: this.token,
            channel: `@${user}`,
            text: message
        };

        try {
            return this.requester.post(SLACK_POST_MESSAGE_URL, payload);
        }catch (e) {
            console.log(e);
            throw e;
        }
    }
}