import { CommandBase } from '../command-base';
import SearchImage from './search-image';
const searchImage = new SearchImage();

/**
 * 'かのゆら'の画像を検索してくる
 */
export default class Kanoyura extends CommandBase {
    constructor() {
        super();
        this.name = 'かのゆら';
        this.description = 'search image of 「かのゆら」';
    }

    async exec() {
        return await searchImage.exec('かのゆら')
    }
}
