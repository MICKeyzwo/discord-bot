import { format } from 'util';
import vm from 'vm';

import { CommandBase } from '../command-base';


/**
 * 渡された文字列をJavaScriptとして評価する
 */
export default class Eval extends CommandBase {
    constructor() {
        super();
        this.name = 'eval';
        this.description =
            '`eval [...javaScriptCode]`:\n' +
            ' evaluates given strings as JavaScript code\n' +
            ' `console.log` and `print` have been implemented';
    }

    exec(...args: string[]) {
        const code = args.join(' ');
        const logs: string[] = [];
        const log = (...args: any[]) => void logs.push(args.map(v => format(v)).join(' '));
        const ctx = {
            console: { log },
            print: log
        };
        try {
            const result = String(vm.runInNewContext(code, ctx, { timeout: 5000 }));
            return [...logs, result].join('\n');
        } catch (error) {
            return `Oops! Some **ERROR** occured during evaluating script!\n${error}`;
        }
    }
}
