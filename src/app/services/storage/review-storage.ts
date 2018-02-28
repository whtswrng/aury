import {readFile, writeFile} from "fs";

const REVIEWS_FILE = '/reviews';

export class ReviewStorage {

    constructor(private DIRECTORY: string) {

    }

    public async getMonthReviews(): Promise<Array<CodeReview>> {
        try {
            await this.createReviewsFileIfDoesNotExist();
            const fileContent = await readFilePromisified(this.DIRECTORY + REVIEWS_FILE);
            const reviews = JSON.parse(fileContent) as Reviews;
            return reviews.monthly[this.getCurrentMonth()];

        } catch (e) {
            throw new Error('Config file is corrupted!');
        }
    }

    public async getReviews(): Promise<Reviews> {
        try {
            await this.createReviewsFileIfDoesNotExist();
            const fileContent = await readFilePromisified(this.DIRECTORY + REVIEWS_FILE);
            return JSON.parse(fileContent) as Reviews;
        } catch (e) {
            throw new Error('Config file is corrupted!');
        }
    }

    private async createReviewsFileIfDoesNotExist(): Promise<void> {
        await createFileIfDoesNotExist(this.DIRECTORY + REVIEWS_FILE, JSON.stringify({monthly: {}}));
    }

    public async addFinishedReview(branch: string, baseBranch: string): Promise<void> {
        const reviews = await this.getReviews();

        if (!reviews.monthly[this.getCurrentMonth()]) {
            reviews.monthly[this.getCurrentMonth()] = [];
        }

        reviews.monthly[this.getCurrentMonth()].push({branch, baseBranch});

        await writeToFilePromisified(this.DIRECTORY + REVIEWS_FILE, JSON.stringify(reviews));
    }

    private getCurrentMonth(): number {
        return new Date().getMonth();
    }

}

export interface Reviews {
    monthly: { [month: number]: Array<CodeReview> };
}

export interface CodeReview {
    branch: string;
    baseBranch: string;
    description?: string;
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
