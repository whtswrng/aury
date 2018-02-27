import {IInput} from "../services/input-output/input.interface";
import {Question} from "./question";

export class BranchHasTests extends Question {

    constructor(private printer, protected input: IInput) {
        super(input, '5/6 Has branch tests and are they properly testing the problem? (yes/no)');
    }

    protected rejectRule() {
        throw new Error('5) Branch does not have tests or they are not properly testing the problem.');
    }

    protected resolveRule() {
        return this.printer.ok('5) Branch has tests and they are properly testing the problem.');
    }
}
