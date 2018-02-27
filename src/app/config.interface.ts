export interface IConfig {
    prerequisites: prerequisites;
    questions: Array<string>;
    tokens: {
        slack: string;
    }
}

export type prerequisites = Array<string>;