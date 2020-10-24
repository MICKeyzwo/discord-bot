const fetch = require('node-fetch').default;

const CommandBase = require('../command-base');


/**
 * 画像を検索する
 */
class SearchImage extends CommandBase {
    constructor() {
        super();
        this.name = 'searchImage';
        this.description =
            '`searchImage [...keywords]`: search image using given keywords';
    }
    /**
     * @param  {...string} args 
     */
    async exec(...args) {
        const keyword = args.join(' ');
        return await this.searchImage(keyword);
    }

    /**
     * 画像を検索してくる
     * @param {string} keyword 
     */
    async searchImage(keyword) {
        const encodedKeyword = encodeURIComponent(keyword);
        const url = 
            'https://search.yahoo.co.jp/image/search' +
            `?ei=UTF-8&fr=sfp_as&aq=-1&oq=&ts=2047&p=${encodedKeyword}&meta=vc%3D`;
        const res = await fetch(url);
        const html = await res.text();
        const imageLinks = html.match(/(?<=\"original\":{\"url\":\").+?(?=\")/sg);
        const { floor, random } = Math;
        while (imageLinks.length) {
            const imageLink = imageLinks.splice(floor(random() * imageLinks.length))[0];
            const res = await fetch(imageLink);
            if (res.status < 300) {
                return imageLink;
            }
        }
        return 'Oops! Image not found.';
    }
}

module.exports = SearchImage;
