import {OutputUserInterface} from "../services/output-user-interface";

export abstract class BaseQuestionRule {

    constructor(protected output: OutputUserInterface, private question: string) {

    }

    public async execute() {
        try {
            const answer = await this.output.askUser(this.question);

            if(this.stripString(answer) === 'yes') {
                return this.resolveRule();
            } else if(this.stripString(answer) === 'no') {
                this.rejectRule();
            } else {
                return this.execute();
            }
        } catch (e) {
            throw e;
        }
    }

    private stripString(string) {
        return string.replace(/\s/g, '');
    }

    protected abstract rejectRule();

    protected abstract resolveRule();

}
