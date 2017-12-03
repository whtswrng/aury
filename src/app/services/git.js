const exec = require('./command-executor').exec;

class Git {

    async isGitStatusClean() {
        try {
            const output = await exec(`git status --porcelain`);

            if(output.length === 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            throw new Error(`Something went wrong while getting a commit hash.`);
        }
    }

    async getCurrentCommitHash() {
        try {
            return await exec(`git rev-parse HEAD`);
        } catch (e) {
            console.log(e);
            throw new Error(`Something went wrong while getting a commit hash.`);
        }
    }

    async checkoutTo(commitOrBranch) {
        try {
            await exec(`git checkout ${commitOrBranch}`);
        } catch (e) {
            throw new Error(`Commit or branch "${commitOrBranch}" does not exists`);
        }
    }

    async abortMerge() {
        try {
            await exec(`git merge --abort`);
        } catch (e) {
            throw new Error(`Merge cannot be aborted.`);
        }
    }

    async mergeFastForward(to, from) {
        try {
            await exec(`git merge origin/${to} origin/${from} --no-commit`);
        } catch (e) {
            console.log(e);
            throw new Error(`branch "${from}" cannot be merged with "${to}".`);
        }
    }

    async pull() {
        try {
            await exec(`git pull`);
        } catch (e) {
            throw new Error(e);
        }
    }

    async fetch() {
        try {
            await exec(`git fetch`);
        } catch (e) {
            throw new Error(e);
        }
    }

}

module.exports = new Git();