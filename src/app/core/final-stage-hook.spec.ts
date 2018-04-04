import {expect} from 'chai';
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ActionSeparator, FinalStageHook} from "./final-stage-hook";

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('FinalStageHook', () => {

    let finalStage: FinalStageHook;
    let input;
    let notifier;

    beforeEach((() => {
        input = {
            askUserForAction: sinon.stub(),
            askUser: sinon.spy()
        };
        notifier = {
            notifyAuthorAboutApprovedPullRequest: sinon.stub(),
            notifyAuthorAboutReviewedPullRequest: sinon.stub()
        };
        finalStage = new FinalStageHook(input, notifier);
    }));

    it('should be properly created', () => {
        expect(finalStage).to.be.instanceof(FinalStageHook);
    });

    it('should has finish method', () => {
        expect(finalStage.finish).not.to.be.undefined;
    });

    describe('when called finish', () => {

        it('should ask for action', async () => {
            await finalStage.finish();

            return expect(input.askUserForAction).to.have.been.calledWith([
                'Send "Pull request approved"',
                'Send "Pull request reviewed with comments"',
                new ActionSeparator(),
                'Exit'
            ]);
        });

        it('should do nothing if handler does not exist for answer index', async () => {
            input.askUserForAction.resolves(464646464);

            return expect(finalStage.finish()).to.have.been.fulfilled;
        });

        it('should send "approve pull request" if first option was selected', async () => {
            input.askUserForAction.resolves(0);

            await finalStage.finish();

            return expect(notifier.notifyAuthorAboutApprovedPullRequest).to.have.been.calledOnce;
        });

        it('should send "pull request reviewed" if second option was selected', async () => {
            input.askUserForAction.resolves(1);

            await finalStage.finish();

            return expect(notifier.notifyAuthorAboutReviewedPullRequest).to.have.been.calledOnce;
        });

        it('should do nothing if "exit" option was selected', async () => {
            input.askUserForAction.resolves(3);

            return expect(finalStage.finish()).to.have.been.fulfilled;
        });

    });


});

