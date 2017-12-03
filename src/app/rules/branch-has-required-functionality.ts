import {BaseQuestionRule} from "./base-question-rule";
import {OutputUserInterface} from "../services/output-user-interface";

export class BranchHasRequiredFunctionality extends BaseQuestionRule {

    constructor(private printer, protected output: OutputUserInterface) {
        super(output, '4/6 Has branch required functionality (Does the code solved the problem)? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('4) Branch has not required functionality.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   4) Branch has required functionality.');
    }

}
