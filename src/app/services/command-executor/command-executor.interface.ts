export interface ICommandExecutor {
    exec(command: string): Promise<string>;
}
