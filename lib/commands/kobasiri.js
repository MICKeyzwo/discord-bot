const CommandBase = require('../command-base');
const SearchImage = require('./search-image');
const searchKobasiri = new SearchImage();

/**
 * "こばしり。"の画像を検索してくる
 */
class Kobasiri extends CommandBase {
    constructor() {
        super();
        this.name = 'こばしり。';
        this.description = '`こばしり。`: search image using keywords こばしり。.';
    }

    async exec() {
        return await searchKobasiri.exec("こばしり。")
    }
}

module.exports = Kobasiri;
