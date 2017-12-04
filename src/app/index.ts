#!/usr/bin/env node
import {Git} from "./services/version-control-system/git";
import {Terminal} from "./services/input-device/terminal";
import {readFile} from "fs";
import {CommandExecutor} from "./services/command-executor/command-executor";
import {ConsoleOutputPrinter} from "./services/output-printer/console-output-printer";
import {IOutputPrinter} from "./services/output-printer/output-printer.interface";
import {IUserInput} from "./services/input-device/input-user.interface";
import {IStringPainter} from "./services/string-painter/string-painter.interface";
import {StringPainter} from "./services/string-painter/string-painter";
import {IConfig} from "./config.interface";
import {ApplicationExecutor} from "./application-executor";

const CONFIG_FILE_NAME = 'aury.config.json';

start();

async function start() {
    const git: Git = new Git(new CommandExecutor());
    const stringPainter: IStringPainter = new StringPainter();
    const output: IOutputPrinter = new ConsoleOutputPrinter(stringPainter);
    const input: IUserInput = new Terminal(stringPainter);
    const config = await getConfig();

    const application = new ApplicationExecutor(input, output, git, config);
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

