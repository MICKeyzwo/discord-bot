'use strict'

require('dotenv').config();
const getBotClient = require('./lib/get-bot-client');

const { BOT_TOKEN } = process.env;
const client = getBotClient();
client.login(BOT_TOKEN);

console.log('bot client is alive!');
