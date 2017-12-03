import {BaseQuestionRule} from "./base-question-rule";
import {OutputUserInterface} from "../services/output-user-interface";

export class BranchHasCleanDesignAndCode extends BaseQuestionRule {

    constructor(private printer, protected output: OutputUserInterface) {
        super(output, '6/6 Has branch clean design and code? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('6) Branch has not clean design and code.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   2) Pull request has properly described the problem.');
    }
}
