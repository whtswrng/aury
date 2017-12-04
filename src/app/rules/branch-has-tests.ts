import {BaseQuestionRule} from "./base-question-rule";
import {IUserInput} from "../services/input-device/input-user.interface";

export class BranchHasTests extends BaseQuestionRule {

    constructor(private printer, protected input: IUserInput) {
        super(input, '5/6 Has branch tests and are they properly testing the problem? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('5) Branch does not have tests or they are not properly testing the problem.');
    }

    protected resolveRule() {
        return this.printer.ok('ᶘ   5) Branch has tests and they are properly testing the problem.');
    }
}
