export type CommandContext = {
    editMessage: (content: string) => Promise<void>;
    args: string[];
    user: { id: string, name: string };
};
export type CommandHandler = (ctx: CommandContext) => void | Promise<void>;
export type CommandResponse = string | CommandHandler;

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
    abstract exec(...args: string[]): CommandResponse | Promise<CommandResponse>;
}
