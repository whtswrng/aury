import * as child from 'child_process';
import {ICommandExecutor} from "./command-executor.interface";

export class CommandExecutor implements ICommandExecutor{

    public exec(command: string): Promise<string> {
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
