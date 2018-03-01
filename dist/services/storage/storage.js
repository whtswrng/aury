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
var fs_1 = require("fs");
var STATUS_FILE = '/status';
var Storage = (function () {
    function Storage(DIRECTORY) {
        this.DIRECTORY = DIRECTORY;
    }
    Storage.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileContent, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.createStatusFileIfDoesNotExist()];
                    case 1:
                        _a.sent();
                        return [4, readFilePromisified(this.DIRECTORY + STATUS_FILE)];
                    case 2:
                        fileContent = _a.sent();
                        return [2, JSON.parse(fileContent)];
                    case 3:
                        e_1 = _a.sent();
                        throw new Error('Config file is corrupted!');
                    case 4: return [2];
                }
            });
        });
    };
    Storage.prototype.addCodeReviewToInProgress = function (branch, baseBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getStatus()];
                    case 1:
                        parsedContent = _a.sent();
                        if (!!parsedContent.inProgress) return [3, 3];
                        parsedContent.inProgress = [];
                        return [4, this.saveStatus(parsedContent)];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3: return [4, this.addCodeReviewToInProgressIfDoesNotExist(parsedContent, branch, baseBranch)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    Storage.prototype.removeCodeReviewFromInProgress = function (branch, baseBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedContent, codeReviewIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getStatus()];
                    case 1:
                        parsedContent = _a.sent();
                        return [4, this.findExistingCodeReviewInProgressIndex(branch, baseBranch)];
                    case 2:
                        codeReviewIndex = _a.sent();
                        if (!(codeReviewIndex !== -1)) return [3, 4];
                        parsedContent.inProgress.splice(codeReviewIndex, 1);
                        return [4, this.saveStatus(parsedContent)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    Storage.prototype.isCodeReviewInProgress = function (branch, baseBranch) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.findExistingCodeReviewInProgressIndex(branch, baseBranch)];
                    case 1: return [2, (_a.sent()) !== -1];
                }
            });
        });
    };
    Storage.prototype.addCodeReviewIfDoesNotExist = function (parsedContent, branch, baseBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var codeReviewIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.findExistingCodeReviewInProgressIndex(branch, baseBranch)];
                    case 1:
                        codeReviewIndex = _a.sent();
                        if (!(codeReviewIndex === -1)) return [3, 3];
                        parsedContent.inProgress.push({ branch: branch, baseBranch: baseBranch });
                        return [4, this.saveStatus(parsedContent)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    Storage.prototype.findExistingCodeReviewIndex = function (branch, baseBranch) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedContent, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getStatus()];
                    case 1:
                        parsedContent = _a.sent();
                        index = -1;
                        parsedContent.inProgress.forEach(function (record, _index) {
                            if (record.branch === branch && record.baseBranch === baseBranch) {
                                index = _index;
                            }
                        });
                        return [2, index];
                }
            });
        });
    };
    Storage.prototype.createStatusFileIfDoesNotExist = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, createFileIfDoesNotExist(this.DIRECTORY + STATUS_FILE, JSON.stringify({ inProgress: [] }))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Storage.prototype.saveStatus = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, writeToFilePromisified(this.DIRECTORY + STATUS_FILE, JSON.stringify(data))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return Storage;
}());
exports.Storage = Storage;
function readFilePromisified(filePath) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(filePath, function (err, data) {
            return !err && !!data ? resolve(data.toString()) : reject(err);
        });
    });
}
exports.readFilePromisified = readFilePromisified;
function writeToFilePromisified(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs_1.writeFile(filePath, data, { flag: 'w' }, function (err) {
            return !err ? resolve() : reject(err);
        });
    });
}
exports.writeToFilePromisified = writeToFilePromisified;
function createFileIfDoesNotExist(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs_1.writeFile(filePath, data, { flag: 'wx' }, function (err) {
            resolve();
        });
    });
}
exports.createFileIfDoesNotExist = createFileIfDoesNotExist;
//# sourceMappingURL=storage.js.map