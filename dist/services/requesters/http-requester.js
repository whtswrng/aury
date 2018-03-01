"use strict";
exports.__esModule = true;
var http = require("request-promise-native");
var HttpRequester = (function () {
    function HttpRequester() {
    }
    HttpRequester.prototype.post = function (url, payload) {
        var options = {
            method: 'POST',
            uri: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: payload,
            json: true
        };
        return http.post(options);
    };
    return HttpRequester;
}());
exports.HttpRequester = HttpRequester;
//# sourceMappingURL=http-requester.js.map