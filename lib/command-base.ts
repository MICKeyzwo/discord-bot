export type CommandReturnWithEditor = {
    message: string;
    messageEditor: (editMessage: (content: string) => Promise<void>) => any | Promise<any>;
};
export type CommandReturn = string | CommandReturnWithEditor;

/**
 * コマンドの基底クラス
 */
export abstract class CommandBase {
    /** コマンドの名前、呼び出し時はこの名前を使う */
    name = 'command-name';

    /** コマンドの説明、ヘルプとかで表示する */
    description = 'command-description';

    /**
     * 関数の実装部
     */
    abstract exec(...args: string[]): CommandReturn | Promise<CommandReturn>;
}
