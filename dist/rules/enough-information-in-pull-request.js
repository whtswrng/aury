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
exports.__esModule = true;
var ask_and_answer_rule_1 = require("./ask-and-answer-rule");
var EnoughInformationInPullRequest = (function (_super) {
    __extends(EnoughInformationInPullRequest, _super);
    function EnoughInformationInPullRequest(printer, input) {
        var _this = _super.call(this, input, '2/6 Has pull request enough information to understand the problem? (yes/no)') || this;
        _this.printer = printer;
        _this.input = input;
        return _this;
    }
    EnoughInformationInPullRequest.prototype.rejectRule = function () {
        throw new Error('Pull request has not enough information for a reviewer to understand the problem.');
    };
    EnoughInformationInPullRequest.prototype.resolveRule = function () {
        return this.printer.ok('2) Pull request has properly described the problem.');
    };
    return EnoughInformationInPullRequest;
}(ask_and_answer_rule_1.AskAndAnswerRule));
exports.EnoughInformationInPullRequest = EnoughInformationInPullRequest;
//# sourceMappingURL=enough-information-in-pull-request.js.map