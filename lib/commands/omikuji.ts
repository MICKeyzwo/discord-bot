import { CommandBase } from '../command-base';
import { randomInt } from '../bot-utils';


/**
 * おみくじを引く
 */
export default class Omikuji extends CommandBase {
    constructor() {
        super();
        this.name = 'omikuji';
        this.description = '`omikuji`: draw a written fortune';
    }

    exec() {
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
