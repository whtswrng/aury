import {BaseQuestionRule} from "./base-question-rule";
import {OutputUserInterface} from "../services/output-user-interface";

export class BranchHasTests extends BaseQuestionRule {

    constructor(private printer, protected output: OutputUserInterface) {
        super(output, '5/6 Has branch tests and are they properly testing the problem? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('5) Branch does not have tests or they are not properly testing the problem.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   5) Branch has tests and they are properly testing the problem.');
    }
}
