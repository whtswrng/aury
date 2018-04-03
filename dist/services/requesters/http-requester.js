"use strict";
exports.__esModule = true;
var http = require("request-promise-native");
var SimpleHttpClient = (function () {
    function SimpleHttpClient() {
    }
    SimpleHttpClient.prototype.post = function (url, payload) {
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
    return SimpleHttpClient;
}());
exports.SimpleHttpClient = SimpleHttpClient;
//# sourceMappingURL=http-requester.js.map