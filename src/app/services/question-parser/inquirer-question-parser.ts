import {Inquirer} from "inquirer";
import {QuestionParser} from "./question-parser";

export class InquirerQuestionParser implements QuestionParser{

    constructor(private inquirer: Inquirer) {

    }

    public async process(questions: Array<string> | ListQuestion): Promise<void> {
        if(Array.isArray(questions)) {
            await this.processSimpleChoices(questions);
        } else {
            await this.processListChoices(questions);
        }
    }

    private processSimpleChoices(questions: Array<string>) {
        this.assertQuestionsAreValid(questions);
        this.inquirer.prompt(this.transformConfirmQuestions(questions) as any);
    }

    private async processListChoices(question: ListQuestion) {
        this.assertListQuestionIsValid(question);
        const answer = await this.inquirer.prompt(this.transformListQuestion(question) as any) as Answer;

        if(this.answerMatchOtherChoicesInQuestion(answer, question)) {
            await this.processAgain(answer, question);
        }
    }

    private answerMatchOtherChoicesInQuestion(answer: any, question: ListQuestion): boolean {
        return this.getNextQuestionIndexByAnswer(answer, question) !== -1;
    }

    private getNextQuestionIndexByAnswer(answer: any, question: ListQuestion): number {
        return question.choices.findIndex((choice) => choice.message === answer.selectedItem);
    }

    private async processAgain(answer, question): Promise<void> {
        const nextQuestionIndex = this.getNextQuestionIndexByAnswer(answer, question);
        await this.process(question.choices[nextQuestionIndex].values);
    }

    private assertQuestionsAreValid(questions: Array<string> | ListQuestion): void {
        if (typeof questions !== 'object') {
            throw new IncorrectFormatError(`Incorrect format, object expected, ${typeof questions} given`);
        }
    }

    private assertListQuestionIsValid(question: ListQuestion): void {
        if (typeof question !== 'object') {
            throw new IncorrectFormatError(`Incorrect format, object expected, ${typeof question} given`);
        }
        if(typeof question.message !== 'string' || !Array.isArray(question.choices)) {
            throw new IncorrectFormatError(`Incorrect format of list question!`);
        }
    }

    private transformConfirmQuestions(questions: Array<Question>): Array<InquirerConfirmQuestion> {
        return questions.map((question: string, index) => {
            return {
                type: 'confirm',
                name: index,
                message: question
            }
        });

    }

    private transformListQuestion(question: ListQuestion): InquirerListQuestion {
        return {
            message: question.message,
            type: 'list',
            name: 'selectedItem',
            choices: question.choices.map((choice) => choice.message)

        }
    }

}

export interface Answer {
    selectedItem: string;
}

export interface ListQuestion {
    message: string;
    choices: Array<Choice>;
}

export interface Choice {
    message: string;
    values: Array<string> | ListQuestion;
}

export type Question = string | object;

export interface InquirerConfirmQuestion {
    type: string;
    name: string | number;
    message: string;
}

export interface InquirerListQuestion {
    type: string;
    name: string | number;
    message: string;
    choices: Array<string>;
}

export class IncorrectFormatError extends Error {
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, IncorrectFormatError.prototype);
    }
}