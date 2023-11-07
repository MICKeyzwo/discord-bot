import { CommandBase } from '../command-base';
import { parseSearchArgs, searchVideo } from '../search-utils';


/**
 * 動画を検索する
 */
export default class SearchVideo extends CommandBase {
    constructor() {
        super();
        this.name = 'searchVideo';
        this.description =
            '`searchVideo [--strict | --unsafe] [...keywords]`: search video using given keywords';
    }

    async exec(...args: string[]) {
        const { keyword, safeLevel } = parseSearchArgs(args);
        return await searchVideo(keyword, safeLevel);
    }
}
