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
import {SlackNotifier} from "./services/notifiers/slack-notifier";
import {HttpRequester} from "./services/requesters/http-requester";
import {INotifier} from "./services/notifiers/notifier.interface";

export class ApplicationExecutor implements IApplicationExecutor{

    private pullRequestAuthor?: string;

    constructor(private input: IInput, private output: IOutput, private git: Git,
                private config: IConfig, private notifier?: INotifier) {

    }

    public async start() {
        const currentCommitHash = await this.git.getCurrentCommitHash();

        if(this.config.tokens.slack) {
            this.pullRequestAuthor = await this.input.askUser(
                'Type slack user name of the author of pull request: '
            );
        }

        try {
            await this.checkIfGitStatusIsClean();
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);
            await this.approvePullRequest();
        } catch (e) {
            await this.denyPullRequest(currentCommitHash, e);
        }
    }


    private async denyPullRequest(currentCommitHash: string, e) {
        const errorMessage = `Pull request was denied, because of: "${e.message}"`;
        await this.restoreGitToPreviousState(currentCommitHash);
        await this.notifyReviewerAboutDeniedPullRequest(errorMessage);
        this.output.error(errorMessage);
        console.log(e);
    }

    private async checkIfGitStatusIsClean() {
        if( ! await this.git.isGitStatusClean()) {
            throw new Error('Git status is not clean!');
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
        const branchUpToDateWithMaster = new BranchUpToDateWithMaster(this.output, this.input, this.git);
        return branchUpToDateWithMaster.execute();
    }

    private async checkIfPullRequestHasEnoughInformation() {
        const enoughInformation = new EnoughInformationInPullRequest(this.output, this.input);
        return enoughInformation.execute();
    }

    private async checkIfBranchMeetsAllPrerequisites() {
        const allPrerequisites = new BranchMeetsAllPrerequisites(
            this.output, this.config.prerequisites, new ChildProcessExecutor()
        );
        return allPrerequisites.execute();
    }

    private async checkIfBranchHasRequiredFunctionality() {
        const enoughInformation = new BranchHasRequiredFunctionality(this.output, this.input);
        return enoughInformation.execute();
    }

    private async checkIfBranchHasTests() {
        const enoughInformation = new BranchHasTests(this.output, this.input);
        return enoughInformation.execute();
    }

    private async checkIfBranchHasCleanDesignAndCode() {
        const enoughInformation = new BranchHasCleanDesignAndCode(this.output, this.input);
        return enoughInformation.execute();
    }

    private async restoreGitToPreviousState(commit) {
        try {
            await this.git.abortMerge();
            await this.git.checkoutTo(commit);
        } catch(e) {
            // let git handle this problem
        }
    }

    private approvePullRequest() {
        this.output.ok(`\nPull request was approved. Congratulations c:`);
    }

    private async notifyReviewerAboutDeniedPullRequest(message) {
        if(this.notifier) {
            return await this.notifier.notify(this.pullRequestAuthor, message);
        }
    }

}