#!/usr/bin/env node
import {Git} from "./services/version-control-system/git";
import {readFile} from "fs";
import {IConfig} from "./config.interface";
import {ApplicationExecutor} from "./application-executor";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {StringColorizer} from "./services/string-colorizer/string-colorizer";
import {IStringColorizer} from "./services/string-colorizer/string-colorizer.interface";
import {Console} from "./services/input-output/console";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {SlackNotifier} from "./services/notifiers/slack-notifier";
import {HttpRequester} from "./services/requesters/http-requester";
import {INotifier} from "./services/notifiers/notifier.interface";

const CONFIG_FILE_NAME = 'aury.config.json';

start();

async function start() {
    let output: IOutput;
    try {
        const git: Git = new Git(new ChildProcessExecutor());
        const stringColorizer: IStringColorizer = new StringColorizer();
        output = new Console(stringColorizer);
        const input: IInput = new Console(stringColorizer);
        const config: IConfig = await getConfig();
        const notifier = getNotifier(config);

        const application = new ApplicationExecutor(input, output, git, config, notifier);
        await application.start();
    } catch (e) {
        output.error(e.message);
    }
}

async function getConfig(): Promise<IConfig> {
    const rawFileData = await readFilePromisified(CONFIG_FILE_NAME);
    return parseConfigFile(rawFileData);
}

function readFilePromisified(filePath): Promise<string> {
    return new Promise((resolve, reject) => {
        readFile(filePath, (err, data) => {
            return !err && !!data ? resolve(data.toString()) : reject(err);
        })
    });
}

function parseConfigFile(rawFileData: string): IConfig {
    return JSON.parse(rawFileData);
}

function getNotifier(config: IConfig): INotifier {
    if (config && config.tokens && config.tokens.slack) {
        return new SlackNotifier(config.tokens.slack, new HttpRequester());
    }

    return null;
}
