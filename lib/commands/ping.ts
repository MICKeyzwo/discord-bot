import { CommandBase } from '../command-base';


/**
 * 実行されたら「pong!」と返す
 */
export default class Ping extends CommandBase {
    constructor() {
        super();
        this.name = 'ping';
        this.description = '`ping`: let\'s play pingpong!';
    }

    exec() {
        return 'pong!';
    }
}
