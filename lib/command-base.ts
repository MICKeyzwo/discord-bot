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
    abstract exec(...args: string[]): string | Promise<string>;
}
