const { format } = require('util');
const vm = require('vm');

const CommandBase = require('../command-base');


/**
 * 渡された文字列をJavaScriptとして評価する
 */
class Eval extends CommandBase {
    constructor() {
        super();
        this.name = 'eval';
        this.description =
            '`eval [...javaScriptCode]`:\n' +
            ' evaluates given strings as JavaScript code\n' +
            ' `console.log` and `print` have been implemented';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const code = args.join(' ');
        const logs = [];
        const log = (...args) => void logs.push(args.map(v => format(v)).join(' '));
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

module.exports = Eval;
