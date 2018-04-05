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
var InquirerQuestionParser = (function () {
    function InquirerQuestionParser(inquirer, output) {
        this.inquirer = inquirer;
        this.output = output;
    }
    InquirerQuestionParser.prototype.process = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Array.isArray(questions)) return [3, 2];
                        return [4, this.processConfirmQuestions(questions.slice())];
                    case 1:
                        _a.sent();
                        return [3, 4];
                    case 2: return [4, this.processListQuestions(questions)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.processConfirmQuestions = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertConfirmQuestionsAreValid(questions);
                        if (questions.length === 0) {
                            return [2];
                        }
                        return [4, this.askQuestions(questions)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.askQuestions = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            var question, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        question = questions.shift();
                        return [4, this.inquirer.prompt([this.transformConfirmQuestion(question)])];
                    case 1:
                        answer = _a.sent();
                        return [4, this.assertAnswer(answer)];
                    case 2:
                        _a.sent();
                        return [4, this.processConfirmQuestions(questions)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.assertAnswer = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            var answer_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!answer.confirm) return [3, 2];
                        this.output.separate();
                        return [4, this.askForContinueWithReview()];
                    case 1:
                        answer_1 = _a.sent();
                        this.output.separate();
                        this.assertContinueWithReview(answer_1);
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.assertContinueWithReview = function (answer) {
        if (!answer.confirm) {
            throw new Error("Review was stopped by user.");
        }
    };
    InquirerQuestionParser.prototype.askForContinueWithReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.inquirer.prompt([{
                                type: 'confirm',
                                name: 'confirm',
                                message: 'Do you want to continue with review?'
                            }])];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.processListQuestions = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.assertListQuestionIsValid(question);
                        return [4, this.inquirer.prompt(this.transformListQuestion(question))];
                    case 1:
                        answer = _a.sent();
                        if (!this.answerMatchOtherChoicesInQuestion(answer, question)) return [3, 3];
                        return [4, this.processAgain(answer, question)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.answerMatchOtherChoicesInQuestion = function (answer, question) {
        return this.getNextQuestionIndexByAnswer(answer, question) !== -1;
    };
    InquirerQuestionParser.prototype.getNextQuestionIndexByAnswer = function (answer, question) {
        return question.choices.findIndex(function (choice) { return choice.message === answer.selectedItem; });
    };
    InquirerQuestionParser.prototype.processAgain = function (answer, question) {
        return __awaiter(this, void 0, void 0, function () {
            var nextQuestionIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextQuestionIndex = this.getNextQuestionIndexByAnswer(answer, question);
                        return [4, this.process(question.choices[nextQuestionIndex].values)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    InquirerQuestionParser.prototype.assertConfirmQuestionsAreValid = function (questions) {
        questions.forEach(function (question) {
            if (typeof question !== 'string') {
                throw new IncorrectFormatError("Incorrect format, string expected, " + typeof question + " given: " + JSON.stringify(question, null, 2));
            }
        });
    };
    InquirerQuestionParser.prototype.assertListQuestionIsValid = function (question) {
        if (typeof question !== 'object') {
            throw new IncorrectFormatError("Incorrect format, object expected, " + typeof question + " given");
        }
        if (typeof question.message !== 'string' || !Array.isArray(question.choices)) {
            throw new IncorrectFormatError("Incorrect format of list question!");
        }
    };
    InquirerQuestionParser.prototype.transformConfirmQuestion = function (question) {
        return {
            type: 'confirm',
            name: 'confirm',
            message: question
        };
    };
    InquirerQuestionParser.prototype.transformListQuestion = function (question) {
        return {
            message: question.message,
            type: 'list',
            name: 'selectedItem',
            choices: question.choices.map(function (choice) { return choice.message; })
        };
    };
    return InquirerQuestionParser;
}());
exports.InquirerQuestionParser = InquirerQuestionParser;
var IncorrectFormatError = (function (_super) {
    __extends(IncorrectFormatError, _super);
    function IncorrectFormatError(msg) {
        var _this = _super.call(this, msg) || this;
        Object.setPrototypeOf(_this, IncorrectFormatError.prototype);
        return _this;
    }
    return IncorrectFormatError;
}(Error));
exports.IncorrectFormatError = IncorrectFormatError;
//# sourceMappingURL=inquirer-question-parser.js.map