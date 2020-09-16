const CommandBase = require('../command-base');


/**
 * 与えられた複数の文字列をシャッフルして返す
 */
class Shuffle extends CommandBase {
    constructor() {
        super();
        this.name = 'shuffle';
        this.description = '`shuffle [...words]`: shuffle given words';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        if (!args.length) {
            return '';
        }
        for (let i = args.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [args[i], args[j]] = [args[j], args[i]];
        }
        return args.join(' ');
    }
}

module.exports = Shuffle;
