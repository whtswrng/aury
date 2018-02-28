import {Git} from "./services/version-control-system/git";
import {BranchUpToDateWithBaseBranch} from "./rules/branch-up-to-date-with-base-branch";
import {BranchMeetsAllPrerequisites} from "./rules/branch-meets-all-prerequisites";
import {IConfig} from "./config.interface";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {INotifier} from "./services/notifiers/notifier.interface";
import {Question} from "./rules/question";
import {StatusStorage} from "./services/storage/status-storage";
import {ReviewStorage} from "./services/storage/review-storage";

const MAX_STEPS_WITHOUT_QUESTIONS = 3;

export class Application {

    constructor(private input: IInput, private output: IOutput, private git: Git, private config: IConfig,
                private statusStorage: StatusStorage, private reviewStorage: ReviewStorage, private notifier: INotifier) {

    }

    public async start() {
        const currentCommitHash = await this.git.getCurrentCommitHash();
        await this.notifyUserIfGitStatusIsNotClean();

        if(process.argv[4] === '--pre') {
            await this.checkPrerequisites();
        } else {
            await this.startProcessing(currentCommitHash);
        }
    }

    private async checkPrerequisites() {
        try {
            await this.assertBranchMeetsAllPrerequisites();
        } catch (e) {}
    }

    private async startProcessing(currentCommitHash: string) {
        try {
            await this.notifyAuthorAboutCodeReview();
            await this.statusStorage.addCodeReviewToInProgress(this.getBranch(), this.getBaseBranch());
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);
            await this.approvePullRequest();
            await this.statusStorage.removeCodeReviewFromInProgress(this.getBranch(), this.getBaseBranch());
            await this.reviewStorage.addFinishedReview(this.getBranch(), this.getBaseBranch());
        } catch (e) {
            await this.denyPullRequest(currentCommitHash, e);
        }
    }

    private async notifyUserIfGitStatusIsNotClean() {
        try {
            await this.checkIfGitStatusIsClean();
        } catch (e) {
            this.output.warning('Git status is not clean! Aury could be in trouble because of that!');
        }
    }

    private async notifyAuthorAboutCodeReview() {
        await this.notifier.askOnPullRequestAuthor();

        if (!await this.statusStorage.isCodeReviewInProgress(this.getBranch(), this.getBaseBranch())) {
            await this.notifier.notifyAuthorAboutStartingReview(this.getBranch());
        }
    }

    private getBranch(): string {
        return process.argv[2];
    }

    private getBaseBranch(): string {
        return process.argv[3];
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
            this.getBranch(), this.getBaseBranch(), this.output, this.input, this.git, this.getStepsCount()
        );
        await branchUpToDateWithMaster.execute();
    }

    private getStepsCount(): number {
        if(this.config && this.config.questions) {
            return this.config.questions.length;
        }

        return MAX_STEPS_WITHOUT_QUESTIONS;
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
            await this.assertBranchMeetsQuestion(i, questions);
        }
    }

    private async assertBranchMeetsQuestion(i: number, questions: Array<string>) {
        const askAndAnswer = new Question(
            this.input, this.buildQuestionSentence(i, questions.length + 2)
        );
        await askAndAnswer.ask();
        this.output.ok(`Answer on "${questions[i]}" was yes`);
    }

    private buildQuestionSentence(questionIndex: number, max: number): string {
        return `${questionIndex + 3}/${max}) ${this.config.questions[questionIndex]} (yes/no/skip)`;
    }

    private async denyPullRequest(currentCommitHash: string, e) {
        const errorMessage = `Pull request on branch ${this.getBranch()} was denied, because of: "${e.message}"`;
        await this.restoreGitToPreviousState(currentCommitHash);
        this.output.error(errorMessage);
        await this.notifier.notifyAuthorAboutDeniedPullRequest(this.getBranch(), errorMessage);
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
        const message = `Pull request on ${this.getBranch()} was approved.`;
        this.output.ok(`\n${message}`);
        await this.notifier.notifyAuthorAboutApprovedPullRequest(this.getBranch());
    }

}


class GitStatusIsNotClean extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        Object.setPrototypeOf(this, GitStatusIsNotClean.prototype);
    }
}

