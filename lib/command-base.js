/**
 * コマンドの基底クラス
 */
class CommandBase {
    constructor() {
        /** コマンドの名前、呼び出し時はこの名前を使う */
        this.name = 'command-name';
        /** コマンドの説明、ヘルプとかで表示する */
        this.description = 'command-description';
    }
    /**
     * 関数の実装部
     * @param  {...string} args 
     * @returns {any}
     */
    async exec(...args) { }
}

module.exports = CommandBase;
