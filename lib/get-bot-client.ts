import Discord from 'discord.js';
import 'discord-reply';

import { prefix } from '../config';
import { getCommandMap } from './get-commands';
import { parseMessage } from './bot-utils';
import {
    botLoggedInMessage,
    argumentsErrorMessage,
    executionErrorMessage,
    getBlankMessage,
    getNoCommandMessage
} from './messages';
import type { CommandContext, CommandHandler, MessageProps } from './command-base';


const { BOT_NAME } = process.env;

type DiscordReplyMessage = Discord.Message & {
    lineReplyNoMention(message: string): Promise<Discord.Message>;
};

function getMessageProps(message: Discord.Message) {
    return {
        user: { id: message.author.id, name: message.author.username },
        messageId: message.id,
        referenceMessageID: message.reference?.messageID ?? null,
        content: message.content,
    }
}

async function handleCommandResponse(
    replyMessage: DiscordReplyMessage,
    commandHandler: CommandHandler,
    args: string[],
) {
    const sendReplyMessage = async (content: string) => {
        const msg = await replyMessage.lineReplyNoMention(content);
        return {
            updateReplyMessage: async (content: string) => {
                await msg.edit(content);
            },
            replyMessageId: msg.id
        };
    };
    const ctx: CommandContext = {
        ...getMessageProps(replyMessage),
        args,
        getMessage: async (messageId: string): Promise<MessageProps> => {
            const message = await replyMessage.channel.messages.fetch(messageId);
            const messageProps = getMessageProps(message);
            const isBotMessage = replyMessage.client.user!.id === messageProps.user.id;
            return isBotMessage
              ? {
                  ...messageProps,
                  isBotMessage: true,
                  updateMessage: async (content: string) => {
                    await message.edit(content);
                  },
                }
              : {
                  ...messageProps,
                  isBotMessage: false,
                };
        },
    };
    await commandHandler(sendReplyMessage, ctx);
}

/**
 * discord botのクライアントを生成する
 */
export function getBotClient() {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(botLoggedInMessage);
    });

    client.on('message', async (msg) => {
        const replyMessage = msg as DiscordReplyMessage;
        const { author, content } = replyMessage;
        if (author.username === BOT_NAME) {
            return;
        }
        if (content.startsWith(prefix)) {
            const commandMap = await getCommandMap();
            const { commandName, args, argsError } = parseMessage(content);
            if (!commandName) {
                replyMessage.lineReplyNoMention(getBlankMessage(commandMap));
            } else if (argsError) {
                replyMessage.lineReplyNoMention(argumentsErrorMessage);
            } else if (commandMap.has(commandName)) {
                const command = commandMap.get(commandName)!;
                try {
                    const response = await command.exec(...args);
                    if (typeof response === "string") {
                        await replyMessage.lineReplyNoMention(response);
                    } else if (typeof response === "function") {
                        await handleCommandResponse(replyMessage, response, args);
                    } else {
                        replyMessage.lineReplyNoMention(executionErrorMessage);
                    }
                } catch (error) {
                    replyMessage.lineReplyNoMention(executionErrorMessage);
                }
            } else {
                replyMessage.lineReplyNoMention(getNoCommandMessage(commandName, commandMap));
            }
        }
    });

    return client;
}
