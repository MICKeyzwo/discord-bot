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


const { BOT_NAME } = process.env;

type DiscordReplyMessage = Discord.Message & {
    lineReplyNoMention(message: string): Promise<Discord.Message>;
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
                const command = commandMap.get(commandName)!;
                try {
                    const result = await command.exec(...args);
                    if (typeof result === "string") {
                        await replyMessage.lineReplyNoMention(result);
                    } else {
                        const { message, messageEditor } = result;
                        await replyMessage
                          .lineReplyNoMention(message)
                          .then((msg) => messageEditor((content) => msg.edit(content).then(undefined)));
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
