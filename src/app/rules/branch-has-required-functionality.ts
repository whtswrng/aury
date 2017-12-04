import {BaseQuestionRule} from "./base-question-rule";
import {IInput} from "../services/input-output/input.interface";

export class BranchHasRequiredFunctionality extends BaseQuestionRule {

    constructor(private printer, protected input: IInput) {
        super(input, '4/6 Has branch required functionality (Does the code solved the problem)? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('4) Branch has not required functionality.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   4) Branch has required functionality.');
    }

}
