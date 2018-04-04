import {ActionSeparator} from "../../core/final-stage-hook";

export interface IInput {
    askUser(question: string);
    askUserForAction(actions: Array<string | ActionSeparator>): Promise<number>;
}