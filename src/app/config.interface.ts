import {ListQuestion} from "./services/question-parser/inquirer-question-parser";

export interface IConfig {
    prerequisites: prerequisites;
    questions: Array<string> | ListQuestion;
    baseBranch: string;
    tokens: {
        slack: string;
    }
}

export type prerequisites = Array<string>;