#!/usr/bin/env node
import {Git} from "./services/version-control-system/git";
import {readFile} from "fs";
import {CommandExecutor} from "./services/command-executor/command-executor";
import {IConfig} from "./config.interface";
import {ApplicationExecutor} from "./application-executor";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {StringColorizer} from "./services/string-colorizer/string-colorizer";
import {IStringColorizer} from "./services/string-colorizer/string-colorizer.interface";
import {Console} from "./services/input-output/console";

const CONFIG_FILE_NAME = 'aury.config.json';

start();

async function start() {
    const git: Git = new Git(new CommandExecutor());
    const stringColorizer: IStringColorizer = new StringColorizer();
    const console = new Console(stringColorizer);
    const config: IConfig = await getConfig();

    const application = new ApplicationExecutor(console, console, git, config);
    application.start();
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

