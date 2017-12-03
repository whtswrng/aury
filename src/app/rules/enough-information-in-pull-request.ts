import {BaseQuestionRule} from "./base-question-rule";
import {OutputUserInterface} from "../services/output-user-interface";

export class EnoughInformationInPullRequest extends BaseQuestionRule {

    constructor(private printer, protected output: OutputUserInterface) {
        super(output, '2/6 Has pull request enough information to understand the problem? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('Pull request has not enough information for a reviewer to understand the problem.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   2) Pull request has properly described the problem.');
    }

}
