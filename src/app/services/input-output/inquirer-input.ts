import {IInput} from "./input.interface";
import {ActionSeparator} from "../../core/final-stage-hook";
import {Inquirer} from "inquirer";
import * as readline from "readline";
import {StringColorizer} from "../string-colorizer/string-colorizer";

export class InquirerInput implements IInput {

    constructor(private inquirer: Inquirer, private stringColorizer: StringColorizer) {

    }

    public askUser(question: string): Promise<string> {
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

    public async askUserForAction(actions: Array<string | ActionSeparator>): Promise<number> {
        const answer = await this.inquirer.prompt([
            {
                type: 'list',
                name: 'selectedAction',
                message: "What do you want to do?",
                choices: this.buildChoicesFromActions(actions)
            }
        ]) as any;

        return actions.indexOf(answer.selectedAction);
    }

    private buildChoicesFromActions(actions: Array<string | ActionSeparator>): Array<string | any> {
        return actions.map((action) => {
            if (action instanceof ActionSeparator) {
                return new this.inquirer.Separator()
            } else {
                return action;
            }
        })
    }

}