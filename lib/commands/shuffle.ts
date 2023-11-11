import { CommandBase } from '../command-base';
import { shuffleArray } from '../bot-utils';


/**
 * 与えられた複数の文字列をシャッフルして返す
 */
export default class Shuffle extends CommandBase {
    constructor() {
        super();
        this.name = 'shuffle';
        this.description = '`shuffle [...words]`: shuffle given words';
    }

    exec(...args: string[]) {
        if (!args.length) {
            return '';
        }
        return shuffleArray(args).join(' ');
    }
}
