type MessagePropsBase = {
    readonly user: { readonly id: string, readonly name: string };
    readonly messageId: string, 
    readonly referenceMessageId: string | null;
    readonly content: string;
};
export type MessageProps = MessagePropsBase & (
    { readonly isBotMessage: false } |
    { readonly isBotMessage: true;　readonly updateMessage: (content: string) => Promise<void>　}
);
export type CommandContext = MessagePropsBase & {
    readonly args: string[];
    readonly getMessage: (messageId: string) => Promise<MessageProps | undefined>;
};
export type ReplyMessageProps = {
    readonly updateReplyMessage: (content: string) => Promise<void>;
    readonly replyMessageId: string;
};
export type CommandHandler = (
    sendReplyMessage: (content: string) => Promise<ReplyMessageProps>,
    ctx: CommandContext
) => any | Promise<any>;
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
