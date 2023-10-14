import { CommandBase } from '../command-base';


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
        for (let i = args.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [args[i], args[j]] = [args[j], args[i]];
        }
        return args.join(' ');
    }
}
