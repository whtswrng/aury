import {BaseQuestionRule} from "./base-question-rule";
import * as sinon from "sinon";
import {IInput} from "../services/input-output/input.interface";
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

// TODO: Ask and Answer Rule!

class SpecificQuestionRule extends BaseQuestionRule {

    protected rejectRule() {
        return Promise.reject(new RejectionRuleError());
    }

    protected resolveRule(){
        return Promise.resolve();
    }

}

class RejectionRuleError extends Error {
    constructor() {
        super();
        (<any>Object).setPrototypeOf(this, RejectionRuleError.prototype);
    }
}

describe('BaseQuestionRule', () => {
    let askUserStub;
    let mockInput: IInput;
    let question;
    let questionRule;

    beforeEach(() => {
        askUserStub = sinon.stub();
        mockInput = {
            askUser: askUserStub
        };
        question = 'foo';
        questionRule = new SpecificQuestionRule(mockInput, question);
    });

    describe('when asked a question', () => {

        it('should be resolved when answer was "yes"', () => {
            askUserStub.returns(Promise.resolve('yes'));

            return expect(questionRule.execute()).not.to.be.rejectedWith(RejectionRuleError);
        });

        it('should be rejected when answer was "no"', () => {
            askUserStub.returns(Promise.resolve('no'));

            return expect(questionRule.execute()).to.be.rejectedWith(Error);
        });

        it('should be resolved after user eventually types "yes"', async () => {
            askUserStub.onCall(0).returns(Promise.resolve('fooo'));
            askUserStub.onCall(1).returns(Promise.resolve('yes'));

            await questionRule.execute();

            expect(askUserStub.calledTwice).to.equal(true);
        });

        it('should be rejected after user eventually types "no"', async () => {
            askUserStub.onCall(0).returns(Promise.resolve('fooo'));
            askUserStub.onCall(1).returns(Promise.resolve('no'));

            await expect(questionRule.execute()).to.be.rejectedWith(RejectionRuleError);
            expect(askUserStub.calledTwice).to.equal(true);
        });

    });

});

