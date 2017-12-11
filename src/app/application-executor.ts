import {Git} from "./services/version-control-system/git";
import {BranchUpToDateWithMaster} from "./rules/branch-up-to-date-with-master";
import {EnoughInformationInPullRequest} from "./rules/enough-information-in-pull-request";
import {BranchMeetsAllPrerequisites} from "./rules/branch-meets-all-prerequisites";
import {BranchHasRequiredFunctionality} from "./rules/branch-has-required-functionality";
import {BranchHasTests} from "./rules/branch-has-tests";
import {BranchHasCleanDesignAndCode} from "./rules/branch-has-clean-design-and-code";
import {IConfig} from "./config.interface";
import {IApplicationExecutor} from "./application-executor.interface";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {INotifier} from "./services/notifiers/notifier.interface";

export class ApplicationExecutor implements IApplicationExecutor {

    private pullRequestAuthor?: string;
    private pullRequestBranch: string;

    constructor(private input: IInput, private output: IOutput, private git: Git,
                private config: IConfig, private notifier?: INotifier) {

    }

    public async start() {
        const currentCommitHash = await this.git.getCurrentCommitHash();

        try {
            this.pullRequestBranch = await this.getBranchFromUser();

            if (this.config.tokens.slack) {
                this.pullRequestAuthor = await this.input.askUser(
                    'Type slack user name of the author of pull request: '
                );
                await this.notifyAuthorAboutStartingReview();
            }

            await this.checkIfGitStatusIsClean();
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);
            await this.approvePullRequest();
        } catch (e) {
            await this.denyPullRequest(currentCommitHash, e);
        }
    }

    private async getBranchFromUser() {
        const insertBranchNameString = 'Please insert branch name for code review: ';
        return this.input.askUser(insertBranchNameString);
    }

    private async notifyAuthorAboutStartingReview() {
        await this.notifier.notifyInfo(
            this.pullRequestAuthor,
            `Just letting you know that someone is working on your pull request on branch ${this.pullRequestBranch}.`
        );
    }

    private async checkIfGitStatusIsClean() {
        if (!await this.git.isGitStatusClean()) {
            throw new GitStatusIsNotClean('Git status is not clean!');
        }
    }

    private async checkAllRules() {
        await this.checkIfBranchIsUpToDateWithMaster();
        await this.checkIfPullRequestHasEnoughInformation();
        await this.checkIfBranchMeetsAllPrerequisites();
        await this.checkIfBranchHasRequiredFunctionality();
        await this.checkIfBranchHasTests();
        await this.checkIfBranchHasCleanDesignAndCode();
    }

    private async checkIfBranchIsUpToDateWithMaster() {
        const branchUpToDateWithMaster = new BranchUpToDateWithMaster(this.pullRequestBranch, this.output, this.input, this.git);
        await branchUpToDateWithMaster.execute();

        if(this.notifier) {
            this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 1/6 :ok: Branch can be merged with master.`);
        }
    }

    private async checkIfPullRequestHasEnoughInformation() {
        const enoughInformation = new EnoughInformationInPullRequest(this.output, this.input);
        await enoughInformation.execute();

        if(this.notifier) {
            this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 2/6 :ok: Pull request has enough information to understand the problem.`);
        }
    }

    private async checkIfBranchMeetsAllPrerequisites() {
        const allPrerequisites = new BranchMeetsAllPrerequisites(
            this.output, this.config.prerequisites, new ChildProcessExecutor()
        );
        await allPrerequisites.execute();

        if(this.notifier) {
            this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 3/6 :ok: All prerequisites has passed.`);
        }
    }

    private async checkIfBranchHasRequiredFunctionality() {
        const enoughInformation = new BranchHasRequiredFunctionality(this.output, this.input);
        await enoughInformation.execute();

        if(this.notifier) {
            this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 4/6 :ok: Branch has required functionality (problem was solved).`);
        }
    }

    private async checkIfBranchHasTests() {
        const enoughInformation = new BranchHasTests(this.output, this.input);
        await enoughInformation.execute();

        if(this.notifier) {
            this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 5/6 :ok: Branch has correct tests.`);
        }
    }

    private async checkIfBranchHasCleanDesignAndCode() {
        const enoughInformation = new BranchHasCleanDesignAndCode(this.output, this.input);
        await enoughInformation.execute();

        if(this.notifier) {
            await this.notifier.notifyInfo(
                this.pullRequestAuthor,
                `(${this.pullRequestBranch}) 6/6 :ok: Branch has clean design and code. Good job!`);
        }
    }

    private async denyPullRequest(currentCommitHash: string, e) {
        const errorMessage = `Pull request on branch ${this.pullRequestBranch} was denied, because of: "${e.message}"`;
        await this.restoreGitToPreviousState(currentCommitHash);
        this.output.error(errorMessage);
        console.log(e);

        if (e instanceof GitStatusIsNotClean) {
            // do nothing
        } else {
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
        const message = `Pull request on ${this.pullRequestBranch} was approved. Congratulations c:`;
        await this.notifier.notifySuccess(this.pullRequestAuthor, message);
        this.output.ok(`\n${message}`);
    }

    private async notifyReviewerAboutDeniedPullRequest(message) {
        if (this.notifier) {
            return await this.notifier.notifyError(this.pullRequestAuthor, message);
        }
    }

}


class GitStatusIsNotClean extends Error {
    constructor(errorMessage) {
        super(errorMessage);
        Object.setPrototypeOf(this, GitStatusIsNotClean.prototype);
    }
}

