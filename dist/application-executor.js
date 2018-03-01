"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var branch_up_to_date_with_base_branch_1 = require("./rules/branch-up-to-date-with-base-branch");
var branch_meets_all_prerequisites_1 = require("./rules/branch-meets-all-prerequisites");
var child_process_executor_1 = require("./services/command-executor/child-process-executor");
var question_1 = require("./rules/question");
var ApplicationExecutor = (function () {
    function ApplicationExecutor(input, output, git, config, notifier) {
        this.input = input;
        this.output = output;
        this.git = git;
        this.config = config;
        this.notifier = notifier;
    }
    ApplicationExecutor.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentCommitHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertProcessArguments();
                        return [4, this.git.getCurrentCommitHash()];
                    case 1:
                        currentCommitHash = _a.sent();
                        return [4, this.notifyUserIfGitStatusIsNotClean()];
                    case 2:
                        _a.sent();
                        if (!(process.argv[4] === '--pre')) return [3, 4];
                        return [4, this.checkPrerequisites()];
                    case 3:
                        _a.sent();
                        return [3, 6];
                    case 4: return [4, this.startProcessing(currentCommitHash)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.checkPrerequisites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.assertBranchMeetsAllPrerequisites()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.startProcessing = function (currentCommitHash) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4, this.processSlackMessage()];
                    case 1:
                        _a.sent();
                        return [4, this.checkAllRules()];
                    case 2:
                        _a.sent();
                        return [4, this.restoreGitToPreviousState(currentCommitHash)];
                    case 3:
                        _a.sent();
                        return [4, this.approvePullRequest()];
                    case 4:
                        _a.sent();
                        return [3, 7];
                    case 5:
                        e_2 = _a.sent();
                        return [4, this.denyPullRequest(currentCommitHash, e_2)];
                    case 6:
                        _a.sent();
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.assertProcessArguments = function () {
        if (typeof process.argv[2] !== 'string' || typeof process.argv[3] !== 'string') {
            throw new Error('You have to provide branch parameters: "aury $BRANCH $BASE_BRANCH"');
        }
    };
    ApplicationExecutor.prototype.notifyUserIfGitStatusIsNotClean = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.checkIfGitStatusIsClean()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_3 = _a.sent();
                        this.output.warning('Git status is not clean! Aury could be in trouble because of that!');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.processSlackMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sendMessageAboutStartingReview;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.config.tokens && this.config.tokens.slack)) return [3, 4];
                        _a = this;
                        return [4, this.input.askUser('Type slack user name of the author of pull request: ')];
                    case 1:
                        _a.pullRequestAuthor = _b.sent();
                        return [4, this.input.askUser('Send message about starting review? (yes/no) ')];
                    case 2:
                        sendMessageAboutStartingReview = _b.sent();
                        if (!(sendMessageAboutStartingReview === 'yes')) return [3, 4];
                        return [4, this.notifyAuthorAboutStartingReview()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.getBranch = function () {
        return process.argv[2];
    };
    ApplicationExecutor.prototype.getBaseBranch = function () {
        return process.argv[3];
    };
    ApplicationExecutor.prototype.notifyAuthorAboutStartingReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.notifier.notifyInfo(this.pullRequestAuthor, "Just letting you know that someone is working on your pull request on branch " + this.getBranch() + ".")];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.checkIfGitStatusIsClean = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.git.isGitStatusClean()];
                    case 1:
                        if (!(_a.sent())) {
                            throw new GitStatusIsNotClean('Git status is not clean!');
                        }
                        return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.checkAllRules = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.assertBranchIsMergeableWithBaseBranch()];
                    case 1:
                        _a.sent();
                        return [4, this.assertBranchMeetsAllPrerequisites()];
                    case 2:
                        _a.sent();
                        return [4, this.assertBranchMeetsAllQuestions()];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.assertBranchIsMergeableWithBaseBranch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var branchUpToDateWithMaster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        branchUpToDateWithMaster = new branch_up_to_date_with_base_branch_1.BranchUpToDateWithBaseBranch(this.getBranch(), this.getBaseBranch(), this.output, this.input, this.git);
                        return [4, branchUpToDateWithMaster.execute()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.assertBranchMeetsAllPrerequisites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allPrerequisites;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allPrerequisites = new branch_meets_all_prerequisites_1.BranchMeetsAllPrerequisites(this.output, this.config.prerequisites, this.input, new child_process_executor_1.ChildProcessExecutor());
                        return [4, allPrerequisites.execute()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.assertBranchMeetsAllQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questions, i, askAndAnswer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        questions = this.config.questions || [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < questions.length)) return [3, 4];
                        askAndAnswer = new question_1.Question(this.input, this.buildQuestion(i, questions.length + 2));
                        return [4, askAndAnswer.ask()];
                    case 2:
                        _a.sent();
                        this.output.ok("Answer on \"" + questions[i] + "\" was yes");
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.buildQuestion = function (questionIndex, max) {
        return questionIndex + 3 + "/" + max + ") " + this.config.questions[questionIndex] + " (yes/no/skip)";
    };
    ApplicationExecutor.prototype.denyPullRequest = function (currentCommitHash, e) {
        return __awaiter(this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorMessage = "Pull request on branch " + this.getBranch() + " was denied, because of: \"" + e.message + "\"";
                        return [4, this.restoreGitToPreviousState(currentCommitHash)];
                    case 1:
                        _a.sent();
                        this.output.error(errorMessage);
                        if (!this.notifier) return [3, 3];
                        return [4, this.notifyReviewerAboutDeniedPullRequest(errorMessage)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.restoreGitToPreviousState = function (commit) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.git.abortMerge()];
                    case 1:
                        _a.sent();
                        return [4, this.git.checkoutTo(commit)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        e_4 = _a.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.approvePullRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "Pull request on " + this.getBranch() + " was approved. Congratulations c:";
                        this.output.ok("\n" + message);
                        if (!this.notifier) return [3, 2];
                        return [4, this.notifier.notifySuccess(this.pullRequestAuthor, message)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    ApplicationExecutor.prototype.notifyReviewerAboutDeniedPullRequest = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var additionalMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.input.askUser("(Slack) Send message to the author? Add additional message for the author (or exit CTRL-C)")];
                    case 1:
                        additionalMessage = _a.sent();
                        return [4, this.notifier.notifyError(this.pullRequestAuthor, message + " Additional message: " + additionalMessage)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    return ApplicationExecutor;
}());
exports.ApplicationExecutor = ApplicationExecutor;
var GitStatusIsNotClean = (function (_super) {
    __extends(GitStatusIsNotClean, _super);
    function GitStatusIsNotClean(errorMessage) {
        var _this = _super.call(this, errorMessage) || this;
        Object.setPrototypeOf(_this, GitStatusIsNotClean.prototype);
        return _this;
    }
    return GitStatusIsNotClean;
}(Error));
//# sourceMappingURL=application-executor.js.map