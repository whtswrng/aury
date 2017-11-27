const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;
const exec = require('../services/command-executor').exec;

class BranchUpToDateWithMaster extends BaseRule {

    async execute() {
        printer.info(`1/6 Can be branch properly fastforwarded with master (without conflicts)`);
        const branch = await this._getBranchFromUser();

        try {
            await this.fetch();
            await this.checkoutToBranch(branch);
            await this.mergeFastForward('master', branch);

            printer.ok('ᶘ   1) Branch has successfully fastforward merged with master.');
        } catch (e) {
            printer.error(`✘    1) Branch cannot be fastforward merged with master.`);
            throw e;
        }
    }

    async _getBranchFromUser() {
        const insertBranchNameString = 'Please insert branch name: ';
        return askUser(insertBranchNameString);
    }

    async checkoutToBranch(branch) {
        try {
            await exec(`git checkout origin/${branch}`);
        } catch (e) {
            throw new Error(`branch "${branch}" does not exists`);
        }
    }

    async mergeFastForward(to, from) {
        try {
            await exec(`git merge origin/${to} origin/${from} --ff-only`);
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

module.exports = BranchUpToDateWithMaster;