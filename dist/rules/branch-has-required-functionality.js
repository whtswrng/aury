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
var BranchHasRequiredFunctionality = (function (_super) {
    __extends(BranchHasRequiredFunctionality, _super);
    function BranchHasRequiredFunctionality(printer, input) {
        var _this = _super.call(this, input, '4/6 Has branch required functionality (Does the code solved the problem)? (yes/no)') || this;
        _this.printer = printer;
        _this.input = input;
        return _this;
    }
    BranchHasRequiredFunctionality.prototype.rejectRule = function () {
        throw new Error('4) Branch has not required functionality.');
    };
    BranchHasRequiredFunctionality.prototype.resolveRule = function () {
        return this.printer.ok('4) Branch has required functionality.');
    };
    return BranchHasRequiredFunctionality;
}(question_1.Question));
exports.BranchHasRequiredFunctionality = BranchHasRequiredFunctionality;
//# sourceMappingURL=branch-has-required-functionality.js.map