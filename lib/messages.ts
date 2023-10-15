import { CommandBase } from './command-base';
import { getLevenshteinSimilarity, getOptionsMessage } from './bot-utils';


/** botがログインした際の通知 */
export const botLoggedInMessage = 'bot user has logged in!';

/** コマンド引数の値が不正だったときの通知 */
export const argumentsErrorMessage = 'Oops! Arguments specification may be malformed!';

/** コマンドの実行中に例外が発生した際の通知 */
export const executionErrorMessage = 'Oops! Some **ERROR** occured during executing command!';

/**
 * コマンド名が空だったときのエラーメッセージを生成
 */
export function getBlankMessage(commandMap: Map<string, CommandBase>) {
    const commandNames = [...commandMap.keys()].join(', ');
    return (
        `Plz call me with a command name!\ncommands:[ ${commandNames} ]`
    );
}

// 類似コマンド判定の閾値
const commandSimilarityThreshold = 0.7;

/**
 * 与えられた名前に対応するコマンドが見つからなかったときのエラーメッセージを生成
 */
export function getNoCommandMessage(commandName: string, commandMap: Map<string, CommandBase>) {
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
