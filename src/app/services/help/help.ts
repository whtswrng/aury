import {IOutput} from "../input-output/output.interface";

export class Help {

    constructor(private output: IOutput) {

    }

    public print(): void {
        this.printIntroduction();
        this.printOptions();
    }

    private printIntroduction(): void {
        this.output.log('' +
            'Usage: aury [$BRANCH] [options]\n' +
            '       aury DSP-2804\n' +
            '       aury --status\n'
        );
    }

    private printOptions(): void {
        this.output.log('Options: ');
        this.printOption('--status', '                 print code reviews in progress or pending');
        this.printOption('--reviews', '                print finished code reviews for current month');
        this.printOption('--add $BRANCH', '            add $BRANCH to pending code review');
        this.printOption('--delete $BRANCH', '         delete code review on $BRANCH from in progress or pending');
        this.printOption('--delete-all', '             delete code review on $BRANCH from in progress or pending');
        this.printOption('--help', '                   print usage and options information');
    }

    private printOption(name: string, description: string): void {
        this.output.log(`       ${name}${description}`);
    }

}