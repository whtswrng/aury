const StringPainter = require('./string-painter');

class ConsoleOutputPrinter {

    constructor() {
    }

    info(string) {
        console.log(StringPainter.info(string))
    }

    error(string) {
        console.log(StringPainter.error(string))
    }

    ok(string) {
        console.log(StringPainter.ok(string));
    }

}

module.exports = new ConsoleOutputPrinter();