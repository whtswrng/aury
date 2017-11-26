const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;

class EnoughInformationInPullRequest extends BaseRule {

    async execute() {
        try {
            const answer = await askUser('Has branch tests and are they properly testing the problem?');

            if(this._stripString(answer) === 'yes') {
                return printer.ok('ᶘ   5) Branch has tests and they are properly testing the problem.');
            } else if(this._stripString(answer) === 'no') {
                this._rejectPullRequest();
            } else {
                return this.execute();
            }
        } catch (e) {
            printer.error(`✘    5) Branch does not have tests or they are not properly testing the problem.`);
            throw e;
        }
    }

    _rejectPullRequest() {
        throw new Error('5) Branch does not have tests or they are not properly testing the problem.');
    }

    _stripString(string) {
        return string.replace(/\s/g, '');
    }

}

module.exports = EnoughInformationInPullRequest;