const fetch = require('node-fetch').default;

const CommandBase = require('../command-base');
const { objectToQueryString, randomInt } = require('../bot-utils');


/**
 * 動画を検索する
 */
class SearchVideo extends CommandBase {
    constructor() {
        super();
        this.name = 'searchVideo';
        this.description =
            '`searchVideo [...keywords]`: search video using given keywords';
    }
    /**
     * @param  {...string} args 
     */
    async exec(...args) {
        const keyword = args.join(' ');
        return await this.searchImage(keyword);
    }

    /**
     * 動画を検索してくる
     * @param {string} keyword 
     */
    async searchImage(keyword) {
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
            return 'Oops! Image not found.';
        }
    }
}

module.exports = SearchVideo;
