#!/usr/bin/env node
const fs = require('fs');
const printer = require('./services/output-printer');
const BranchUpToDateWithMaster = require('./rules/branch-up-to-date-with-master');

const CONFIG_FILE_NAME = 'aury.config.json';

startJourney();


async function startJourney() {
    const branchName = await promptBranch();

    try {
        await checkIfBranchIsUpToDateWithMaster(branchName);
    } catch (e) {
        printer.error(e.message);
    }
    // const rawFileData = readFile(CONFIG_FILE_NAME);
    // const scriptToRunList = getScriptListFromRawFileData(rawFileData);
    // console.log(scriptToRunList);
}

async function promptBranch() {
}

async function checkIfBranchIsUpToDateWithMaster() {
    const branchUpToDateWithMaster = new BranchUpToDateWithMaster();
    return branchUpToDateWithMaster.execute();
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            return !err && !!data ? resolve(data.toString()) : reject(err);
        })
    });
}

function getScriptListFromRawFileData(rawFileData) {
    const dataInJson = JSON.parse(rawFileData);
    return dataInJson.scripts;
}
