import {Git} from "../services/version-control-system/git";
import {IInput} from "../services/input-output/input.interface";

export class BranchUpToDateWithBaseBranch {

    constructor(private branch: string, private baseBranch: string, private printer, private input: IInput,
                private git: Git) {
    }

    async execute() {
        this.printer.info(`1/6 Can be branch ${this.branch} properly merged with ${this.baseBranch} (without conflicts)`);

        try {
            await this.git.fetch();
            await this.git.checkoutTo(this.branch);
            await this.git.mergeFastForward(this.baseBranch, this.branch);

            this.printer.ok(`1) Branch ${this.branch} can be merged with ${this.baseBranch}.`);
        } catch (e) {
            this.printer.error(`1) Branch ${this.branch} cannot be merged with ${this.baseBranch}.`);
            throw e;
        }
    }


}
