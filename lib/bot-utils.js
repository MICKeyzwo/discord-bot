const config = require('../config.json');


const COMMAND_PREFIX = config.prefix;

/**
 * 受け取ったメッセージからコマンド名と引数列を取り出す
 * @param {string} msg 
 */
function parseMessage(msg) {
    const cmdAndArgs = msg.trim().replace(COMMAND_PREFIX, '').trim();
    const cmdName = cmdAndArgs.split(/ +/)[0];
    const args = [];
    let msgStartPos = -1;
    const quoteInfo = {
        single: -1,
        double: -1
    };
    const tokens = (cmdAndArgs.replace(cmdName, '').trim() + ' ').split('');
    tokens.forEach((s, idx) => {
        if (s === '\'' && quoteInfo.double === -1) {
            if (quoteInfo.single === -1) {
                quoteInfo.single = idx;
            } else if (tokens[idx - 1] !== '\\') {
                args.push(tokens.slice(quoteInfo.single + 1, idx).join(''));
                quoteInfo.single = -1;
            }
        } else if (s === '"' && quoteInfo.single === -1) {
            if (quoteInfo.double === -1) {
                quoteInfo.double = idx;
            } else if (tokens[idx - 1] !== '\\') {
                args.push(tokens.slice(quoteInfo.double + 1, idx).join(''));
                quoteInfo.double = -1;
            }
        } else if (
            !s.match(/\s/) &&
            msgStartPos === -1 &&
            quoteInfo.single === -1 &&
            quoteInfo.double === -1
        ) {
            msgStartPos = idx;
        } else if (s.match(/\s/) && msgStartPos >= 0) {
            args.push(tokens.slice(msgStartPos, idx).join(''));
            msgStartPos = -1;
        }
    });
    const argsError =
        msgStartPos !== -1 ||
        quoteInfo.single !== -1 ||
        quoteInfo.double !== -1;
    return { commandName: cmdName, args, argsError };
}

/**
 * オブジェクトをクエリ文字列に変換する
 * @param {({[key: string]: string})} obj 
 */
function objectToQueryString(obj) {
    return '?' + Object.entries(obj).reduce((query, [key, value]) => {
        return query + (query && '&') + key + '=' + value;
    }, '');
}

/**
 * [0, n)の区間でランダムな整数を返す
 * @param {number} n 
 */
function randomInt(n) {
    return Math.floor(Math.random() * n);
}

/**
 * 関数のメモ化関数
 * @param {Function} f 
 */
function IdiotCache(f) {
    const cache = new Map();
    return (...args) => {
        if (cache.has(args.join(','))) {
            return cache.get(args.join(','));
        }
        const r = f(...args);
        cache.set(args.join(','), r);
        return r;
    };
};

/**
 * レーベンシュタイン距離を求める
 * @param {string} s 
 * @param {string} t 
 */
function getLevenshteinDistance(s, t) {
    const ld = IdiotCache((s, t) => {
        if (!s) {
            return t.length;
        }
        if (!t) {
            return s.length;
        }
        if (s[0] === t[0]) {
            return ld(s.slice(1), t.slice(1));
        }
        const l1 = ld(s, t.slice(1));
        const l2 = ld(s.slice(1), t);
        const l3 = ld(s.slice(1), t.slice(1));
        return 1 + Math.min(l1, l2, l3)
    });
    return ld(s, t);
}

/**
 * 正規化されたレーベンシュタイン距離を求める
 * @param {string} s 
 * @param {string} t 
 */
function getNormalizedLevenshteinDistance(s, t) {
    return getLevenshteinDistance(s, t) / Math.max(s.length, t.length);
}

/**
 * レーベンシュタイン類似度を求める
 * @param {string} s 
 * @param {string} t 
 */
function getLevenshteinSimilarity(s, t) {
    return -getNormalizedLevenshteinDistance(s, t) + 1;
}

/**
 * 文字列の配列からオプション形式の文を作成する
 * 例） ['hoge', 'fuga', 'piyo'] => '`hoge`, `fuga` or `piyo`'
 * @param {string[]} strs 
 */
function getOptionsMessage(strs) {
    const len = strs.length;
    if (len === 0) {
        return '';
    }
    if (len === 1) {
        return `\`${strs[0]}\``;
    }
    return (
        `${strs.slice(0, len - 1).map(str => `\`${str}\``).join(', ')}` +
        ` or \`${strs[len - 1]}\``
    );
}

module.exports = {
    parseMessage,
    objectToQueryString,
    randomInt,
    getLevenshteinSimilarity,
    getOptionsMessage,
};
