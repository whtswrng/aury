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
var BranchHasCleanDesignAndCode = (function (_super) {
    __extends(BranchHasCleanDesignAndCode, _super);
    function BranchHasCleanDesignAndCode(printer, input) {
        var _this = _super.call(this, input, '6/6 Has branch clean design and code? (yes/no)') || this;
        _this.printer = printer;
        _this.input = input;
        return _this;
    }
    BranchHasCleanDesignAndCode.prototype.rejectRule = function () {
        throw new Error('6) Branch has not clean design and code.');
    };
    BranchHasCleanDesignAndCode.prototype.resolveRule = function () {
        return this.printer.ok('2) Pull request has properly described the problem.');
    };
    return BranchHasCleanDesignAndCode;
}(ask_and_answer_rule_1.AskAndAnswerRule));
exports.BranchHasCleanDesignAndCode = BranchHasCleanDesignAndCode;
//# sourceMappingURL=branch-has-clean-design-and-code.js.map