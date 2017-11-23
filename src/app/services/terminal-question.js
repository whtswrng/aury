const readline = require('readline');
const stringPainter = require('./string-painter');

class TerminalQuestion {

    async askUser(question) {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });

            rl.question(stringPainter.info(question), (answer) => {
                resolve(answer);
                rl.close();
            });
        });
    }

}

module.exports = new TerminalQuestion();