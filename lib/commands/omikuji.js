const CommandBase = require('../command-base');
const { randomInt } = require('../bot-utils');


/**
 * おみくじを引く
 */
class Omikuji extends CommandBase {
    constructor() {
        super();
        this.name = 'omikuji';
        this.description = '`omikuji`: draw a written fortune';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const i = randomInt(100);
        if (i < 10) {
            return '大吉！！';
        }
        if (i < 25) {
            return '吉！';
        }
        if (i < 45) {
            return '中吉！';
        }
        if (i < 65) {
            return '小吉！';
        }
        if (i < 90) {
            return '凶！';
        }
        return '大凶！！';
    }
}

module.exports = Omikuji;
