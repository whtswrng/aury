const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const exec = require('../services/command-executor').exec;

class AllPrerequisites extends BaseRule {

    constructor(prerequisites) {
        super();
        this.prerequisites = prerequisites;
    }

    async execute() {
        try {
            printer.info('Check if all prerequisites are passing...');
            await this._runPrerequisites(this.prerequisites);
            printer.ok('ᶘ   3) Branch successfully meets all prerequisites.');
        } catch (e) {
            printer.error(`✘    3) Some prerequisites is not passing.`);
            throw e;
        }
    }

    async _runPrerequisites(scripts) {
        const script = scripts.shift();

        try {
            printer.info(`          running script "${script}", ${scripts.length} are left.`);
            await this._runScript(script);
            printer.ok(`          script "${script}" successfully proceeded.`);

            if(scripts.length > 0) {
                return this._runPrerequisites(scripts)
            }
        } catch (e) {
            throw e;
        }
    }

    async _runScript(script) {
        try {
            await exec(`npm run ${script}`);
        } catch (e) {
            console.log(e);
            throw new Error(`script "${script}" has not started well.`);
        }
    }

}

module.exports = AllPrerequisites;