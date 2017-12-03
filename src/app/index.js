#!/usr/bin/env node
const fs = require('fs');
const printer = require('./services/output-printer');
const BranchUpToDateWithMaster = require('./rules/branch-up-to-date-with-master');
const EnoughInformationInPullRequest = require('./rules/enough-information-in-pull-request');
const AllPrerequisites = require('./rules/branch-meets-all-prerequisites');
const BranchHasRequiredFunctionality = require('./rules/branch-has-required-functionality');
const BranchHasTests = require('./rules/branch-has-tests');
const BranchHasCleanDesignAndCode = require('./rules/branch-has-clean-design-and-code');
const git = require('./services/git');

const CONFIG_FILE_NAME = 'aury.config.json';

startJourney();

async function startJourney() {
    const currentCommitHash = await git.getCurrentCommitHash();

    try {
        await checkIfGitStatusIsClean();
        await checkAllRules();
        await restoreGitToPreviousState(currentCommitHash);

        printer.ok(`\nPull request was approved. Congratulations c:`);
    } catch (e) {
        await restoreGitToPreviousState(currentCommitHash);
        printer.error(`Pull request was denied, because of: "${e.message}"`);
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
    const branchUpToDateWithMaster = new BranchUpToDateWithMaster();
    return branchUpToDateWithMaster.execute();
}

async function checkIfPullRequestHasEnoughInformation() {
    const enoughInformation = new EnoughInformationInPullRequest();
    return enoughInformation.execute();
}

async function checkIfBranchMeetsAllPrerequisites() {
    const fileData = await readFile(CONFIG_FILE_NAME);
    const allPrerequisites = new AllPrerequisites(getPrerequisitedFromRawFileData(fileData));
    return allPrerequisites.execute();
}

async function checkIfBranchHasRequiredFunctionality() {
    const enoughInformation = new BranchHasRequiredFunctionality();
    return enoughInformation.execute();
}

async function checkIfBranchHasTests() {
    const enoughInformation = new BranchHasTests();
    return enoughInformation.execute();
}

async function checkIfBranchHasCleanDesignAndCode() {
    const enoughInformation = new BranchHasCleanDesignAndCode();
    return enoughInformation.execute();
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
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
    } catch(e) {}
}
