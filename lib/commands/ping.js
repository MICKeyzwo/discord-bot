const CommandBase = require('../command-base');

/**
 * 実行されたら「pong!」と返す
 */
class Ping extends CommandBase {
    constructor() {
        super();
        this.name = 'ping';
        this.description = 'let\'s play pingpong!';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        return 'pong!';
    }
}

module.exports = Ping;
