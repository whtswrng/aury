"use strict";
exports.__esModule = true;
var Help = (function () {
    function Help(output) {
        this.output = output;
    }
    Help.prototype.print = function () {
        this.printIntroduction();
        this.printOptions();
    };
    Help.prototype.printIntroduction = function () {
        this.output.log('' +
            'Usage: aury [$BRANCH] [options]\n' +
            '       aury DSP-2804\n' +
            '       aury --status\n');
    };
    Help.prototype.printOptions = function () {
        this.output.log('Options: ');
        this.printOption('--status', '                 print code reviews in progress or pending');
        this.printOption('--reviews', '                print finished code reviews for current month');
        this.printOption('--add $BRANCH', '            add $BRANCH to pending code review');
        this.printOption('--delete $BRANCH', '         delete code review on $BRANCH from in progress or pending');
        this.printOption('--help', '                   print usage and options information');
    };
    Help.prototype.printOption = function (name, description) {
        this.output.log("       " + name + description);
    };
    return Help;
}());
exports.Help = Help;
//# sourceMappingURL=help.js.map