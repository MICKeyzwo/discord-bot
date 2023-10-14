import Discord from 'discord.js';
require('discord-reply');

import { prefix } from '../config.json';
import { getCommandMap } from './get-commands';
import { parseMessage } from './bot-utils';
import {
    botLoggedInMessage,
    argumentsErrorMessage,
    executionErrorMessage,
    getBlankMessage,
    getNoCommandMessage
} from './messages';


const { BOT_NAME } = process.env;

type DiscordReplyMessage = Discord.Message & {
    lineReplyNoMention(message: string): void;
};


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
                const command = commandMap.get(commandName);
                try {
                    const result = await command.exec(...args);
                    replyMessage.lineReplyNoMention(result);
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
