export interface INotifier {
    setBranch(branch: string): void;
    askOnPullRequestAuthor(): Promise<void>
    notifyAuthorAboutStartingReview(): Promise<void>
    notifyAuthorAboutDeniedPullRequest(errorMessage: string): Promise<void>
    notifyAuthorAboutApprovedPullRequest(): Promise<void>
    notifyAuthorAboutReviewedPullRequest(): Promise<void>;
}