import {INotifier} from "./notifier.interface";
import {IHttpRequester} from "../requesters/http-requester.interface";

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';

export class SlackNotifier implements INotifier {

    constructor(private token: string, private requester: IHttpRequester) {

    }

    public notifySuccess(user, message: string): Promise<void> {
        const payload = {
            token: this.token,
            channel: `@${user}`,
            text: `:white_check_mark: ${message}`
        };

        try {
            return this.requester.post(SLACK_POST_MESSAGE_URL, payload);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    public notifyError(user, message: string): Promise<void> {
        const payload = {
            token: this.token,
            channel: `@${user}`,
            text: `:red_circle: ${message}. I am sure there are more information about the state of pull request` +
                `on github or the reviewer will contact you. :c`
        };

        try {
            return this.requester.post(SLACK_POST_MESSAGE_URL, payload);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    public notifyInfo(user, message: string): Promise<void> {
        const payload = {
            token: this.token,
            channel: `@${user}`,
            text: `:information_source: ${message}`
        };

        try {
            return this.requester.post(SLACK_POST_MESSAGE_URL, payload);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}