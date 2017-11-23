const colors = require('colors');

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
    error: 'red'
});

class StringPainter {

    info(string) {
        return string.info;
    }

    error(string) {
        return string.error;
    }

}

module.exports = new StringPainter();