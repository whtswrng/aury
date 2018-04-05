import {Inquirer} from "inquirer";
import {QuestionParser} from "./question-parser";
import {IOutput} from "../input-output/output.interface";

export class InquirerQuestionParser implements QuestionParser{

    constructor(private inquirer: Inquirer, private output: IOutput) {

    }

    public async process(questions: Array<string> | ListQuestion): Promise<void> {
        if(Array.isArray(questions)) {
            await this.processConfirmQuestions([...questions]);
        } else {
            await this.processListQuestions(questions);
        }
    }

    private async processConfirmQuestions(questions: Array<string>): Promise<void> {
        this.assertConfirmQuestionsAreValid(questions);

        if(questions.length === 0 ){
            return;
        }

        await this.askQuestions(questions);
    }

    private async askQuestions(questions: Array<string>) {
        const question = questions.shift();
        const answer = await this.inquirer.prompt([this.transformConfirmQuestion(question) as any]) as Answer;
        await this.assertAnswer(answer);
        await this.processConfirmQuestions(questions);
    }

    private async assertAnswer(answer: Answer): Promise<void> {
        if (!answer.confirm) {
            this.output.separate();
            const answer = await this.askForContinueWithReview();
            this.output.separate();
            this.assertContinueWithReview(answer);
        }
    }

    private assertContinueWithReview(answer: any): void {
        if (!answer.confirm) {
            throw new Error(`Review was stopped by user.`);
        }
    }

    private async askForContinueWithReview(): Promise<Answer> {
        return await this.inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: 'Do you want to continue with review?'
        }]) as Answer;
    }

    private async processListQuestions(question: ListQuestion) {
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

    private assertConfirmQuestionsAreValid(questions: Array<string>): void {
        questions.forEach((question) => {
            if(typeof question !== 'string') {
                throw new IncorrectFormatError(`Incorrect format, string expected, ${typeof question} given: ${JSON.stringify(question, null, 2)}`);
            }
        });
    }

    private assertListQuestionIsValid(question: ListQuestion): void {
        if (typeof question !== 'object') {
            throw new IncorrectFormatError(`Incorrect format, object expected, ${typeof question} given`);
        }
        if(typeof question.message !== 'string' || !Array.isArray(question.choices)) {
            throw new IncorrectFormatError(`Incorrect format of list question!`);
        }
    }

    private transformConfirmQuestion(question: string): InquirerConfirmQuestion {
        return {
            type: 'confirm',
            name: 'confirm',
            message: question
        };
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
    selectedItem?: string;
    confirm?: string;
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
