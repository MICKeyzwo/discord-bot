const config = require('../config.json');


const COMMAND_PREFIX = config.prefix;

/**
 * 受け取ったメッセージからコマンド名と引数列を取り出す
 * @param {string} msg 
 */
function parseMessage(msg) {
    const argsStr = msg.trim().replace(COMMAND_PREFIX, '').trim();
    const args = argsStr.split(/ +/);
    return {
        commandName: args[0],
        args: args.slice(1)
    };
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
function lruCache(f) {
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
const getLevenshteinDistance = lruCache((s, t) => {
    if (!s) {
        return t.length;
    }
    if (!t) {
        return s.length;
    }
    if (s[0] === t[0]) {
        return getLevenshteinDistance(s.slice(1), t.slice(1));
    }
    const l1 = getLevenshteinDistance(s, t.slice(1));
    const l2 = getLevenshteinDistance(s.slice(1), t);
    const l3 = getLevenshteinDistance(s.slice(1), t.slice(1));
    return 1 + Math.min(l1, l2, l3)
});

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
