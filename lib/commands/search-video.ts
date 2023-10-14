import fetch from 'node-fetch';

import { CommandBase } from '../command-base';
import { objectToQueryString, randomInt } from '../bot-utils';


/**
 * 動画を検索する
 */
export default class SearchVideo extends CommandBase {
    constructor() {
        super();
        this.name = 'searchVideo';
        this.description =
            '`searchVideo [...keywords]`: search video using given keywords';
    }

    async exec(...args: string[]) {
        const keyword = args.join(' ');
        return await this.searchImage(keyword);
    }

    /**
     * 動画を検索してくる
     */
    async searchImage(keyword: string) {
        const url = 
            'https://search.yahoo.co.jp/video/search' +
            objectToQueryString({
                p: encodeURIComponent(keyword),
                ei: 'UTF-8'
            });
        const res = await fetch(url);
        const html = await res.text();
        const videoLinks = html.match(/(?<=\"refererUrl\":\").+?(?=\")/sg) || [];
        const uniqueLinks = [...new Set(videoLinks)];
        if (uniqueLinks.length) {
            return uniqueLinks[randomInt(uniqueLinks.length)];
        } else {
            return 'Oops! Video not found.';
        }
    }
}
