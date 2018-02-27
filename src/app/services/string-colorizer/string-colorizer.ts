import * as colors from 'colors';
import {IStringColorizer} from "./string-colorizer.interface";

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'cyan',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    ok: 'green',
    error: 'red'
});

export class StringColorizer implements IStringColorizer{

    public info(string) {
        return string.info;
    }

    public warning(string) {
        return string.warn;
    }

    public error(string) {
        return string.error;
    }

    public ok(string) {
        return string.ok;
    }

}
