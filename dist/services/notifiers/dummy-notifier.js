"use strict";
exports.__esModule = true;
var DummyNotifier = (function () {
    function DummyNotifier() {
    }
    DummyNotifier.prototype.notifyAuthorAboutReviewedPullRequest = function () {
        return null;
    };
    DummyNotifier.prototype.setBranch = function (branch) {
    };
    DummyNotifier.prototype.notifyAuthorAboutApprovedPullRequest = function () {
        return null;
    };
    DummyNotifier.prototype.notifyAuthorAboutDeniedPullRequest = function (errorMessage) {
        console.log(errorMessage);
        return null;
    };
    DummyNotifier.prototype.notifyAuthorAboutStartingReview = function () {
        return null;
    };
    DummyNotifier.prototype.askOnPullRequestAuthor = function () {
        return null;
    };
    return DummyNotifier;
}());
exports.DummyNotifier = DummyNotifier;
//# sourceMappingURL=dummy-notifier.js.map