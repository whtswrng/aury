import {readFile, writeFile} from "fs";

const STATUS_FILE = '/status';

export class StatusStorage {

    constructor(private DIRECTORY: string) {

    }

    public async getStatus(): Promise<Status>{
        try {
            await this.createStatusFileIfDoesNotExist();
            const fileContent = await readFilePromisified(this.DIRECTORY + STATUS_FILE);
            return JSON.parse(fileContent) as Status;
        } catch (e) {
            throw new Error('Config file is corrupted!');
        }
    }

    public async addCodeReviewToInProgress(branch, baseBranch): Promise<void>{
        const parsedContent = await this.getStatus();

        if (!parsedContent.inProgress) {
            parsedContent.inProgress = [];
            await this.saveStatus(parsedContent);
        } else {
            await this.addCodeReviewIfDoesNotExist(parsedContent, branch, baseBranch);
        }
    }

    public async removeCodeReviewFromInProgress(branch, baseBranch): Promise<void>{
        const parsedContent = await this.getStatus();
        const codeReviewIndex = await this.findExistingCodeReviewIndex(branch, baseBranch);

        if(codeReviewIndex !== -1) {
            parsedContent.inProgress.splice(codeReviewIndex, 1);
            await this.saveStatus(parsedContent);
        }
    }

    public async isCodeReviewInProgress(branch, baseBranch): Promise<boolean> {
        return await this.findExistingCodeReviewIndex(branch, baseBranch) !== -1;
    }

    private async addCodeReviewIfDoesNotExist(parsedContent: Status, branch, baseBranch) {
        const codeReviewIndex = await this.findExistingCodeReviewIndex(branch, baseBranch);

        if(codeReviewIndex === -1) {
            parsedContent.inProgress.push({branch, baseBranch});
            await this.saveStatus(parsedContent);
        }
    }

    private async findExistingCodeReviewIndex(branch, baseBranch) {
        const parsedContent = await this.getStatus();
        let index = -1;

        parsedContent.inProgress.forEach((record, _index) => {
            if(record.branch === branch && record.baseBranch === baseBranch) {
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
    inProgress: Array<any>;
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
