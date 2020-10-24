const fetch = require('node-fetch').default;

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
        const res = await fetch(
            'https://ja.wikipedia.org/wiki/' + encodeURIComponent('特別:おまかせ表示'),
            {
                redirect: 'manual'
            }
        );
        const rawLocation = res.headers.get('location');
        return decodeURIComponent(rawLocation);
    }
}

module.exports = RandomWord;
