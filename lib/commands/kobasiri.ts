import { CommandBase } from '../command-base';
import SearchImage from './search-image';
const searchImage = new SearchImage();

/**
 * 'こばしり。'の画像を検索してくる
 */
export default class Kobasiri extends CommandBase {
    constructor() {
        super();
        this.name = 'こばしり。';
        this.description = 'search image of 「こばしり。」';
    }

    async exec() {
        return await searchImage.exec('こばしり。')
    }
}
