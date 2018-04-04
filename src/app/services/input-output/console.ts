import {IOutput} from "./output.interface";
import {IStringColorizer} from "../string-colorizer/string-colorizer.interface";

export class Console implements IOutput{

    constructor(private stringColorizer: IStringColorizer) {

    }

    public separate(): void {
        console.log('------------------------------------------');
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
