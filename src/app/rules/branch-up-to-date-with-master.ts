import {Git} from "../services/version-control-system/git";
import {IInput} from "../services/input-output/input.interface";

export class BranchUpToDateWithMaster {

    constructor(private printer, private input: IInput, private git: Git) {

    }

    async execute() {
        this.printer.info(`1/6 Can be branch properly merged with master (without conflicts)`);
        const branch = await this._getBranchFromUser();

        try {
            await this.git.fetch();
            await this.git.checkoutTo(branch);
            await this.git.mergeFastForward('master', branch);

            this.printer.ok('ᶘ   1) Branch can be merged with master.');
        } catch (e) {
            this.printer.error(`✘    1) Branch cannot be merged with master.`);
            throw e;
        }
    }

    private async _getBranchFromUser() {
        const insertBranchNameString = 'Please insert branch name: ';
        return this.input.askUser(insertBranchNameString);
    }

}
