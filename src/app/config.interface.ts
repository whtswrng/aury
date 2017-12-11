export interface IConfig {
    prerequisites: prerequisites;
    tokens: {
        slack: string;
    }
}

export type prerequisites = Array<string>;