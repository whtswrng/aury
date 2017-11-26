const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;

class EnoughInformationInPullRequest extends BaseRule {

    async execute() {
        try {
            const answer = await askUser('Has pull request enough information to understand the problem?');

            if(this._stripString(answer) === 'yes') {
                return printer.ok('ᶘ   2) Pull request has properly described the problem.');
            } else if(this._stripString(answer) === 'no') {
                this._rejectPullRequest();
            } else {
                return this.execute();
            }
        } catch (e) {
            printer.error(`✘    2) Pull request has not properly described the problem.`);
            throw e;
        }
    }

    _rejectPullRequest() {
        throw new Error('Pull request has not enough information for a reviewer to understand the problem.');
    }

    _stripString(string) {
        return string.replace(/\s/g, '');
    }

}

module.exports = EnoughInformationInPullRequest;