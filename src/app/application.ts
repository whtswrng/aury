import {Git} from "./services/version-control-system/git";
import {IConfig} from "./config.interface";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {INotifier} from "./services/notifiers/notifier.interface";
import {StatusStorage} from "./services/storage/status-storage";
import {ReviewStorage} from "./services/storage/review-storage";
import {ListQuestion} from "./services/question-parser/inquirer-question-parser";
import {QuestionParser} from "./services/question-parser/question-parser";
import {BranchUpToDateWithBaseBranch} from "./core/branch-up-to-date-with-base-branch";
import {BranchMeetsAllPrerequisites} from "./core/branch-meets-all-prerequisites";
import {FinalActionHook} from "./core/final-stage-hook";

export class Application {

    constructor(private input: IInput, private output: IOutput, private git: Git, private config: IConfig,
                private statusStorage: StatusStorage, private reviewStorage: ReviewStorage, private notifier: INotifier,
                private questionParser: QuestionParser, private finalStage: FinalActionHook) {
    }

    public async start() {
        this.notifier.setBranch(this.getBranch());
        const currentCommitHash = await this.git.getCurrentCommitHash();
        await this.notifyUserIfGitStatusIsNotClean();
        this.handleForceQuit(currentCommitHash);

        await this.startProcessing(currentCommitHash);
    }

    public async checkPrerequisites() {
        try {
            await this.assertBranchMeetsAllPrerequisites();
        } catch (e) {
        }
    }

    public async checkQuestions() {
        try {
            await this.assertBranchMeetsAllQuestions();
        } catch (e) {
        }
    }

    private handleForceQuit(currentCommitHash: string) {
        process.on('SIGINT', async () => {
            console.log('siginint')
            await this.forceQuit(currentCommitHash);
        });
    }

    private async forceQuit(currentCommitHash: string) {
        await this.restoreGitToPreviousState(currentCommitHash);
        this.output.log('\n');
        process.exit();
    }

    private async startProcessing(currentCommitHash: string) {
        try {
            await this.notifyAuthorAboutCodeReview();
            await this.statusStorage.addCodeReviewToInProgress(this.getBranch(), this.getBaseBranch(), this.getDescription());
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);
            await this.finishReview();
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
            await this.notifyAuthorAboutStartingReview();
        }
    }

    private async notifyAuthorAboutStartingReview(): Promise<void> {
        try {
            await this.notifier.notifyAuthorAboutStartingReview();
        } catch (e) {
            this.output.error('User not found, please try again.');
            await this.notifyAuthorAboutCodeReview();
        }
    }

    private getBranch(): string {
        return process.argv[2];
    }

    private getBaseBranch(): string {
        return this.config.baseBranch;
    }

    private getDescription(): string {
        return process.argv[3] || 'no description';
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

    private getQuestions(): Array<string> | ListQuestion {
        if (this.config && this.config.questions) {
            return this.config.questions;
        }

        return [];
    }

    private getPrerequisites(): Array<string> {
        if (this.config && this.config.prerequisites) {
            return this.config.prerequisites;
        }

        return [];
    }

    private async assertBranchMeetsAllPrerequisites() {
        const allPrerequisites = new BranchMeetsAllPrerequisites(
            this.output, this.getPrerequisites(), this.input, new ChildProcessExecutor()
        );
        await allPrerequisites.execute();
    }

    private async assertBranchMeetsAllQuestions() {
        const questions = this.getQuestions();
        await this.questionParser.process(questions);
    }

    private async denyPullRequest(currentCommitHash: string, e) {
        await this.finishReview();
        await this.restoreGitToPreviousState(currentCommitHash);
    }

    private async restoreGitToPreviousState(commit) {
        try {
            await this.git.abortMerge();
            await this.git.checkoutTo(commit);
        } catch (e) {
            await this.git.checkoutTo(commit);
        }
    }

    private async finishReview() {
        await this.finalStage.finish();
    }

}


class GitStatusIsNotClean extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        Object.setPrototypeOf(this, GitStatusIsNotClean.prototype);
    }
}

