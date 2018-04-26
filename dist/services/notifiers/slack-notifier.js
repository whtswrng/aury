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
var SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';
var SlackNotifier = (function () {
    function SlackNotifier(token, input, httpClient) {
        this.token = token;
        this.input = input;
        this.httpClient = httpClient;
    }
    SlackNotifier.prototype.notifyAuthorAboutReviewedPullRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.notifyInfo(this.pullRequestAuthor, "Someone finished review of your pull request on branch " + this.branch + ".")];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.setBranch = function (branch) {
        this.branch = branch;
    };
    SlackNotifier.prototype.notifyAuthorAboutApprovedPullRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = "Pull request on " + this.branch + " was approved.";
                        return [4, this.notifySuccess(this.pullRequestAuthor, message)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.notifyAuthorAboutStartingReview = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.notifyInfo(this.pullRequestAuthor, "Just letting you know that someone is working on your pull request on branch " + this.branch + ".")];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.notifyAuthorAboutDeniedPullRequest = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var additionalMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.input.askUser("(Slack) Send message about denial to the author? (yes = enter, no = CTRL+C). Additional message to the author:")];
                    case 1:
                        additionalMessage = _a.sent();
                        return [4, this.notifyError(this.pullRequestAuthor, message + ". " + additionalMessage)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.askOnPullRequestAuthor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, this.input.askUser('Type slack user name of the author of pull request: ')];
                    case 1:
                        _a.pullRequestAuthor = _b.sent();
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.notifySuccess = function (user, message) {
        var payload = {
            token: this.token,
            channel: "@" + user,
            text: ":white_check_mark: " + message
        };
        try {
            return this.httpClient.post(SLACK_POST_MESSAGE_URL, payload);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    };
    SlackNotifier.prototype.notifyError = function (user, message) {
        var payload = {
            token: this.token,
            channel: "@" + user,
            text: ":red_circle: " + message + ". I am sure there are more information about the state of pull request" +
                "on github or the reviewer will contact you. :c"
        };
        try {
            return this.httpClient.post(SLACK_POST_MESSAGE_URL, payload);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    };
    SlackNotifier.prototype.notifyInfo = function (user, message) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            token: this.token,
                            channel: "@" + user,
                            text: ":information_source: " + message
                        };
                        return [4, this.httpClient.post(SLACK_POST_MESSAGE_URL, payload)];
                    case 1:
                        response = _a.sent();
                        this.assertResponseIsOK(response);
                        return [2];
                }
            });
        });
    };
    SlackNotifier.prototype.assertResponseIsOK = function (response) {
        if (!response.ok) {
            throw new Error('User not found.');
        }
    };
    return SlackNotifier;
}());
exports.SlackNotifier = SlackNotifier;
//# sourceMappingURL=slack-notifier.js.map