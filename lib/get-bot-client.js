const config = require('../config.json');
const getCommandMap = require('./get-commands');
const { parseMessage } = require('./bot-utils');
const Discord = require('discord.js');

/**
 * discord botのクライアントを生成する
 */
function getBotClient() {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log('bot user has logged in!');
    });

    const { prefix } = config;
    const { BOT_NAME } = process.env;

    client.on('message', async (msg) => {
        const { author, content, channel } = msg;
        if (author.username === BOT_NAME) {
            return;
        }
        if (content.startsWith(prefix)) {
            const commandMap = getCommandMap();
            const { commandName, args } = parseMessage(content);
            if (!commandName) {
                const commandMapKeys = [...commandMap.keys()].join(', ');
                const response =
                    `Plz call me with a command!\ncommands:[ ${commandMapKeys} ]`;
                channel.send(response);
            } else if (commandMap.has(commandName)) {
                const command = commandMap.get(commandName);
                try {
                    const result = await command.exec(...args);
                    channel.send(result);
                } catch (error) {
                    const response =
                        `Oops! Some **ERROR** occured during executing command!`;
                    channel.send(response);
                }
            } else {
                channel.send(`There are no command named \`${commandName}\`!`);
            }
        }
    });

    return client;
}

module.exports = getBotClient;
