import {expect} from 'chai';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import {InquirerInput} from "./inquirer-input";
import {ActionSeparator} from "../../core/final-stage-hook";
import * as inquirer from "inquirer";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('InquirerInput', () => {

    const actions = ['Foo', new ActionSeparator(), 'Bar'];
    let inquirerInput: InquirerInput;
    let inquirerMock;
    let stringColorizer;

    beforeEach((() => {
        inquirerMock = {
            prompt: sinon.stub().resolves({selectedAction: 'Bar'}),
            Separator: inquirer.Separator
        };
        stringColorizer = {
            info: sinon.stub()
        };
        inquirerInput = new InquirerInput(inquirerMock, stringColorizer);
    }));


    it('should be properly created', () => {
        expect(inquirerInput).to.be.instanceof(InquirerInput);
    });

    it('should build properly inquirer list', async () => {
        const expectedChoices = ['Foo', new inquirer.Separator(), 'Bar'];

        await inquirerInput.askUserForAction(actions);

        return expect(inquirerMock.prompt).to.have.been.calledWith([{
            type: 'list', name: 'selectedAction', message: 'What do you want to do?', choices: expectedChoices
        }]);
    });

    it('should select correct index by action', async () => {
        inquirerMock.prompt.resolves({selectedAction: 'Foo'});

        return expect(await inquirerInput.askUserForAction(actions)).to.equal(0);
    });

});
