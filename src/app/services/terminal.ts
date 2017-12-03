import * as readline from "readline";
import {OutputUserInterface} from "./output-user-interface";

export class Terminal implements OutputUserInterface{

    constructor(private stringPainter) {

    }

    public async askUser(question) {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.question(this.stringPainter.info(question + ' '), (answer) => {
                resolve(answer);
                rl.close();
            });
        });
    }

}
