import {INotifier} from "./notifier.interface";

export class DummyNotifier implements INotifier {

    notifyAuthorAboutApprovedPullRequest(branch: string): Promise<void> {
        return null;
    }

    notifyAuthorAboutDeniedPullRequest(branch: string, errorMessage: string): Promise<void> {
        return null;
    }
    notifyAuthorAboutStartingReview(branch: string): Promise<void> {
        return null;
    }
    askOnPullRequestAuthor(): Promise<void> {
        return null;
    }

}