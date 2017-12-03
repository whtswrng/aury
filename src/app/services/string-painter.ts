import * as colors from 'colors';

export class StringPainter {

    constructor() {
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
    }

    public static info(string) {
        return string.info;
    }

    public static error(string) {
        return string.error;
    }

    public static ok(string) {
        return string.ok;
    }

}
