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

module.exports = {
    parseMessage
};
