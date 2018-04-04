import {IInput} from "../services/input-output/input.interface";
import * as console from 'inquirer';

export class Question {

    constructor(protected input: IInput, private question: string) {

    }

    public async ask(): Promise<void> {
        const answer = await this.input.askUser(this.question);

        if(this.stripString(answer) === 'yes' || this.stripString(answer) === 'skip') {
            return this.resolveRule();
        } else if(this.stripString(answer) === 'no') {
            return this.rejectRule();
        } else {
            return this.ask();
        }
    }

    private stripString(string) {
        return string.replace(/\s/g, '');
    }

    protected rejectRule(): void {
        throw new Error(`Answer on "${this.question}" was no.`);
    };

    protected resolveRule(): void {
    };

}
