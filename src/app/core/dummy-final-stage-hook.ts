import {FinalActionHook} from "./final-stage-hook";

export class DummyFinalStageHook implements FinalActionHook {

    public finish(): Promise<void> {
        return null;
    }

}