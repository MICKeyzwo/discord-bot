const axios = require('axios').default;

const CommandBase = require('../command-base');


/**
 * ランダムにWikipediaの単語記事リンクを取得する
 */
class RandomWord extends CommandBase {
    constructor() {
        super()
        this.name = 'randomWord';
        this.description = '`randomWord`: get a random wikipedia page link';
    }
    async exec() {
        try {
            await axios.get(
                'https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:%E3%81%8A%E3%81%BE%E3%81%8B%E3%81%9B%E8%A1%A8%E7%A4%BA',
                {
                    maxRedirects: 0
                }
            );
        } catch (error) {
            const rawLocation = error.response.headers['location'];
            return decodeURIComponent(rawLocation);
        }
    }
}

module.exports = RandomWord;
