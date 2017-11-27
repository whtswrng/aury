const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;

class BranchHasRequiredFunctionality extends BaseRule {

    async execute() {
        try {
            const answer = await askUser('4/6 Has branch required functionality (Does the code solved the problem)? (yes/no)');

            if(this._stripString(answer) === 'yes') {
                return printer.ok('ᶘ   4) Branch has required functionality.');
            } else if(this._stripString(answer) === 'no') {
                this._rejectPullRequest();
            } else {
                return this.execute();
            }
        } catch (e) {
            printer.error(`✘    4) Branch has not required functionality.`);
            throw e;
        }
    }

    _rejectPullRequest() {
        throw new Error('4) Branch has not required functionality.');
    }

    _stripString(string) {
        return string.replace(/\s/g, '');
    }

}

module.exports = BranchHasRequiredFunctionality;