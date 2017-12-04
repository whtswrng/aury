export interface IStringColorizer {
    info(stringToPaint: string): string;
    error(stringToPaint: string): string;
    ok(stringToPaint: string): string;
}
