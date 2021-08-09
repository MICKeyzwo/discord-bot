const Discord = require('discord.js');
require('discord-reply');

const { prefix } = require('../config.json');
const getCommandMap = require('./get-commands');
const { parseMessage } = require('./bot-utils');
const {
    botLoggedInMessage,
    argumentsErrorMessage,
    executionErrorMessage,
    getBlankMessage,
    getNoCommandMessage
} = require('./messages');


const { BOT_NAME } = process.env;

/**
 * discord botのクライアントを生成する
 */
function getBotClient() {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(botLoggedInMessage);
    });

    client.on('message', async (msg) => {
        const { author, content } = msg;
        if (author.username === BOT_NAME) {
            return;
        }
        if (content.startsWith(prefix)) {
            const commandMap = getCommandMap();
            const { commandName, args, argsError } = parseMessage(content);
            if (!commandName) {
                msg.lineReplyNoMention(getBlankMessage(commandMap));
            } else if (argsError) {
                msg.lineReplyNoMention(argumentsErrorMessage);
            } else if (commandMap.has(commandName)) {
                const command = commandMap.get(commandName);
                try {
                    const result = await command.exec(...args);
                    msg.lineReplyNoMention(result);
                } catch (error) {
                    msg.lineReplyNoMention(executionErrorMessage);
                }
            } else {
                msg.lineReplyNoMention(getNoCommandMessage(commandName, commandMap));
            }
        }
    });

    return client;
}

module.exports = getBotClient;
