import {ICommandExecutor} from "../services/command-executor/command-executor.interface";
import {IOutput} from "../services/input-output/output.interface";
import {prerequisites} from "../config.interface";
import {IInput} from "../services/input-output/input.interface";

export class BranchMeetsAllPrerequisites {

    constructor(private output: IOutput,
                private prerequisites: prerequisites,
                private input: IInput,
                private commandExecutor: ICommandExecutor,
                private stepsCount: number) {
    }

    async execute() {
        try {
            this.output.info(`2/${this.stepsCount} Are all prerequisites passing?`);
            await this.runPrerequisites(this.prerequisites);
            this.output.ok('Branch successfully meets all prerequisites.');
        } catch (e) {
            this.output.error(`Some prerequisite is not passing.`);
            throw e;
        }
    }

    private async runPrerequisites(scripts) {
        if(scripts.length === 0){
            return;
        }
        const script = scripts.shift();

        this.output.info(`    running script "${script}", ${scripts.length} are left.`);
        await this.runScript(script);
        this.output.ok(`    script "${script}" successfully proceeded.`);

        if(scripts.length > 0) {
            return this.runPrerequisites(scripts)
        }
    }

    private async runScript(script) {
        try {
            await this.commandExecutor.exec(script);
        } catch (e) {
            this.output.error(e.message);
            await this.askForRetry(script);
        }
    }

    private async askForRetry(script) {
        const answer = await this.input.askUser('Do you want to run this script again? (yes/no/skip)');
        if (answer === 'yes') {
            await this.runScript(script);
        } else if(answer === 'skip'){
            // pretend everything is OK
        } else {
            throw new Error(`script "${script}" has not finished well.`);
        }
    }

}
