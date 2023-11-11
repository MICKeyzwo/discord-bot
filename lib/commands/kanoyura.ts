import { CommandBase } from '../command-base';
import { searchImage } from '../search-utils';

/**
 * 'かのゆら'の画像を検索してくる
 */
export default class Kanoyura extends CommandBase {
    constructor() {
        super();
        this.name = 'かのゆら';
        this.description = '`かのゆら [--unsafe]`: search image of 「かのゆら」';
    }

    async exec(...args: string[]) {
        return await searchImage(
            "かのゆら",
            args[0] === "--unsafe" ? "unsafe" : "strict",
        );
    }
}
