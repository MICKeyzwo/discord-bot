const axios = require('axios').default;
const CommandBase = require('../command-base');

/**
 * 画像を検索する
 */
class SearchImage extends CommandBase {
    constructor() {
        super();
        this.name = 'searchImage';
        this.description = '`searchImage [keyword]`: search image using given keyword';
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
        const url = `https://search.yahoo.co.jp/image/search?ei=UTF-8&fr=sfp_as&aq=-1&oq=&ts=2047&p=${encodedKeyword}&meta=vc%3D`;
        const response = await axios.get(url);
        const html = response.data;
        const imageLinks = html.match(/(?<=\"original\":{\"url\":\").+?(?=\")/sg);
        return imageLinks[~~(Math.random() * imageLinks.length)];
    }
}

module.exports = SearchImage;
