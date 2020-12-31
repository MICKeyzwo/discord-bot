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

module.exports = {
    parseMessage,
    objectToQueryString,
    randomInt,
};
