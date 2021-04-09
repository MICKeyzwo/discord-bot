const fetch = require('node-fetch').default;

const CommandBase = require('../command-base');

const { SPREAD_SHEET_API, SPREAD_SHEET_API_TOKEN } = process.env;

/**
 * LTのスライドまとめを管理する
 */
class SlideManage extends CommandBase {
    static validCommands = ['list', 'addTime', 'add'];
    constructor() {
        super();
        this.name = 'slide';
        this.description = 
            '`slide [subCommand] [...params]`: manage slide log spread sheet.\n' +
            'subCommand:\n' +
            '  list: show slide log spread sheet link\n' +
            '  addTime: add time to log spread sheet\n' +
            '  add [author] [title] [link]: insert slide link into latest time sheet';
    }
    /**
     * @param  {...string} args 
     */
    async exec(...args) {
        if (SlideManage.validCommands.includes(args[0])) {
            if (args[0] === 'list') {
                return this.getSlideLink();
            } else if (args[0] === 'addTime') {
                return await this.addLtTime();
            } else if (args[0] === 'add') {
                if (args.length < 4) {
                    return 'arity error! plz call this command with 3 arguments.';
                }
                await this.addSlide(...args.slice(1));
                return 'adding slide link succeeded!'
            }
        } else {
            return 'Invalid sub command!';
        }
    }

    /**
     * スライドのリンクを取得する
     */
    getSlideLink() {
        return 'https://docs.google.com/spreadsheets/d/1GttMMLMzoPd5BiAmccoF5cpMSnoBhVHV-stGjB95X54/edit#gid=0'
    }

    /**
     * 新たな回のLTシートを追加する
     */
    async addLtTime() {
        const res = await fetch(SPREAD_SHEET_API, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                apiToken: SPREAD_SHEET_API_TOKEN,
                operation: 'addTime'
            })
        });
        if (res.status !== 200) {
            return 'API error! gas API may not be working';
        }
        const resJson = await res.json();
        if (resJson.status !== 200) {
            return 'API error! response status is invalid';
        }
        return resJson.message.sheetLink;
    }

    /**
     * スライドを追加する
     * @param {string} author 発表者
     * @param {string} title タイトル
     * @param {string} link スライドのリンク
     */
    async addSlide(author, title, link) {
        const res = await fetch(SPREAD_SHEET_API, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                apiToken: SPREAD_SHEET_API_TOKEN,
                operation: 'addSlide',
                params: [author, title, link]
            })
        });
        if (res.status !== 200) {
            return 'API error! gas API may not be working';
        }
        const resJson = await res.json();
        if (resJson.status !== 200) {
            return 'API error! response status is invalid';
        }
    }
}

module.exports = SlideManage;
