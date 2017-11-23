const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const stringPainter = require('../services/string-painter');
const askUser = require('../services/terminal-question').askUser;
const exec = require('../services/command-executor').exec;

class BranchUpToDateWithMaster extends BaseRule {

    async execute() {
        const branch = await this._getBranchFromUser();

        try {
            await this.checkoutToBranch(branch);
            await this.mergeBranchToMaster(branch);
        } catch (e) {
            printer.error(e.message);
        }
        console.log('BRANCH NAME IS', branch);
    }

    async _getBranchFromUser() {
        const insertBranchNameString = 'Please insert branch name: ';

        return askUser(insertBranchNameString);
    }

    async checkoutToBranch(branch) {
        try {
            await exec(`git checkout ${branch}`);
        } catch (e) {
            throw new Error(`branch "${branch}" does not exists`);
        }
    }

    async mergeBranchToMaster(branch) {
        try {
            await exec(`git merge master ${branch}`);
        } catch (e) {
            throw new Error(`branch "${branch}" cannot be merged with master.`);
        }
    }

}

module.exports = BranchUpToDateWithMaster;