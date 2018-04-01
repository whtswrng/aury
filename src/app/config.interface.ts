export interface IConfig {
    prerequisites: prerequisites;
    questions: Array<string>;
    baseBranch: string;
    tokens: {
        slack: string;
    }
}

export type prerequisites = Array<string>;