import {Git} from "./services/version-control-system/git";
import {BranchUpToDateWithMaster} from "./rules/branch-up-to-date-with-master";
import {EnoughInformationInPullRequest} from "./rules/enough-information-in-pull-request";
import {BranchMeetsAllPrerequisites} from "./rules/branch-meets-all-prerequisites";
import {CommandExecutor} from "./services/command-executor/command-executor";
import {BranchHasRequiredFunctionality} from "./rules/branch-has-required-functionality";
import {BranchHasTests} from "./rules/branch-has-tests";
import {BranchHasCleanDesignAndCode} from "./rules/branch-has-clean-design-and-code";
import {IOutputPrinter} from "./services/output-printer/output-printer.interface";
import {IUserInput} from "./services/input-device/input-user.interface";
import {IConfig} from "./config.interface";
import {IApplicationExecutor} from "./application-executor.interface";

export class ApplicationExecutor implements IApplicationExecutor{

    constructor(private input: IUserInput, private output: IOutputPrinter, private git: Git, private config: IConfig) {

    }

    public async start() {
        const currentCommitHash = await this.git.getCurrentCommitHash();

        try {
            await this.checkIfGitStatusIsClean();
            await this.checkAllRules();
            await this.restoreGitToPreviousState(currentCommitHash);

            this.output.ok(`\nPull request was approved. Congratulations c:`);
        } catch (e) {
            await this.restoreGitToPreviousState(currentCommitHash);
            this.output.error(`Pull request was denied, because of: "${e.message}"`);
            console.log(e);
        }
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
            this.output, this.config.prerequisites, new CommandExecutor()
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

}