import {StringPainter} from "../string-painter/string-painter";
import {IOutputPrinter} from "./output-printer.interface";
import {IStringPainter} from "../string-painter/string-painter.interface";

export class ConsoleOutputPrinter implements IOutputPrinter{

    constructor(private stringPainter: IStringPainter) {

    }

    public info(string) {
        console.log(this.stringPainter.info(string))
    }

    public error(string) {
        console.log(this.stringPainter.error(string))
    }

    public ok(string) {
        console.log(this.stringPainter.ok(string));
    }

}
