import {StringPainter} from "./string-painter";

export class ConsoleOutputPrinter {

    public info(string) {
        console.log(StringPainter.info(string))
    }

    public error(string) {
        console.log(StringPainter.error(string))
    }

    public ok(string) {
        console.log(StringPainter.ok(string));
    }

}
