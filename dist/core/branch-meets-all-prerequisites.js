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
var BranchMeetsAllPrerequisites = (function () {
    function BranchMeetsAllPrerequisites(output, prerequisites, input, commandExecutor) {
        this.output = output;
        this.prerequisites = prerequisites;
        this.input = input;
        this.commandExecutor = commandExecutor;
    }
    BranchMeetsAllPrerequisites.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.output.info("Are all prerequisites passing?");
                        return [4, this.runPrerequisites(this.prerequisites)];
                    case 1:
                        _a.sent();
                        this.output.ok('Branch successfully meets all prerequisites.');
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.output.error("Some prerequisite is not passing.");
                        throw e_1;
                    case 3: return [2];
                }
            });
        });
    };
    BranchMeetsAllPrerequisites.prototype.runPrerequisites = function (scripts) {
        return __awaiter(this, void 0, void 0, function () {
            var script;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (scripts.length === 0) {
                            return [2];
                        }
                        script = scripts.shift();
                        this.output.info("    running script \"" + script + "\", " + scripts.length + " are left.");
                        return [4, this.runScript(script)];
                    case 1:
                        _a.sent();
                        this.output.ok("    script \"" + script + "\" successfully proceeded.");
                        if (scripts.length > 0) {
                            return [2, this.runPrerequisites(scripts)];
                        }
                        return [2];
                }
            });
        });
    };
    BranchMeetsAllPrerequisites.prototype.runScript = function (script) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4, this.commandExecutor.exec(script)];
                    case 1:
                        _a.sent();
                        return [3, 4];
                    case 2:
                        e_2 = _a.sent();
                        this.output.error(e_2.message);
                        return [4, this.askForRetry(script)];
                    case 3:
                        _a.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    BranchMeetsAllPrerequisites.prototype.askForRetry = function (script) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.input.askUser('Do you want to run this script again? (yes/no/skip)')];
                    case 1:
                        answer = _a.sent();
                        if (!(answer === 'yes')) return [3, 3];
                        return [4, this.runScript(script)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        if (answer === 'skip') {
                        }
                        else {
                            throw new Error("script \"" + script + "\" has not finished well.");
                        }
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    return BranchMeetsAllPrerequisites;
}());
exports.BranchMeetsAllPrerequisites = BranchMeetsAllPrerequisites;
//# sourceMappingURL=branch-meets-all-prerequisites.js.map