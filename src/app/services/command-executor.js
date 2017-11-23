const child = require('child_process');

class CommandExecutor {

    exec(command) {
        return new Promise((resolve, reject) => {
            child.exec(command, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            })
        });

    }

}

module.exports = new CommandExecutor();