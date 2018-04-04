export interface IOutput {
    info(stringToPrint: string): void;
    error(stringToPrint: string): void;
    separate(): void;
    warning(stringToPrint: string): void;
    ok(stringToPrint: string): void;
    log(stringToPrint: string): void;
}