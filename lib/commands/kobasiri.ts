import { CommandBase } from '../command-base';
import { searchImage } from '../search-utils';

/**
 * 'こばしり。'の画像を検索してくる
 */
export default class Kobasiri extends CommandBase {
    constructor() {
        super();
        this.name = 'こばしり。';
        this.description = '`こばしり。 [--unsafe]`: search image of 「こばしり。」';
    }

    async exec(...args: string[]) {
        return await searchImage(
            "こばしり。",
            args[0] === "--unsafe" ? "unsafe" : "strict",
        );
    }
}
