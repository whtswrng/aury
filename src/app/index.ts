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
import {INotifier} from "./services/notifiers/notifier.interface";
import {readFilePromisified, createFileIfDoesNotExist, StatusStorage} from "./services/storage/status-storage";
import {ReviewStorage} from "./services/storage/review-storage";
import {DummyNotifier} from "./services/notifiers/dummy-notifier";
import * as inquirer from 'inquirer';
import {QuestionParser} from "./services/question-parser/question-parser";
import {InquirerQuestionParser} from "./services/question-parser/inquirer-question-parser";
import {SimpleHttpClient} from "./services/clients/simple-http-client";
import {InquirerInput} from "./services/input-output/inquirer-input";
import {FinalActionHook, FinalStageHook} from "./core/final-stage-hook";
import {DummyFinalStageHook} from "./core/dummy-final-stage-hook";
import {Help} from "./core/help/help";
import Config = Chai.Config;

const CONFIG_FILE_NAME = 'aury.config.json';
const STORAGE_DIR = '.aury';

let finalStage: FinalActionHook;
let output: IOutput;
let git: Git;
let input: IInput;
let statusStorage: StatusStorage;
let reviewStorage: ReviewStorage;
let questionParser: QuestionParser;
let config: IConfig;
let notifier: INotifier;
let application: Application;


start();

async function start() {
    try {
        await initConfig();
        await initDependencies();
        initStorageDirectory();
        await startJourney();
    } catch (e) {
        console.error(e);
    }
}

async function initDependencies() {
    const stringColorizer: IStringColorizer = new StringColorizer();
    output = new Console(stringColorizer);
    git = new Git(new ChildProcessExecutor());
    input = new InquirerInput(inquirer, stringColorizer);
    questionParser = new InquirerQuestionParser(inquirer, output);
    statusStorage = new StatusStorage(STORAGE_DIR);
    reviewStorage = new ReviewStorage(STORAGE_DIR);
    notifier = instantiateNotifier(config);
    finalStage = instantiateFinalStageHook();

    application = new Application(
        input, output, git, config, statusStorage, reviewStorage, notifier, questionParser, finalStage
    );
}

async function initConfig() {
    try {
        config = await getConfig();
    } catch (e) {
        if (process.argv[2] === '--init') {
            await createDefaultConfigFile();
        } else {
            console.error(`Configuration file '${CONFIG_FILE_NAME}' not found or it's corrupted. ` +
             `Enter "aury --init" for creating a config file.`
            );
            throw e;
        }
    }
}

async function createDefaultConfigFile() {
    const defaultConfigContent: IConfig = {
        prerequisites: [],
        baseBranch: "master",
        questions: [
            "Does the code in branch implement required feature or solved the problem?",
            "Does the code in branch have tests and testing the problem correctly?",
            "Does the code in branch have clean design and code?"
        ]
    };
    await createFileIfDoesNotExist(CONFIG_FILE_NAME, JSON.stringify(defaultConfigContent));
    console.log('Config file "aury.config.json" was created.');
}

function initStorageDirectory() {
    if (!existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR);
    }
}

async function startJourney() {
    if(process.argv[2] === '--help') {
        await printHelp();
    } else if (process.argv[2] === '--status') {
        await printStatus();
    } else if (process.argv[2] === '--pre') {
        await application.checkPrerequisites();
    } else if (process.argv[2] === '--que') {
        await application.checkQuestions();
    } else if (process.argv[2] === '--reviews') {
        await printReviews();
    } else if (process.argv[2] === '--delete') {
        await deleteReview(process.argv[3], process.argv[4]);
    } else if (process.argv[2] === '--delete-all') {
        await deleteAllReviews();
    } else if (process.argv[2] === '--init') {

    } else if (process.argv[2] === '--add') {
        await addPendingReview(process.argv[3], process.argv[4], process.argv[5]);
    } else if(process.argv[2].startsWith('--')) {
        printHelp();
    } else if (hasDefinedBranches()) {
        await startApplication();
    } else {
        printHelp();
    }
}

async function printHelp() {
    const help = new Help(output);
    help.print();
}

async function addPendingReview(branch: string, baseBranch: string, description?: string) {
    await statusStorage.addPendingReview(branch, baseBranch, description);
}

async function deleteReview(branch: string, baseBranch: string) {
    await statusStorage.removeCodeReviewFromInProgress(branch, baseBranch);
    await statusStorage.removeCodeReviewFromInPending(branch, baseBranch);
}

async function deleteAllReviews() {
    await statusStorage.removeAllReviews();
}

async function printStatus() {
    await printReviewsInProgress();
    await printReviewsInPending();
}

async function printReviewsInProgress() {
    const status = await statusStorage.getStatus();

    if (status && status.inProgress && status.inProgress.length) {
        output.log('Some code reviews are in progress:');
        const printableResult = status.inProgress.map((record) => `     ${record.branch} => ${record.baseBranch} (${record.description})`);
        printableResult.forEach((result) => output.warning(result));
    }
}

async function printReviewsInPending() {
    const status = await statusStorage.getStatus();

    if (status && status.pending && status.pending.length) {
        output.log('Some code reviews are still pending:');
        const printableResult = status.pending.map((record) => `     (pending) ${record.branch} => ${record.baseBranch} (${record.description})`);
        printableResult.forEach((result) => output.log(result));
    }
}

async function printReviews() {
    const reviews = await reviewStorage.getMonthReviews();

    if (!reviews || !reviews.length) {
        output.log('There are no finished code reviews for this month.');
    } else {
        output.log(`There are ${reviews.length} finished code reviews for this month: `);
        const printableResult = reviews.map((record) => `     ${record.branch} => ${record.baseBranch}`);
        printableResult.forEach((result) => output.ok(result));
    }
}

async function startApplication() {
    try {
        await application.start();
    } catch (e) {
        output.error(e.message);
    }
}

function hasDefinedBranches() {
    return typeof process.argv[2] === 'string' && config.baseBranch;
}

async function getConfig(): Promise<IConfig> {
    const rawFileData = await readFilePromisified(CONFIG_FILE_NAME);
    return parseConfigFile(rawFileData);
}

function parseConfigFile(rawFileData: string): IConfig {
    return JSON.parse(rawFileData);
}

function instantiateNotifier(config: IConfig): INotifier {
    if (config && config.tokens && config.tokens.slack) {
        return new SlackNotifier(config.tokens.slack, input, new SimpleHttpClient());
    }

    return new DummyNotifier();
}

function instantiateFinalStageHook(): FinalActionHook {
    if (notifier instanceof DummyNotifier) {
        return new DummyFinalStageHook();
    }

    return new FinalStageHook(input, output, notifier);
}
