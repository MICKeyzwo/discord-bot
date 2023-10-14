import fetch from 'node-fetch';

import { CommandBase } from '../command-base';
import { objectToQueryString, randomInt } from '../bot-utils';


/**
 * 画像を検索する
 */
export default class SearchImage extends CommandBase {
    constructor() {
        super();
        this.name = 'searchImage';
        this.description =
            '`searchImage [...keywords]`: search image using given keywords';
    }

    async exec(...args: string[]) {
        const keyword = args.join(' ');
        return await this.searchImage(keyword);
    }

    /**
     * 画像を検索してくる
     */
    async searchImage(keyword: string) {
        const url = 
            'https://search.yahoo.co.jp/image/search' +
            objectToQueryString({
                p: encodeURIComponent(keyword),
                ei: 'UTF-8'
            });
        const res = await fetch(url);
        const html = await res.text();
        const imageLinks = html.match(/(?<=\"original\":{\"url\":\").+?(?=\")/sg) || [];
        while (imageLinks.length) {
            const imageLink = imageLinks.splice(randomInt(imageLinks.length))[0];
            const res = await fetch(imageLink);
            const contentType =
                res.headers.get('content-type') ||
                res.headers.get('Content-Type') ||
                '';
            if (res.status < 300 && contentType.includes('image')) {
                return imageLink;
            }
        }
        return 'Oops! Image not found.';
    }
}
