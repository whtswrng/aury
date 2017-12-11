import {Git} from "../services/version-control-system/git";
import {IInput} from "../services/input-output/input.interface";

export class BranchUpToDateWithMaster {

    constructor(private branch: string, private printer, private input: IInput, private git: Git) {

    }

    async execute() {
        this.printer.info(`1/6 Can be branch properly merged with master (without conflicts)`);

        try {
            await this.git.fetch();
            await this.git.checkoutTo(this.branch);
            await this.git.mergeFastForward('master', this.branch);

            this.printer.ok(`1) Branch ${this.branch} can be merged with master.`);
        } catch (e) {
            this.printer.error(`1) Branch ${this.branch} cannot be merged with master.`);
            throw e;
        }
    }


}
