import {Git} from "../services/version-control-system/git";
import {IInput} from "../services/input-output/input.interface";

export class BranchUpToDateWithBaseBranch {

    constructor(private branch: string, private baseBranch: string, private printer, private input: IInput,
                private git: Git) {
    }

    public async execute() {
        this.printer.info(`Can be branch ${this.branch} properly merged with ${this.baseBranch} (without conflicts)`);

        try {
            await this.git.fetch();
            await this.git.checkoutTo(this.branch);
            await this.git.mergeFastForward(this.baseBranch, this.branch);

            this.printer.ok(`Branch ${this.branch} can be merged with ${this.baseBranch}.`);
        } catch (e) {
            this.printMergeError(e);
            await this.handleError(e);
        }
    }

    private async handleError(e) {
        const answer = await this.canTryHardResetWithOrigin();

        if (answer === 'yes') {
            await this.hardReset();
            await this.execute();
        } else if (answer === 'skip'){
            // pretend everything is ok
        } else {
            throw new Error(this.getErrorMessage());
        }
    }

    private printMergeError(e) {
        this.printer.error(this.getErrorMessage());
    }

    private getErrorMessage(): string {
        return `Branch ${this.branch} cannot be merged with ${this.baseBranch}.`;
    }

    private async canTryHardResetWithOrigin(): Promise<string> {
        return this.input.askUser(
            `Cannot do fast forward merge with ${this.baseBranch}. Can i try hard reset with origin? (yes/no/skip)`
        );
    }

    private async hardReset() {
        try {
            await this.git.hardResetWithOrigin(this.branch);
            await this.git.mergeFastForward(this.baseBranch, this.branch);
        } catch (e) {
            this.printMergeError(e);
            throw new Error(this.getErrorMessage());
        }
    }


}
