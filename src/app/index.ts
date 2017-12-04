#!/usr/bin/env node
import {Git} from "./services/version-control-system/git";
import {BranchHasRequiredFunctionality} from "./rules/branch-has-required-functionality";
import {BranchHasTests} from "./rules/branch-has-tests";
import {BranchHasCleanDesignAndCode} from "./rules/branch-has-clean-design-and-code";
import {EnoughInformationInPullRequest} from "./rules/enough-information-in-pull-request";
import {BranchMeetsAllPrerequisites} from "./rules/branch-meets-all-prerequisites";
import {BranchUpToDateWithMaster} from "./rules/branch-up-to-date-with-master";
import {Terminal} from "./services/input-device/terminal";
import {readFile} from "fs";
import {CommandExecutor} from "./services/command-executor/command-executor";
import {ConsoleOutputPrinter} from "./services/output-printer/console-output-printer";
import {IOutputPrinter} from "./services/output-printer/output-printer.interface";
import {IUserInput} from "./services/input-device/input-user.interface";
import {IStringPainter} from "./services/string-painter/string-painter.interface";
import {StringPainter} from "./services/string-painter/string-painter";

const CONFIG_FILE_NAME = 'aury.config.json';
const git: Git = new Git(new CommandExecutor());
const stringPainter: IStringPainter = new StringPainter();
const output: IOutputPrinter = new ConsoleOutputPrinter(stringPainter);
const input: IUserInput = new Terminal(stringPainter);

startJourney();

async function startJourney() {
    const currentCommitHash = await git.getCurrentCommitHash();

    try {
        await checkIfGitStatusIsClean();
        await checkAllRules();
        await restoreGitToPreviousState(currentCommitHash);

        output.ok(`\nPull request was approved. Congratulations c:`);
    } catch (e) {
        await restoreGitToPreviousState(currentCommitHash);
        output.error(`Pull request was denied, because of: "${e.message}"`);
        console.log(e);
    }
}

async function checkIfGitStatusIsClean() {
    if( ! await git.isGitStatusClean()) {
        throw new Error('Git status is not clean!');
    }
}

async function checkAllRules() {
    await checkIfBranchIsUpToDateWithMaster();
    await checkIfPullRequestHasEnoughInformation();
    await checkIfBranchMeetsAllPrerequisites();
    await checkIfBranchHasRequiredFunctionality();
    await checkIfBranchHasTests();
    await checkIfBranchHasCleanDesignAndCode();
}

async function checkIfBranchIsUpToDateWithMaster() {
    const branchUpToDateWithMaster = new BranchUpToDateWithMaster(output, input, git);
    return branchUpToDateWithMaster.execute();
}

async function checkIfPullRequestHasEnoughInformation() {
    const enoughInformation = new EnoughInformationInPullRequest(output, input);
    return enoughInformation.execute();
}

async function checkIfBranchMeetsAllPrerequisites() {
    const fileData = await readFilePromisified(CONFIG_FILE_NAME);
    const allPrerequisites = new BranchMeetsAllPrerequisites(
        output, getPrerequisitedFromRawFileData(fileData), new CommandExecutor()
    );
    return allPrerequisites.execute();
}

async function checkIfBranchHasRequiredFunctionality() {
    const enoughInformation = new BranchHasRequiredFunctionality(output, input);
    return enoughInformation.execute();
}

async function checkIfBranchHasTests() {
    const enoughInformation = new BranchHasTests(output, input);
    return enoughInformation.execute();
}

async function checkIfBranchHasCleanDesignAndCode() {
    const enoughInformation = new BranchHasCleanDesignAndCode(output, input);
    return enoughInformation.execute();
}

function readFilePromisified(filePath) {
    return new Promise((resolve, reject) => {
        readFile(filePath, (err, data) => {
            return !err && !!data ? resolve(data.toString()) : reject(err);
        })
    });
}

function getPrerequisitedFromRawFileData(rawFileData) {
    const dataInJson = JSON.parse(rawFileData);
    return dataInJson.prerequisites;
}

async function restoreGitToPreviousState(commit) {
    try {
        await git.abortMerge();
        await git.checkoutTo(commit);
    } catch(e) {
        // let git handle this problem
    }
}
