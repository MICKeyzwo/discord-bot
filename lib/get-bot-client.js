const Discord = require('discord.js');

const { prefix } = require('../config.json');
const getCommandMap = require('./get-commands');
const { parseMessage } = require('./bot-utils');
const {
    botLoggedInMessage,
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
        const { author, content, channel } = msg;
        if (author.username === BOT_NAME) {
            return;
        }
        if (content.startsWith(prefix)) {
            const commandMap = getCommandMap();
            const { commandName, args } = parseMessage(content);
            if (!commandName) {
                channel.send(getBlankMessage(commandMap));
            } else if (commandMap.has(commandName)) {
                const command = commandMap.get(commandName);
                try {
                    const result = await command.exec(...args);
                    channel.send(result);
                } catch (error) {
                    channel.send(executionErrorMessage);
                }
            } else {
                channel.send(getNoCommandMessage(commandName, commandMap));
            }
        }
    });

    return client;
}

module.exports = getBotClient;
