import {ICommandExecutor} from "../services/command-executor/command-executor.interface";
import {IOutput} from "../services/input-output/output.interface";
import {prerequisites} from "../config.interface";

export class BranchMeetsAllPrerequisites {

    constructor(private output: IOutput,
                private prerequisites: prerequisites,
                private commandExecutor: ICommandExecutor) {
    }

    async execute() {
        try {
            this.output.info('3/6 Are all prerequisites passing?');
            await this.runPrerequisites(this.prerequisites);
            this.output.ok('3) Branch successfully meets all prerequisites.');
        } catch (e) {
            this.output.error(`3) Some prerequisites is not passing.`);
            throw e;
        }
    }

    private async runPrerequisites(scripts) {
        const script = scripts.shift();

        try {
            this.output.info(`          running script "${script}", ${scripts.length} are left.`);
            await this.runScript(script);
            this.output.ok(`          script "${script}" successfully proceeded.`);

            if(scripts.length > 0) {
                return this.runPrerequisites(scripts)
            }
        } catch (e) {
            throw e;
        }
    }

    private async runScript(script) {
        try {
            await this.commandExecutor.exec(`npm run ${script}`);
        } catch (e) {
            console.log(e);
            throw new Error(`script "${script}" has not started well.`);
        }
    }

}
