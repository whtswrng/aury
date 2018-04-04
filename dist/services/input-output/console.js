"use strict";
exports.__esModule = true;
var Console = (function () {
    function Console(stringColorizer) {
        this.stringColorizer = stringColorizer;
    }
    Console.prototype.separate = function () {
        console.log('------------------------------------------');
    };
    Console.prototype.info = function (string) {
        console.log(this.stringColorizer.info(string));
    };
    Console.prototype.error = function (string) {
        console.log(this.stringColorizer.error("\u2718    " + string));
    };
    Console.prototype.warning = function (string) {
        console.log(this.stringColorizer.warning("" + string));
    };
    Console.prototype.ok = function (string) {
        console.log(this.stringColorizer.ok("    " + string));
    };
    Console.prototype.log = function (string) {
        console.log(string);
    };
    return Console;
}());
exports.Console = Console;
//# sourceMappingURL=console.js.map