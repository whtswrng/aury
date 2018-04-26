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
var child_process_executor_1 = require("./services/command-executor/child-process-executor");
var branch_up_to_date_with_base_branch_1 = require("./core/branch-up-to-date-with-base-branch");
var branch_meets_all_prerequisites_1 = require("./core/branch-meets-all-prerequisites");
var Application = (function () {
    function Application(input, output, git, config, statusStorage, reviewStorage, notifier, questionParser, finalStage) {
        this.input = input;
        this.output = output;
        this.git = git;
        this.config = config;
        this.statusStorage = statusStorage;
        this.reviewStorage = reviewStorage;
        this.notifier = notifier;
        this.questionParser = questionParser;
        this.finalStage = finalStage;
    }
    Application.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentCommitHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.notifier.setBranch(this.getBranch());
                        return [4, this.git.getCurrentCommitHash()];
                    case 1:
                        currentCommitHash = _a.sent();
                        return [4, this.notifyUserIfGitStatusIsNotClean()];
                    case 2:
                        _a.sent();
                        this.handleForceQuit(currentCommitHash);
                        return [4, this.startProcessing(currentCommitHash)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Application.prototype.checkPrerequisites = function () {
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
    Application.prototype.checkQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.assertBranchMeetsAllQuestions()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_2 = _a.sent();
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    Application.prototype.handleForceQuit = function (currentCommitHash) {
        var _this = this;
        process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.output.warning('\nReseting git to previous state.');
                        console.log(currentCommitHash);
                        return [4, this.restoreGitToPreviousState(currentCommitHash)];
                    case 1:
                        _a.sent();
                        process.exit();
                        return [2];
                }
            });
        }); });
    };
    Application.prototype.startProcessing = function (currentCommitHash) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 10]);
                        return [4, this.notifyAuthorAboutCodeReview()];
                    case 1:
                        _a.sent();
                        return [4, this.statusStorage.addCodeReviewToInProgress(this.getBranch(), this.getBaseBranch(), this.getDescription())];
                    case 2:
                        _a.sent();
                        return [4, this.checkAllRules()];
                    case 3:
                        _a.sent();
                        return [4, this.restoreGitToPreviousState(currentCommitHash)];
                    case 4:
                        _a.sent();
                        return [4, this.finishReview()];
                    case 5:
                        _a.sent();
                        return [4, this.statusStorage.removeCodeReviewFromInProgress(this.getBranch(), this.getBaseBranch())];
                    case 6:
                        _a.sent();
                        return [4, this.reviewStorage.addFinishedReview(this.getBranch(), this.getBaseBranch())];
                    case 7:
                        _a.sent();
                        return [3, 10];
                    case 8:
                        e_3 = _a.sent();
                        return [4, this.denyPullRequest(currentCommitHash, e_3)];
                    case 9:
                        _a.sent();
                        return [3, 10];
                    case 10: return [2];
                }
            });
        });
    };
    Application.prototype.notifyUserIfGitStatusIsNotClean = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.checkIfGitStatusIsClean()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        this.output.warning('Git status is not clean! Aury could be in trouble because of that!');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    Application.prototype.notifyAuthorAboutCodeReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.notifier.askOnPullRequestAuthor()];
                    case 1:
                        _a.sent();
                        return [4, this.statusStorage.isCodeReviewInProgress(this.getBranch(), this.getBaseBranch())];
                    case 2:
                        if (!!(_a.sent())) return [3, 4];
                        return [4, this.notifyAuthorAboutStartingReview()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    Application.prototype.notifyAuthorAboutStartingReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4, this.notifier.notifyAuthorAboutStartingReview()];
                    case 1:
                        _a.sent();
                        return [3, 4];
                    case 2:
                        e_5 = _a.sent();
                        this.output.error('User not found, please try again.');
                        return [4, this.notifyAuthorAboutCodeReview()];
                    case 3:
                        _a.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    Application.prototype.getBranch = function () {
        return process.argv[2];
    };
    Application.prototype.getBaseBranch = function () {
        return this.config.baseBranch;
    };
    Application.prototype.getDescription = function () {
        return process.argv[3] || 'no description';
    };
    Application.prototype.checkIfGitStatusIsClean = function () {
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
    Application.prototype.checkAllRules = function () {
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
    Application.prototype.assertBranchIsMergeableWithBaseBranch = function () {
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
    Application.prototype.getQuestions = function () {
        if (this.config && this.config.questions) {
            return this.config.questions;
        }
        return [];
    };
    Application.prototype.getPrerequisites = function () {
        if (this.config && this.config.prerequisites) {
            return this.config.prerequisites;
        }
        return [];
    };
    Application.prototype.assertBranchMeetsAllPrerequisites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allPrerequisites;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allPrerequisites = new branch_meets_all_prerequisites_1.BranchMeetsAllPrerequisites(this.output, this.getPrerequisites(), this.input, new child_process_executor_1.ChildProcessExecutor());
                        return [4, allPrerequisites.execute()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Application.prototype.assertBranchMeetsAllQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var questions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        questions = this.getQuestions();
                        return [4, this.questionParser.process(questions)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Application.prototype.denyPullRequest = function (currentCommitHash, e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.finalStage.finish()];
                    case 1:
                        _a.sent();
                        return [4, this.restoreGitToPreviousState(currentCommitHash)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Application.prototype.restoreGitToPreviousState = function (commit) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 5]);
                        return [4, this.git.abortMerge()];
                    case 1:
                        _a.sent();
                        return [4, this.git.checkoutTo(commit)];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3:
                        e_6 = _a.sent();
                        return [4, this.git.checkoutTo(commit)];
                    case 4:
                        _a.sent();
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    Application.prototype.finishReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.finalStage.finish()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return Application;
}());
exports.Application = Application;
var GitStatusIsNotClean = (function (_super) {
    __extends(GitStatusIsNotClean, _super);
    function GitStatusIsNotClean(errorMessage) {
        var _this = _super.call(this, errorMessage) || this;
        Object.setPrototypeOf(_this, GitStatusIsNotClean.prototype);
        return _this;
    }
    return GitStatusIsNotClean;
}(Error));
//# sourceMappingURL=application.js.map