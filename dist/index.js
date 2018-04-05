#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var git_1 = require("./services/version-control-system/git");
var fs_1 = require("fs");
var application_1 = require("./application");
var string_colorizer_1 = require("./services/string-colorizer/string-colorizer");
var console_1 = require("./services/input-output/console");
var child_process_executor_1 = require("./services/command-executor/child-process-executor");
var slack_notifier_1 = require("./services/notifiers/slack-notifier");
var status_storage_1 = require("./services/storage/status-storage");
var review_storage_1 = require("./services/storage/review-storage");
var dummy_notifier_1 = require("./services/notifiers/dummy-notifier");
var inquirer = require("inquirer");
var inquirer_question_parser_1 = require("./services/question-parser/inquirer-question-parser");
var simple_http_client_1 = require("./services/clients/simple-http-client");
var inquirer_input_1 = require("./services/input-output/inquirer-input");
var final_stage_hook_1 = require("./core/final-stage-hook");
var dummy_final_stage_hook_1 = require("./core/dummy-final-stage-hook");
var CONFIG_FILE_NAME = 'aury.config.json';
var STORAGE_DIR = '.aury';
var finalStage;
var output;
var git;
var input;
var statusStorage;
var reviewStorage;
var questionParser;
var config;
var notifier;
start();
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4, initConfig()];
                case 1:
                    _a.sent();
                    return [4, initDependencies()];
                case 2:
                    _a.sent();
                    initStorageDirectory();
                    return [4, startJourney()];
                case 3:
                    _a.sent();
                    return [3, 5];
                case 4:
                    e_1 = _a.sent();
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function initDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var stringColorizer;
        return __generator(this, function (_a) {
            stringColorizer = new string_colorizer_1.StringColorizer();
            git = new git_1.Git(new child_process_executor_1.ChildProcessExecutor());
            output = new console_1.Console(stringColorizer);
            input = new inquirer_input_1.InquirerInput(inquirer, stringColorizer);
            questionParser = new inquirer_question_parser_1.InquirerQuestionParser(inquirer);
            statusStorage = new status_storage_1.StatusStorage(STORAGE_DIR);
            reviewStorage = new review_storage_1.ReviewStorage(STORAGE_DIR);
            notifier = instantiateNotifier(config);
            finalStage = instantiateFinalStageHook();
            return [2];
        });
    });
}
function initConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, getConfig()];
                case 1:
                    config = _a.sent();
                    return [3, 3];
                case 2:
                    e_2 = _a.sent();
                    output.log("Configuration file '" + CONFIG_FILE_NAME + "' not found or it's corrupted.");
                    throw e_2;
                case 3: return [2];
            }
        });
    });
}
function initStorageDirectory() {
    if (!fs_1.existsSync(STORAGE_DIR)) {
        fs_1.mkdirSync(STORAGE_DIR);
    }
}
function startJourney() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(process.argv[2] === '--status')) return [3, 2];
                    return [4, printStatus()];
                case 1:
                    _a.sent();
                    return [3, 11];
                case 2:
                    if (!(process.argv[2] === '--reviews')) return [3, 4];
                    return [4, printReviews()];
                case 3:
                    _a.sent();
                    return [3, 11];
                case 4:
                    if (!(process.argv[2] === '--delete')) return [3, 6];
                    return [4, deleteReview(process.argv[3], process.argv[4])];
                case 5:
                    _a.sent();
                    return [3, 11];
                case 6:
                    if (!(process.argv[2] === '--add')) return [3, 8];
                    return [4, addPendingReview(process.argv[3], process.argv[4], process.argv[5])];
                case 7:
                    _a.sent();
                    return [3, 11];
                case 8:
                    if (!hasBranchesInArguments()) return [3, 10];
                    return [4, startApplication()];
                case 9:
                    _a.sent();
                    return [3, 11];
                case 10:
                    output.log('You have to insert branches in format `aury $BRANCH $BASE_BRANCH` or insert command.');
                    _a.label = 11;
                case 11: return [2];
            }
        });
    });
}
function addPendingReview(branch, baseBranch, description) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, statusStorage.addPendingReview(branch, baseBranch, description)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
function deleteReview(branch, baseBranch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, statusStorage.removeCodeReviewFromInProgress(branch, baseBranch)];
                case 1:
                    _a.sent();
                    return [4, statusStorage.removeCodeReviewFromInPending(branch, baseBranch)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
function printStatus() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, printReviewsInProgress()];
                case 1:
                    _a.sent();
                    return [4, printReviewsInPending()];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
function printReviewsInProgress() {
    return __awaiter(this, void 0, void 0, function () {
        var status, printableResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, statusStorage.getStatus()];
                case 1:
                    status = _a.sent();
                    if (status && status.inProgress && status.inProgress.length) {
                        output.log('Some code reviews are in progress:');
                        printableResult = status.inProgress.map(function (record) { return "     " + record.branch + " => " + record.baseBranch + " (" + record.description + ")"; });
                        printableResult.forEach(function (result) { return output.warning(result); });
                    }
                    return [2];
            }
        });
    });
}
function printReviewsInPending() {
    return __awaiter(this, void 0, void 0, function () {
        var status, printableResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, statusStorage.getStatus()];
                case 1:
                    status = _a.sent();
                    if (status && status.pending && status.pending.length) {
                        output.log('Some code reviews are still pending:');
                        printableResult = status.pending.map(function (record) { return "     (pending) " + record.branch + " => " + record.baseBranch + " (" + record.description + ")"; });
                        printableResult.forEach(function (result) { return output.log(result); });
                    }
                    return [2];
            }
        });
    });
}
function printReviews() {
    return __awaiter(this, void 0, void 0, function () {
        var reviews, printableResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, reviewStorage.getMonthReviews()];
                case 1:
                    reviews = _a.sent();
                    if (!reviews || !reviews.length) {
                        output.log('There are no finished code reviews for this month.');
                    }
                    else {
                        output.log("There are " + reviews.length + " finished code reviews for this month: ");
                        printableResult = reviews.map(function (record) { return "     " + record.branch + " => " + record.baseBranch; });
                        printableResult.forEach(function (result) { return output.ok(result); });
                    }
                    return [2];
            }
        });
    });
}
function startApplication() {
    return __awaiter(this, void 0, void 0, function () {
        var application, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    application = new application_1.Application(input, output, git, config, statusStorage, reviewStorage, notifier, questionParser, finalStage);
                    return [4, application.start()];
                case 1:
                    _a.sent();
                    return [3, 3];
                case 2:
                    e_3 = _a.sent();
                    output.error(e_3.message);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
}
function hasBranchesInArguments() {
    return typeof process.argv[2] === 'string' && (typeof process.argv[3] === 'string' || config.baseBranch);
}
function getConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var rawFileData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, status_storage_1.readFilePromisified(CONFIG_FILE_NAME)];
                case 1:
                    rawFileData = _a.sent();
                    return [2, parseConfigFile(rawFileData)];
            }
        });
    });
}
function parseConfigFile(rawFileData) {
    return JSON.parse(rawFileData);
}
function instantiateNotifier(config) {
    if (config && config.tokens && config.tokens.slack) {
        return new slack_notifier_1.SlackNotifier(config.tokens.slack, input, new simple_http_client_1.SimpleHttpClient());
    }
    return new dummy_notifier_1.DummyNotifier();
}
function instantiateFinalStageHook() {
    if (notifier instanceof dummy_notifier_1.DummyNotifier) {
        return new dummy_final_stage_hook_1.DummyFinalStageHook();
    }
    return new final_stage_hook_1.FinalStageHook(input, output, notifier);
}
//# sourceMappingURL=index.js.map