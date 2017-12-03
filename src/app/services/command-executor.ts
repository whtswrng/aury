import * as child from 'child_process';

export function exec(command): Promise<string> {
    return new Promise((resolve, reject) => {
        child.exec(command, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        })
    });
}
