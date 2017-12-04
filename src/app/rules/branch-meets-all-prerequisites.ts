import {ICommandExecutor} from "../services/command-executor/command-executor.interface";

export class BranchMeetsAllPrerequisites {

    constructor(private printer, private prerequisites, private commandExecutor: ICommandExecutor) {
    }

    async execute() {
        try {
            this.printer.info('3/6 Are all prerequisites passing?');
            await this.runPrerequisites(this.prerequisites);
            this.printer.ok('ᶘ   3) Branch successfully meets all prerequisites.');
        } catch (e) {
            this.printer.error(`✘    3) Some prerequisites is not passing.`);
            throw e;
        }
    }

    private async runPrerequisites(scripts) {
        const script = scripts.shift();

        try {
            this.printer.info(`          running script "${script}", ${scripts.length} are left.`);
            await this.runScript(script);
            this.printer.ok(`          script "${script}" successfully proceeded.`);

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
