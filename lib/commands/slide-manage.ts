import { CommandBase } from '../command-base';

const { SPREAD_SHEET_LINK, SPREAD_SHEET_API, SPREAD_SHEET_API_TOKEN } = process.env;

/**
 * LTのスライドまとめを管理する
 */
export default class SlideManage extends CommandBase {
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

    async exec(...args: string[]) {
        if (SlideManage.validCommands.includes(args[0])) {
            if (args[0] === 'list') {
                return this.getSlideLink();
            } else if (args[0] === 'addTime') {
                return await this.addLtTime();
            } else if (args[0] === 'add') {
                if (args.length < 4) {
                    return 'arity error! plz call this command with 3 arguments.';
                }
                await this.addSlide(args[1], args[2], args[3]);
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
        return SPREAD_SHEET_LINK;
    }

    /**
     * 新たな回のLTシートを追加する
     */
    async addLtTime() {
        const res = await fetch(SPREAD_SHEET_API!, {
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
     */
    async addSlide(author: string, title: string, link: string) {
        const res = await fetch(SPREAD_SHEET_API!, {
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
