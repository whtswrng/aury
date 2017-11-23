const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;
const exec = require('../services/command-executor').exec;

class BranchUpToDateWithMaster extends BaseRule {

    async execute() {
        const branch = await this._getBranchFromUser();

        try {
            await this.checkoutToBranch(branch);
            await this.mergeBranchToMaster(branch);

            printer.ok('ᶘ   1) Branch has sucessfuly merged with master.');
        } catch (e) {
            printer.error(`✘    1) Branch cannot be merged with master.`)
            throw e;
        }
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