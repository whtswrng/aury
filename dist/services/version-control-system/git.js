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
var Git = (function () {
    function Git(commandExecutor) {
        this.commandExecutor = commandExecutor;
    }
    Git.prototype.isGitStatusClean = function () {
        return __awaiter(this, void 0, void 0, function () {
            var output, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git status --porcelain")];
                    case 1:
                        output = _a.sent();
                        return [2, output.length === 0];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error("Git status is not clean. " + e_1.message);
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.getCurrentCommitHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git rev-parse HEAD")];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error("Something went wrong while getting a commit hash. " + e_2.message);
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.checkoutTo = function (commitOrBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git checkout " + commitOrBranch)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error("Commit or branch \"" + commitOrBranch + "\" does not exists");
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.abortMerge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git merge --abort")];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        throw new Error("Merge cannot be aborted.");
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.mergeFastForward = function (to, from) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git merge origin/" + to + " origin/" + from + " --no-commit")];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_5 = _a.sent();
                        throw new Error("branch \"" + from + "\" cannot be merged with \"" + to + "\".");
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.hardResetWithOrigin = function (branch) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git reset --hard origin/" + branch)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_6 = _a.sent();
                        throw new Error("branch \"" + branch + "\" cannot be reset --hard with origin.");
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.pull = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git pull")];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_7 = _a.sent();
                        throw new Error(e_7);
                    case 3: return [2];
                }
            });
        });
    };
    Git.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commandExecutor.exec("git fetch")];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_8 = _a.sent();
                        throw new Error(e_8);
                    case 3: return [2];
                }
            });
        });
    };
    return Git;
}());
exports.Git = Git;
//# sourceMappingURL=git.js.map