const axios = require('axios').default;
const CommandBase = require('../command-base');
const { objectToQueryString } = require('../bot-utils');

/**
 * エキサイト翻訳を行う
 */
class Translate extends CommandBase {
    constructor() {
        super();
        this.name = 'translate';
        this.description =
            '`translate [language selections] [text]`: translate given text' +
            '`[language selections] := /<lang>(2<lang>)+/`  ex) ja2en';
    }
    /**
     * @param  {...string} args 
     */
    async exec(...args) {
        const langsStr = args[0];
        let langs = ['ja', 'en'];
        let text = args.join(' ');
        if (/[a-z]{2}(-[a-z]{2})?(2[a-z]{2}(-[a-z]{2})?)+/.test(langsStr)) {
            langs = langsStr.split('2');
            text = args.slice(1).join(' ');
        }
        for (let i = 0; i < langs.length - 1; i++) {
            text = await this.translate(text, langs[i], langs[i + 1]);
        }
        return text;
    }

    /**
     * 翻訳APIを叩く
     * @param {string} text 翻訳対象の文字列
     * @param {string} src 翻訳元言語
     * @param {string} tgt 翻訳先言語
     */
    async translate(text, src, tgt) {
        const queryObject = {
            q: encodeURIComponent(text),
            apikey: 'nc3uGH4TeNQKFk4XG_LmgEeh3l0LcpcG',
            source: src,
            target: tgt,
            format: 'json'
        };
        const queryString = objectToQueryString(queryObject);
        try {
            const result = await axios.get('https://api-world.excite.co.jp/translate/' + queryString);
            if (result.data.data.translations) {
                return result.data.data.translations.translatedText;
            } else {
                return 'Translation Error! Language selection may be mulformed!';
            }
        } catch (error) {
            return 'Oops! Some **ERROR** occured during fetching translation API!';
        }
    }
}

module.exports = Translate;
