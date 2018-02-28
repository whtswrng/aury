import {INotifier} from "./notifier.interface";
import {IHttpRequester} from "../requesters/http-requester.interface";
import {IInput} from "../input-output/input.interface";

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';

export class SlackNotifier implements INotifier {

    private pullRequestAuthor: string;

    constructor(private token: string, private input: IInput, private requester: IHttpRequester) {

    }

    public async notifyAuthorAboutApprovedPullRequest(branch: string): Promise<void> {
        const message = `Pull request on ${branch} was approved.`;
        await this.notifySuccess(this.pullRequestAuthor, message);
    }

    public async notifyAuthorAboutStartingReview(branch): Promise<void> {
        await this.notifyInfo(
            this.pullRequestAuthor,
            `Just letting you know that someone is working on your pull request on branch ${branch}.`
        );
    }

    public async notifyAuthorAboutDeniedPullRequest(branch: string, message: string): Promise<void> {
        const additionalMessage = await this.input.askUser(
            "(Slack) Send message about denial to the author? (yes = enter, no = CTRL+C). Additional message to the author:"
        );
        await this.notifyError(
            this.pullRequestAuthor, `${message}. ${additionalMessage}`
        );
    }

    public async askOnPullRequestAuthor(): Promise<void> {
        this.pullRequestAuthor = await this.input.askUser(
            'Type slack user name of the author of pull request: '
        );
    }

    private notifySuccess(user, message: string): Promise<void> {
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

    private notifyError(user, message: string): Promise<void> {
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

    private notifyInfo(user, message: string): Promise<void> {
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