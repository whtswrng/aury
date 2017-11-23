#!/usr/bin/env node
const fs = require('fs');
const BranchUpToDateWithMaster = require('./rules/branch-up-to-date-with-master');

const CONFIG_FILE_NAME = 'aury.config.json';

startJourney();


async function startJourney() {
    const branchName = await promptBranch();

    await checkIfBranchIsUpToDateWithMaster(branchName);
    // const rawFileData = readFile(CONFIG_FILE_NAME);
    // const scriptToRunList = getScriptListFromRawFileData(rawFileData);
    // console.log(scriptToRunList);

}

async function promptBranch() {
}

async function checkIfBranchIsUpToDateWithMaster() {
    const branchUpToDateWithMaster = new BranchUpToDateWithMaster();
    branchUpToDateWithMaster.execute();
}


// const exec = child.exec('npm run test', (err, data) => {
//     console.log(err);
//     console.log(data);
// });
//
//
// console.log(process.env.PATH)
//
// exec.stdout.on('data', (data) => {
//    console.log(data.toString());
// });
//
// exec.stdout.on('error', (data) => {
//     console.log(data.toString());
// });


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
