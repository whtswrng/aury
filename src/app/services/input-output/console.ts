import {IOutput} from "./output.interface";
import * as readline from "readline";
import {IStringColorizer} from "../string-colorizer/string-colorizer.interface";
import {IInput} from "./input.interface";

export class Console implements IOutput, IInput{

    constructor(private stringColorizer: IStringColorizer) {

    }

    public async askUser(question) {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.question(this.stringColorizer.info(question), (answer) => {
                resolve(answer);
                rl.close();
            });
        });
    }

    public info(string) {
        console.log(this.stringColorizer.info(string))
    }

    public error(string) {
        console.log(this.stringColorizer.error(`✘    ${string}`));
    }

    public warning(string) {
        console.log(this.stringColorizer.warning(`${string}`));
    }

    public ok(string) {
        console.log(this.stringColorizer.ok(`    ${string}`));
    }

    public log(string) {
        console.log(string);
    }

}
