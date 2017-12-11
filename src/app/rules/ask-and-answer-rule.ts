import {IInput} from "../services/input-output/input.interface";

export abstract class AskAndAnswerRule {

    constructor(protected input: IInput, private question: string) {

    }

    public async execute(): Promise<void> {
        try {
            const answer = await this.input.askUser(this.question);

            if(this.stripString(answer) === 'yes') {
                return this.resolveRule();
            } else if(this.stripString(answer) === 'no') {
                return this.rejectRule();
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
