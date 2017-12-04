import * as colors from 'colors';

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

export class StringPainter implements StringPainter{

    public info(string) {
        return string.info;
    }

    public error(string) {
        return string.error;
    }

    public ok(string) {
        return string.ok;
    }

}
