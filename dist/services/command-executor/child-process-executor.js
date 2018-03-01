"use strict";
exports.__esModule = true;
var child = require("child_process");
var ChildProcessExecutor = (function () {
    function ChildProcessExecutor() {
    }
    ChildProcessExecutor.prototype.exec = function (command) {
        return new Promise(function (resolve, reject) {
            child.exec(command, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    return ChildProcessExecutor;
}());
exports.ChildProcessExecutor = ChildProcessExecutor;
//# sourceMappingURL=child-process-executor.js.map