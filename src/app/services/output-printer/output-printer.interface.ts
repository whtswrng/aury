export interface IOutputPrinter {
    info(stringToPrint: string): void;
    error(stringToPrint: string): void;
    ok(stringToPrint: string): void;
}