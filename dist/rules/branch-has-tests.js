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
var question_1 = require("./question");
var BranchHasTests = (function (_super) {
    __extends(BranchHasTests, _super);
    function BranchHasTests(printer, input) {
        var _this = _super.call(this, input, '5/6 Has branch tests and are they properly testing the problem? (yes/no)') || this;
        _this.printer = printer;
        _this.input = input;
        return _this;
    }
    BranchHasTests.prototype.rejectRule = function () {
        throw new Error('5) Branch does not have tests or they are not properly testing the problem.');
    };
    BranchHasTests.prototype.resolveRule = function () {
        return this.printer.ok('5) Branch has tests and they are properly testing the problem.');
    };
    return BranchHasTests;
}(question_1.Question));
exports.BranchHasTests = BranchHasTests;
//# sourceMappingURL=branch-has-tests.js.map