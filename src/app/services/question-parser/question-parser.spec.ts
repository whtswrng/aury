import * as mocha from 'mocha';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';
import {IncorrectFormatError, ListQuestion, QuestionParser} from "./question-parser";
import {expect} from 'chai';
import {SinonStub} from "sinon";

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('QuestionParser', () => {

    let questionParser: QuestionParser;
    let inquirerMock;

    beforeEach((() => {
        inquirerMock = {
            prompt: sinon.stub().resolves() as SinonStub
        };
        questionParser = new QuestionParser(inquirerMock);
    }));

    it('should be properly created', () => {
        expect(questionParser).to.be.instanceof(QuestionParser);
    });

    it('should have process method', () => {
        expect(questionParser.process).not.to.be.undefined;
    });

    describe('when processed', () => {

        it('should throw error when given not an array or object', () => {
            return expect(questionParser.process('' as any)).to.be.rejectedWith(IncorrectFormatError);
        });

        it('should process if given array', () => {
            return expect(questionParser.process([])).to.be.fulfilled;
        });

        it('should throw proper error if given invalid object', () => {
            return expect(questionParser.process({} as any)).to.be.rejectedWith(IncorrectFormatError);
        });

        it('should NOT throw error if given valid object', () => {
            return expect(questionParser.process({message: 'FOo', choices: []})).to.be.fulfilled;
        });

        it('should process if given simple array with choices ', async () => {
            const questions = ['Does it have clean code?', 'Does it have clean design?'];
            const expectedPrompt = [
                {type: 'confirm', message: questions[0], name: 0},
                {type: 'confirm', message: questions[1], name: 1}
            ];

            await questionParser.process(questions);

            expect(inquirerMock.prompt).to.have.been.calledWith(expectedPrompt);
        });

        it('should process if given object with option list', async () => {
            const choices = ['Does it have clean code?', 'Does it have clean design?'];
            const question: ListQuestion = {
                message: 'What are u reviewing?', choices: [
                    {message: 'Command', values: choices}, {message: 'Query', values: ['Is it query ok?']}
                ]
            };

            simulateSelect('Command').onCall(0);
            await questionParser.process(question);

            expect(inquirerMock.prompt.callsArg(0)).to.have.been.calledWith({
                type: 'list', name: 'selectedItem', message: question.message, choices: ['Command', 'Query']
            });
            expect(inquirerMock.prompt.callsArg(1)).to.have.been.calledWith([
                {type: 'confirm', message:  choices[0], name: 0 },
                {type: 'confirm', message:  choices[1], name: 1 }
            ]);
        });

        it('should process if given object with recursive option list', async () => {
            const question: ListQuestion = {
                message: 'What are u reviewing?', choices: [
                    {
                        message: 'Command', values: {
                            message: 'What kind of command?',
                            choices: [
                                {message: 'Old', values: ['Is it OK?', 'Is it really old?']}
                            ]
                        }
                    }
                ]
            };

            simulateSelect('Command').onCall(0);
            simulateSelect('Old').onCall(1);
            await questionParser.process(question);

            expect(inquirerMock.prompt.callsArg(0)).to.have.been.calledWith({
                type: 'list', name: 'selectedItem', message: 'What are u reviewing?', choices: ['Command']
            });
            expect(inquirerMock.prompt.callsArg(1)).to.have.been.calledWith({
                type: 'list', name: 'selectedItem', message: 'What kind of command?', choices: ['Old']
            });
            expect(inquirerMock.prompt.callsArg(2)).to.have.been.calledWith([
                {type: 'confirm', message: 'Is it OK?', name: 0 },
                {type: 'confirm', message:  'Is it really old?', name: 1 }
            ]);
        });

    });

    function simulateSelect(selectedItem: string) {
        return {
            onCall: (indexCall) => {
                inquirerMock.prompt.onCall(indexCall).resolves({selectedItem});
            }
        };
    }


});
