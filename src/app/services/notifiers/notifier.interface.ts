export interface INotifier {
    askOnPullRequestAuthor(): Promise<void>
    notifyAuthorAboutStartingReview(branch: string): Promise<void>
    notifyAuthorAboutDeniedPullRequest(branch: string, errorMessage: string): Promise<void>
    notifyAuthorAboutApprovedPullRequest(branch: string): Promise<void>
}