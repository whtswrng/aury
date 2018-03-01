"use strict";
exports.__esModule = true;
var colors = require("colors");
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'cyan',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    ok: 'green',
    error: 'red'
});
var StringColorizer = (function () {
    function StringColorizer() {
    }
    StringColorizer.prototype.info = function (string) {
        return string.info;
    };
    StringColorizer.prototype.warning = function (string) {
        return string.warn;
    };
    StringColorizer.prototype.error = function (string) {
        return string.error;
    };
    StringColorizer.prototype.ok = function (string) {
        return string.ok;
    };
    return StringColorizer;
}());
exports.StringColorizer = StringColorizer;
//# sourceMappingURL=string-colorizer.js.map