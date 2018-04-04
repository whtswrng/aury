import {INotifier} from "./notifier.interface";

export class DummyNotifier implements INotifier {

    notifyAuthorAboutReviewedPullRequest(): Promise<void> {
        return null;
    }
    setBranch(branch: string): void {
    }

    notifyAuthorAboutApprovedPullRequest(): Promise<void> {
        return null;
    }

    notifyAuthorAboutDeniedPullRequest(errorMessage: string): Promise<void> {
        console.log(errorMessage);
        return null;
    }

    notifyAuthorAboutStartingReview(): Promise<void> {
        return null;
    }

    askOnPullRequestAuthor(): Promise<void> {
        return null;
    }

}