import { CommandBase } from '../command-base';
import { objectToQueryString } from '../bot-utils';


/**
 * エキサイト翻訳を行う
 */
export default class Translate extends CommandBase {
    constructor() {
        super();
        this.name = 'translate';
        this.description =
            '`translate [languageSelections] [...text]`: translate given text\n' +
            '`[languageSelections] := /<lang>(2<lang>)+/`  ' +
            'ex) ja2en: Japanese to English';
    }

    async exec(...args: string[]) {
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
     */
    async translate(text: string, src: string, tgt: string) {
        const queryObject = {
            q: encodeURIComponent(text),
            apikey: 'nc3uGH4TeNQKFk4XG_LmgEeh3l0LcpcG',
            source: src,
            target: tgt,
            format: 'json'
        };
        const queryString = objectToQueryString(queryObject);
        try {
            const res =
                await fetch('https://api-world.excite.co.jp/translate/' + queryString);
            const { translations, error } = (await res.json()).data;
            if (error) {
                return 'Translation Error! Language selection may be mulformed!';
            }
            return translations.translatedText;
        } catch (error) {
            return 'Oops! Some **ERROR** occured during fetching translation API!';
        }
    }
}
