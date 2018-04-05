import {INotifier} from "./notifier.interface";
import {IInput} from "../input-output/input.interface";
import {HttpClient} from "../clients/simple-http-client.interface";

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';

export class SlackNotifier implements INotifier {

    private pullRequestAuthor: string;
    private branch: string;

    constructor(private token: string, private input: IInput, private httpClient: HttpClient) {

    }

    public async notifyAuthorAboutReviewedPullRequest(): Promise<void> {
        await this.notifyInfo(
            this.pullRequestAuthor,
            `Someone finished review of your pull request on branch ${this.branch}.`
        );
    }

    public setBranch(branch: string): void {
        this.branch = branch;
    }

    public async notifyAuthorAboutApprovedPullRequest(): Promise<void> {
        const message = `Pull request on ${this.branch} was approved.`;
        await this.notifySuccess(this.pullRequestAuthor, message);
    }

    public async notifyAuthorAboutStartingReview(): Promise<void> {
        await this.notifyInfo(
            this.pullRequestAuthor,
            `Just letting you know that someone is working on your pull request on branch ${this.branch}.`
        );
    }

    public async notifyAuthorAboutDeniedPullRequest(message: string): Promise<void> {
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
            return this.httpClient.post(SLACK_POST_MESSAGE_URL, payload);
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
            return this.httpClient.post(SLACK_POST_MESSAGE_URL, payload);
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
            return this.httpClient.post(SLACK_POST_MESSAGE_URL, payload);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}