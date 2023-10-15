import { CommandBase } from '../command-base';


/**
 * 渡された文字列をそのまま返す
 */
export default class Echo extends CommandBase {
    constructor() {
        super();
        this.name = 'echo';
        this.description = '`echo [...values]`: return given values as it is.';
    }

    exec(...args: string[]) {
        return args.join(' ');
    }
}
