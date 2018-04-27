import * as child from 'child_process';
import {ICommandExecutor} from "./command-executor.interface";

export class ChildProcessExecutor implements ICommandExecutor{

    public exec(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            child.exec(command, {maxBuffer: 1024 * 650}, (err, stdout, stderr) => {
                if (err) {
                    return reject(new Error(stderr || stdout || err.message));
                }
                resolve(stdout);
            })
        });
    }

}
