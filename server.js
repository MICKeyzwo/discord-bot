require('dotenv').config();
const express = require('express');
const getBotClient = require('./lib/get-bot-client');

const app = express();

let client = null;

app.get('/', (req, res) => {
    if (!client) {
        const { BOT_TOKEN } = process.env;
        client = getBotClient();
        client.login(BOT_TOKEN);
    }
    res.status(200).send('bot client is alive!');
});

app.listen(process.env.PORT || 3000);
