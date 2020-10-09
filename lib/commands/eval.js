const vm = require('vm');

const CommandBase = require('../command-base');


/**
 * 渡された文字列をJavaScriptとして評価する
 */
class Eval extends CommandBase {
    constructor() {
        super();
        this.name = 'eval';
        this.description = '`eval [...javaScriptCode]`: evaluates given strings as JavaScript code';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const code = args.join(' ');
        try {
            return String(vm.runInNewContext(code, {}, { timeout: 5000 }));
        } catch (error) {
            return 'Oops! Some **ERROR** occured during evaluating script!';
        }
    }
}

module.exports = Eval;
