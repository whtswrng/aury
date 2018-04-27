"use strict";
exports.__esModule = true;
var child = require("child_process");
var ChildProcessExecutor = (function () {
    function ChildProcessExecutor() {
    }
    ChildProcessExecutor.prototype.exec = function (command) {
        return new Promise(function (resolve, reject) {
            child.exec(command, { maxBuffer: 1024 * 650 }, function (err, stdout, stderr) {
                if (err) {
                    return reject(new Error(stderr || stdout || err.message));
                }
                resolve(stdout);
            });
        });
    };
    return ChildProcessExecutor;
}());
exports.ChildProcessExecutor = ChildProcessExecutor;
//# sourceMappingURL=child-process-executor.js.map