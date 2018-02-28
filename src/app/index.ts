#!/usr/bin/env node
import {Git} from "./services/version-control-system/git";
import {existsSync, mkdirSync} from "fs";
import {IConfig} from "./config.interface";
import {Application} from "./application";
import {IInput} from "./services/input-output/input.interface";
import {IOutput} from "./services/input-output/output.interface";
import {StringColorizer} from "./services/string-colorizer/string-colorizer";
import {IStringColorizer} from "./services/string-colorizer/string-colorizer.interface";
import {Console} from "./services/input-output/console";
import {ChildProcessExecutor} from "./services/command-executor/child-process-executor";
import {SlackNotifier} from "./services/notifiers/slack-notifier";
import {HttpRequester} from "./services/requesters/http-requester";
import {INotifier} from "./services/notifiers/notifier.interface";
import {readFilePromisified, StatusStorage} from "./services/storage/status-storage";
import {ReviewStorage} from "./services/storage/review-storage";
import {DummyNotifier} from "./services/notifiers/dummy-notifier";

const CONFIG_FILE_NAME = 'aury.config.json';
const STORAGE_DIR = '.aury';

let output: IOutput;
let git: Git;
let input: IInput;
let statusStorage: StatusStorage;
let reviewStorage: ReviewStorage;
let config: IConfig;


start();

async function start() {
    try {
        initDependencies();
        await initConfig();
        initStorageDirectory();
        await startJourney();
    } catch (e) {}
}

function initDependencies() {
    git = new Git(new ChildProcessExecutor());
    const stringColorizer: IStringColorizer = new StringColorizer();
    output = new Console(stringColorizer);
    input = new Console(stringColorizer);
    statusStorage = new StatusStorage(STORAGE_DIR);
    reviewStorage = new ReviewStorage(STORAGE_DIR);
}

async function initConfig() {
    try {
        config = await getConfig();
    } catch (e) {
        output.log(`Cannot find configuration file '${CONFIG_FILE_NAME}'.`);
        throw e;
    }
}

function initStorageDirectory() {
    if( ! existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR);
    }
}

async function startJourney() {
    if(hasBranchesInArguments()) {
        await startAuryApplication();
    } else {
        await processCommands();
    }
}

async function processCommands() {
    if (process.argv[2] === 'status') {
        await printStatus();
    } else if (process.argv[2] === 'reviews') {
        await printReviews();
    } else {
        output.log('You have to insert branches in format `aury $BRANCH $BASE_BRANCH` or insert command.');
    }
}

async function printStatus() {
    const status = await statusStorage.getStatus();

    if(! status || !status.inProgress || ! status.inProgress.length) {
        output.log('There are no code review in progress.');
    } else {
        output.log('Some code reviews are in progress:');
        const printableResult = status.inProgress.map((record) => `     ${record.branch} => ${record.baseBranch}`);
        printableResult.forEach((result) => output.warning(result));
    }
}

async function printReviews() {
    const reviews = await reviewStorage.getMonthReviews();

    if(! reviews || ! reviews.length) {
        output.log('There are no finished code reviews for this month.');
    } else {
        output.log(`There are ${reviews.length} finished code reviews for this month: `);
        const printableResult = reviews.map((record) => `     ${record.branch} => ${record.baseBranch}`);
        printableResult.forEach((result) => output.ok(result));
    }
}

async function startAuryApplication() {
    try {
        const notifier = getNotifier(config);
        const application = new Application(input, output, git, config, statusStorage, reviewStorage, notifier);

        await application.start();
    } catch (e) {
        output.error(e.message);
    }
}

function hasBranchesInArguments() {
    return typeof process.argv[2] === 'string' && typeof process.argv[3] === 'string';
}

async function getConfig(): Promise<IConfig> {
    const rawFileData = await readFilePromisified(CONFIG_FILE_NAME);
    return parseConfigFile(rawFileData);
}

function parseConfigFile(rawFileData: string): IConfig {
    return JSON.parse(rawFileData);
}

function getNotifier(config: IConfig): INotifier {
    if (config && config.tokens && config.tokens.slack) {
        return new SlackNotifier(config.tokens.slack, input, new HttpRequester());
    }

    return new DummyNotifier();
}
