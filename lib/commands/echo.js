const CommandBase = require('../command-base');

/**
 * 渡された文字列をそのまま返す
 */
class Echo extends CommandBase {
    constructor() {
        super();
        this.name = 'echo';
        this.description = 'return given values as it is.';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        return args.join(' ');
    }
}

module.exports = Echo;
