const CommandBase = require('./command-base');
const { getLevenshteinSimilarity, getOptionsMessage } = require('./bot-utils');


/** botがログインした際の通知 */
const botLoggedInMessage = 'bot user has logged in!';

/** コマンド引数の値が不正だったときの通知 */
const argumentsErrorMessage = 'Oops! Arguments specification may be malformed!';

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

// 類似コマンド判定の閾値
const commandSimilarityThreshold = 0.7;

/**
 * 与えられた名前に対応するコマンドが見つからなかったときのエラーメッセージを生成
 * @param {string} commandName 
 * @param {Map<string, CommandBase>} commandMap
 */
function getNoCommandMessage(commandName, commandMap) {
    const commandNames = [...commandMap.keys()];
    const similarCommands = commandNames.filter(_commandName =>
        getLevenshteinSimilarity(commandName, _commandName) >= 
            commandSimilarityThreshold);
    return (
        `There are no command named \`${commandName}\`!` +
        (
            similarCommands.length ?
                `\nDid u mean: ${getOptionsMessage(similarCommands)}?` :
                ''
        )
    );
}

module.exports = {
    botLoggedInMessage,
    argumentsErrorMessage,
    executionErrorMessage,
    getBlankMessage,
    getNoCommandMessage,
};
