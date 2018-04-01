import {ICommandExecutor} from "../command-executor/command-executor.interface";

export class Git {

    constructor(private commandExecutor: ICommandExecutor) {

    }

    async isGitStatusClean() {
        try {
            const output = await this.commandExecutor.exec(`git status --porcelain`);

            return output.length === 0;
        } catch (e) {
            throw new Error(`Git status is not clean. ${e}`);
        }
    }

    async getCurrentCommitHash() {
        try {
            return await this.commandExecutor.exec(`git rev-parse HEAD`);
        } catch (e) {
            throw new Error(`Something went wrong while getting a commit hash. ${e}`);
        }
    }

    async checkoutTo(commitOrBranch) {
        try {
            await this.commandExecutor.exec(`git checkout ${commitOrBranch}`);
        } catch (e) {
            throw new Error(`Commit or branch "${commitOrBranch}" does not exists`);
        }
    }

    async abortMerge() {
        try {
            await this.commandExecutor.exec(`git merge --abort`);
        } catch (e) {
            throw new Error(`Merge cannot be aborted.`);
        }
    }

    async mergeFastForward(to, from) {
        try {
            await this.commandExecutor.exec(`git merge origin/${to} origin/${from} --no-commit`);
        } catch (e) {
            throw new Error(`branch "${from}" cannot be merged with "${to}".`);
        }
    }

    async hardResetWithOrigin(branch) {
        try {
            await this.commandExecutor.exec(`git reset --hard origin/${branch}`);
        } catch (e) {
            throw new Error(`branch "${branch}" cannot be reset --hard with origin.`);
        }
    }

    async pull() {
        try {
            await this.commandExecutor.exec(`git pull`);
        } catch (e) {
            throw new Error(e);
        }
    }

    async fetch() {
        try {
            await this.commandExecutor.exec(`git fetch`);
        } catch (e) {
            throw new Error(e);
        }
    }

}
