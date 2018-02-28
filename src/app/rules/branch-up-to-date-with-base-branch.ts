import {Git} from "../services/version-control-system/git";
import {IInput} from "../services/input-output/input.interface";

export class BranchUpToDateWithBaseBranch {

    constructor(private branch: string, private baseBranch: string, private printer, private input: IInput,
                private git: Git) {
    }

    public async execute() {
        this.printer.info(`1/6 Can be branch ${this.branch} properly merged with ${this.baseBranch} (without conflicts)`);

        try {
            await this.git.fetch();
            await this.git.checkoutTo(this.branch);
            await this.git.mergeFastForward(this.baseBranch, this.branch);

            this.printer.ok(`1) Branch ${this.branch} can be merged with ${this.baseBranch}.`);
        } catch (e) {
            await this.handleError(e);
        }
    }

    private async handleError(e) {
        if (await this.canTryHardResetWithOrigin()) {
            await this.hardResetAndTryAgain();
        } else {
            this.printMergeError();
            throw e;
        }
    }

    private printMergeError() {
        this.printer.error(`1) Branch ${this.branch} cannot be merged with ${this.baseBranch}.`);
    }

    private async canTryHardResetWithOrigin(): Promise<boolean> {
        const answer = await this.input.askUser(
            `Cannot do fast forward merge with ${this.baseBranch}. Can i try hard reset with origin?`
        );
        return answer === 'yes';
    }

    private async hardResetAndTryAgain() {
        try {
            await this.git.hardResetWithOrigin(this.branch);
            await this.git.mergeFastForward(this.baseBranch, this.branch);
        } catch (e) {
            this.printMergeError();
        }
    }


}
