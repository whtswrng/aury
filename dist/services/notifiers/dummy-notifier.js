"use strict";
exports.__esModule = true;
var DummyNotifier = (function () {
    function DummyNotifier() {
    }
    DummyNotifier.prototype.notifyAuthorAboutApprovedPullRequest = function (branch) {
        return null;
    };
    DummyNotifier.prototype.notifyAuthorAboutDeniedPullRequest = function (branch, errorMessage) {
        console.log(errorMessage);
        return null;
    };
    DummyNotifier.prototype.notifyAuthorAboutStartingReview = function (branch) {
        return null;
    };
    DummyNotifier.prototype.askOnPullRequestAuthor = function () {
        return null;
    };
    return DummyNotifier;
}());
exports.DummyNotifier = DummyNotifier;
//# sourceMappingURL=dummy-notifier.js.map