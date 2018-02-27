import {Git} from "./services/version-control-system/git";
import {BranchUpToDateWithBaseBranch} from "./rules/branch-up-to-date-with-base-branch";
import {BranchMeetsAllPrerequisites} from "./rules/branch-meets-all-prerequisites";
import {IConfig} from "./config.interface";
import {IApplicationExecutor} from "./application-executor.interface";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {INotifier} from "./services/notifiers/notifier.interface";
import {Question} from "./rules/question";

export class ApplicationExecutor implements IApplicationExecutor {

    private pullRequestAuthor?: string;

    constructor(private input: IInput, private output: IOutput, private git: Git,
                private config: IConfig, private notifier?: INotifier) {

    }

    public async start() {
        this.assertProcessArguments();
        const currentCommitHash = await this.git.getCurrentCommitHash();
        await this.notifyUserIfGitStatusIsNotClean();
        await this.startProcessing(currentCommitHash);
    }

    private async startProcessing(currentCommitHash: string) {
        try {
            await this.processSlackMessage();
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);
            await this.approvePullRequest();
        } catch (e) {
            await this.denyPullRequest(currentCommitHash, e);
        }
    }

    private assertProcessArguments() {
        if(typeof process.argv[2] !== 'string' || typeof process.argv[3] !== 'string') {
            throw new Error('Missing branches arguments.');
        }
    }

    private async notifyUserIfGitStatusIsNotClean() {
        try {
            await this.checkIfGitStatusIsClean();
        } catch (e) {
            this.output.info('Git status is not clean! Aury could be in trouble because of that!');
        }
    }

    private async processSlackMessage() {
        if (this.config.tokens && this.config.tokens.slack) {
            this.pullRequestAuthor = await this.input.askUser(
                'Type slack user name of the author of pull request: '
            );
            const sendMessageAboutStartingReview = await this.input.askUser(
                'Send message about starting review? (yes/no) '
            );
            if (sendMessageAboutStartingReview === 'yes') {
                await this.notifyAuthorAboutStartingReview();
            }
        }
    }

    private getBranch(): string {
        return process.argv[2];
    }

    private getBaseBranch(): string {
        return process.argv[3];
    }

    private async notifyAuthorAboutStartingReview() {
        await this.notifier.notifyInfo(
            this.pullRequestAuthor,
            `Just letting you know that someone is working on your pull request on branch ${this.getBranch()}.`
        );
    }

    private async checkIfGitStatusIsClean() {
        if (!await this.git.isGitStatusClean()) {
            throw new GitStatusIsNotClean('Git status is not clean!');
        }
    }

    private async checkAllRules() {
        await this.assertBranchIsMergeableWithBaseBranch();
        await this.assertBranchMeetsAllPrerequisites();
        await this.assertBranchMeetsAllQuestions();
    }

    private async assertBranchIsMergeableWithBaseBranch() {
        const branchUpToDateWithMaster = new BranchUpToDateWithBaseBranch(
            this.getBranch(), this.getBaseBranch(), this.output, this.input, this.git
        );
        await branchUpToDateWithMaster.execute();
    }

    private async assertBranchMeetsAllPrerequisites() {
        const allPrerequisites = new BranchMeetsAllPrerequisites(
            this.output, this.config.prerequisites, this.input, new ChildProcessExecutor()
        );
        await allPrerequisites.execute();
    }

    private async assertBranchMeetsAllQuestions() {
        const questions = this.config.questions || [];
        for(let i = 0; i < questions.length; i++) {
            const askAndAnswer = new Question(
                this.input, this.buildQuestion(i, questions.length + 2)
            );
            await askAndAnswer.ask();
            this.output.ok(`Answer on "${questions[i]}" was yes`);
        }
    }

    private buildQuestion(questionIndex: number, max: number): string {
        return `${questionIndex + 3}/${max}) ${this.config.questions[questionIndex]} (yes/no/skip)`;
    }

    private async denyPullRequest(currentCommitHash: string, e) {
        const errorMessage = `Pull request on branch ${this.getBranch()} was denied, because of: "${e.message}"`;
        await this.restoreGitToPreviousState(currentCommitHash);
        this.output.error(errorMessage);

        if(this.notifier) {
            await this.notifyReviewerAboutDeniedPullRequest(errorMessage);
        }
    }

    private async restoreGitToPreviousState(commit) {
        try {
            await this.git.abortMerge();
            await this.git.checkoutTo(commit);
        } catch (e) {
            // let git handle this problem
        }
    }

    private async approvePullRequest() {
        const message = `Pull request on ${this.getBranch()} was approved. Congratulations c:`;
        this.output.ok(`\n${message}`);

        if(this.notifier) {
            await this.notifier.notifySuccess(this.pullRequestAuthor, message);
        }
    }

    private async notifyReviewerAboutDeniedPullRequest(message) {
        const additionalMessage = await this.input.askUser(
            "(Slack) Send message to the author? Add additional message for the author (or exit CTRL-C)"
        );
        return await this.notifier.notifyError(
            this.pullRequestAuthor, `${message} Additional message: ${additionalMessage}`
        );
    }

}


class GitStatusIsNotClean extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        Object.setPrototypeOf(this, GitStatusIsNotClean.prototype);
    }
}

