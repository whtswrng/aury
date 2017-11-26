const BaseRule = require('./base-rule');
const printer = require('../services/output-printer');
const askUser = require('../services/terminal').askUser;

class EnoughInformationInPullRequest extends BaseRule {

    async execute() {
        try {
            const answer = await askUser('Has branch clean design and code?');

            if(this._stripString(answer) === 'yes') {
                return printer.ok('ᶘ   6) Branch has clean design and code.');
            } else if(this._stripString(answer) === 'no') {
                this._rejectPullRequest();
            } else {
                return this.execute();
            }
        } catch (e) {
            printer.error(`✘    6) Branch has not clean design and code.`);
            throw e;
        }
    }

    _rejectPullRequest() {
        throw new Error('6) Branch has not clean design and code.');
    }

    _stripString(string) {
        return string.replace(/\s/g, '');
    }

}

module.exports = EnoughInformationInPullRequest;