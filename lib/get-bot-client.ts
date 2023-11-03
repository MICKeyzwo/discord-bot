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
import type { CommandContext, CommandHandler } from './command-base';


const { BOT_NAME } = process.env;

type DiscordReplyMessage = Discord.Message & {
    lineReplyNoMention(message: string): Promise<Discord.Message>;
};

async function handleCommandResponse(
    replyMessage: DiscordReplyMessage,
    response: CommandHandler,
    args: string[]
) {
    let messageEditor: (content: string) => Promise<void> | undefined;
    const editMessage = async (content: string) => {
        if (typeof messageEditor === "undefined") {
            const msg = await replyMessage.lineReplyNoMention(content);
            messageEditor = async (content: string) => {
                await msg.edit(content);
            };
        } else {
            await messageEditor(content);
        }
    };
    const ctx: CommandContext = {
        editMessage,
        args,
        user: { id: replyMessage.author.id, name: replyMessage.author.username },
    };
    await response(ctx);
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
