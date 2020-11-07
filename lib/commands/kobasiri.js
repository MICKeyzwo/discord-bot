const CommandBase = require('../command-base');
const SearchImage = require('./search-image');
const searchImage = new SearchImage();

/**
 * "こばしり。"の画像を検索してくる
 */
class Kobasiri extends CommandBase {
    constructor() {
        super();
        this.name = 'こばしり。';
        this.description = 'search image of 「こばしり。」';
    }

    async exec() {
        return await searchImage.exec("こばしり。")
    }
}

module.exports = Kobasiri;
