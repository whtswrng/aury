import {ListQuestion} from "./inquirer-question-parser";

export interface QuestionParser {
    process(questions: Array<string> | ListQuestion): Promise<void>;
}