const fetch = require('node-fetch').default;

const CommandBase = require('../command-base');
const { randomInt } = require('../bot-utils');


/**
 * 今日は何の日を表示
 */
class WhatToday extends CommandBase {
    constructor() {
        super();
        this.name = 'whatToday';
        this.description =
            '`whatToday`: show what day this is';
    }
    /**
     * @param  {...string} args 
     */
    async exec(...args) {
        return await this.getWhatToday();
    }

    /**
     * 今日は何の日かとってくる
     */
    async getWhatToday() {
        const today = new Date()
        const thisMonth = today.getMonth() + 1;
        const thisDay = today.getDate();
        const url =
            'https://ja.wikipedia.org/wiki/Wikipedia:' + 
            encodeURIComponent(`今日は何の日_${thisMonth}月`);
        const res = await fetch(url);
        const html = await res.text();
        const todayIdx = html.indexOf(`id="${thisMonth}月${thisDay}日"`);
        const ulStartIdx = html.indexOf('ul', todayIdx);
        const ulEnvIdx = html.indexOf('/ul', ulStartIdx);
        const ul = html.slice(ulStartIdx, ulEnvIdx).replace('\n', '');
        const lis = ul.match(/<li>.+?<\/li>/g).map(s => s.replace(/<.+?>/g, ''));
        return lis[randomInt(lis.length)];
    }
}

module.exports = WhatToday;
