import { CommandBase } from '../command-base';
import { parseSearchArgs, searchImage } from '../search-utils';


/**
 * 画像を検索する
 */
export default class SearchImage extends CommandBase {
    constructor() {
        super();
        this.name = 'searchImage';
        this.description =
            '`searchImage [--strict | --unsafe] [...keywords]`: search image using given keywords';
    }

    async exec(...args: string[]) {
        const { keyword, safeLevel } = parseSearchArgs(args);
        return await searchImage(keyword, safeLevel);
    }
}
