import {readFile, writeFile} from "fs";
import {CodeReview} from "./review-storage";

const STATUS_FILE = '/status';

export class StatusStorage {

    constructor(private DIRECTORY: string) {

    }

    public async getStatus(): Promise<Status> {
        try {
            await this.createStatusFileIfDoesNotExist();
            const fileContent = await readFilePromisified(this.DIRECTORY + STATUS_FILE);
            return JSON.parse(fileContent) as Status;
        } catch (e) {
            throw new Error('Config file is corrupted!');
        }
    }

    public async addCodeReviewToInProgress(branch: string, baseBranch: string, description: string): Promise<void> {
        const status = await this.getStatus();

        if (!status.inProgress) {
            status.inProgress = [];
            await this.saveStatus(status);
        } else {
            await this.replaceExistingCodeReviewToInProgressIfExist(branch, baseBranch, description);
        }
    }

    private async replaceExistingCodeReviewToInProgressIfExist(branch: string, baseBranch: string, description: string) {
        const status = await this.getStatus();
        const pendingReview = await this.findExistingCodeReviewPendingIndex(branch, baseBranch);

        if (pendingReview !== -1) {
            const pendingDescription = status.pending[pendingReview].description;
            await this.removeCodeReviewFromInPending(branch, baseBranch);
            await this.addCodeReviewToInProgressIfDoesNotExist(branch, baseBranch, pendingDescription);
        } else {
            await this.addCodeReviewToInProgressIfDoesNotExist(branch, baseBranch, description);
        }
    }

    public async addPendingReview(branch: string, baseBranch: string, description: string): Promise<void> {
        const parsedContent = await this.getStatus();

        if (!parsedContent.pending) {
            parsedContent.pending = [];
            await this.saveStatus(parsedContent);
        } else {
            await this.addCodeReviewToPendingIfDoesNotExist(parsedContent, branch, baseBranch, description);
        }
    }

    private async addCodeReviewToPendingIfDoesNotExist(parsedContent: Status, branch, baseBranch, description) {
        const pendingIndex = await this.findExistingCodeReviewPendingIndex(branch, baseBranch);
        const inProgressIndex = await this.findExistingCodeReviewInProgressIndex(branch, baseBranch);

        if (inProgressIndex === -1 && pendingIndex === -1) {
            parsedContent.pending.push({branch, baseBranch, description});
            await this.saveStatus(parsedContent);
        }
    }

    public async removeCodeReviewFromInProgress(branch, baseBranch): Promise<void> {
        const parsedContent = await this.getStatus();
        const codeReviewIndex = await this.findExistingCodeReviewInProgressIndex(branch, baseBranch);

        if (codeReviewIndex !== -1) {
            parsedContent.inProgress.splice(codeReviewIndex, 1);
            await this.saveStatus(parsedContent);
        }
    }

    public async removeAllReviews(): Promise<void> {
        const parsedContent = await this.getStatus();

        parsedContent.pending = [];
        parsedContent.inProgress = [];

        await this.saveStatus(parsedContent);
    }

    public async removeCodeReviewFromInPending(branch, baseBranch): Promise<void> {
        const parsedContent = await this.getStatus();
        const codeReviewIndex = await this.findExistingCodeReviewPendingIndex(branch, baseBranch);

        if (codeReviewIndex !== -1) {
            parsedContent.pending.splice(codeReviewIndex, 1);
            await this.saveStatus(parsedContent);
        }
    }

    public async isCodeReviewInProgress(branch, baseBranch): Promise<boolean> {
        return await this.findExistingCodeReviewInProgressIndex(branch, baseBranch) !== -1;
    }

    private async addCodeReviewToInProgressIfDoesNotExist(branch, baseBranch, description) {
        const codeReviewIndex = await this.findExistingCodeReviewInProgressIndex(branch, baseBranch);
        const status = await this.getStatus();

        if (codeReviewIndex === -1) {
            status.inProgress.push({branch, baseBranch, description});
            await this.saveStatus(status);
        }
    }

    private async findExistingCodeReviewInProgressIndex(branch, baseBranch) {
        const status = await this.getStatus();
        let index = -1;

        if( ! status || !status.inProgress) {
            return -1;
        }

        status.inProgress.forEach((record, _index) => {
            if (record.branch === branch && record.baseBranch === baseBranch) {
                index = _index;
            }
        });

        return index;
    }

    private async findExistingCodeReviewPendingIndex(branch, baseBranch) {
        const status = await this.getStatus();
        let index = -1;

        if( ! status || !status.pending) {
            return -1;
        }

        status.pending.forEach((record, _index) => {
            if (record.branch === branch && record.baseBranch === baseBranch) {
                index = _index;
            }
        });

        return index;
    }

    private async createStatusFileIfDoesNotExist() {
        await createFileIfDoesNotExist(this.DIRECTORY + STATUS_FILE, JSON.stringify({inProgress: []}));
    }

    private async saveStatus(data) {
        await writeToFilePromisified(this.DIRECTORY + STATUS_FILE, JSON.stringify(data));
    }

}

export interface Status {
    inProgress: Array<CodeReview>;
    pending: Array<CodeReview>;
}

export function readFilePromisified(filePath): Promise<string> {
    return new Promise((resolve, reject) => {
        readFile(filePath, (err, data) => {
            return !err && !!data ? resolve(data.toString()) : reject(err);
        })
    });
}

export function writeToFilePromisified(filePath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        writeFile(filePath, data, {flag: 'w'}, (err) => {
            return !err ? resolve() : reject(err);
        })
    });
}

export function createFileIfDoesNotExist(filePath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        writeFile(filePath, data, {flag: 'wx'}, (err) => {
            resolve();
        })
    });
}
