import {IUserInput} from "./input-user.interface";
import {IStringPainter} from "../string-painter/string-painter.interface";
const readline = require('readline');

export class Terminal implements IUserInput{

    constructor(private stringPainter: IStringPainter) {

    }

    public async askUser(question) {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.question(this.stringPainter.info(question), (answer) => {
                resolve(answer);
                rl.close();
            });
        });
    }

}
