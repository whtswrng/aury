import {IInput} from "../services/input-output/input.interface";
import {INotifier} from "../services/notifiers/notifier.interface";
import {IOutput} from "../services/input-output/output.interface";

export const ACTIONS = {
    PULL_REQUEST_APPROVED: 0,
    PULL_REQUEST_REVIEWED: 1
};

export interface FinalActionHook {
    finish(): Promise<void>;
}

export class FinalStageHook implements FinalActionHook {

    private actionHandlerMap = {
        [ACTIONS.PULL_REQUEST_APPROVED]: this.handlePullRequestApproved.bind(this),
        [ACTIONS.PULL_REQUEST_REVIEWED]: this.handlePullRequestReviewed.bind(this),
    };

    constructor(private input: IInput, private ouput: IOutput, private notifier: INotifier) {

    }

    public async finish(): Promise<void> {
        this.ouput.separate();
        const answerIndex = await this.input.askUserForAction([
            'Send "Pull request approved"',
            'Send "Pull request reviewed with comments"',
            new ActionSeparator(),
            'Exit'
        ]);

        if(this.hasAnswerHandleMethod(answerIndex)) {
            await this.callHandleMethod(answerIndex);
        }
    }

    private async callHandleMethod(answerIndex: number): Promise<void> {
        await this.actionHandlerMap[answerIndex]();
    }

    private hasAnswerHandleMethod(answerIndex: number): boolean {
        return !!this.actionHandlerMap[answerIndex];
    }

    private async handlePullRequestApproved(): Promise<void> {
        await this.notifier.notifyAuthorAboutApprovedPullRequest();
    }

    private async handlePullRequestReviewed(): Promise<void> {
        await this.notifier.notifyAuthorAboutReviewedPullRequest();
    }
}

export class ActionSeparator {

}
