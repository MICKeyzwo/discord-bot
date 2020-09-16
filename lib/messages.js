const CommandBase = require('./command-base');


/** botがログインした際の通知 */
const botLoggedInMessage = 'bot user has logged in!';

/** コマンドの実行中に例外が発生した際の通知 */
const executionErrorMessage = 'Oops! Some **ERROR** occured during executing command!';

/**
 * コマンド名が空だったときのエラーメッセージを生成
 * @param {Map<string, CommandBase>} commandMap
 */
function getBlankMessage(commandMap) {
    const commandNames = [...commandMap.keys()].join(', ');
    return (
        `Plz call me with a command name!\ncommands:[ ${commandNames} ]`
    );
}

/**
 * 与えられた名前に対応するコマンドが見つからなかったときのエラーメッセージを生成
 * @param {string} commandName 
 */
function getNoCommandMessage(commandName) {
    return (
        `There are no command named \`${commandName}\`!`
    )
}

module.exports = {
    botLoggedInMessage,
    executionErrorMessage,
    getBlankMessage,
    getNoCommandMessage
};
