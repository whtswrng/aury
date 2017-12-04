export interface IOutput {
    info(stringToPrint: string): void;
    error(stringToPrint: string): void;
    ok(stringToPrint: string): void;
}