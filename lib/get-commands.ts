import fs from 'fs';

import { CommandBase } from './command-base';
import {
    getBlankMessage,
    getNoCommandMessage
} from './messages';


const COMMANDS_DIR = `${__dirname}/commands`;

/**
 * ./commandsからコマンドを収集する
 */
export async function getCommandMap() {
    const files = fs.readdirSync(COMMANDS_DIR);
    const tsFiles = files.filter(file => file.endsWith('.ts'));
    const commandMap = new Map();
    for (const file of tsFiles) {
        const Clas = await import(`${COMMANDS_DIR}/${file}`);
        const command = new Clas.default();
        commandMap.set(command.name, command);
    }
    const help = new Help(commandMap);
    commandMap.set('help', help);
    return commandMap;
}

/** コマンドのヘルプを表示する */
class Help extends CommandBase {
    /**
     * コンストラクタ
     */
    constructor(private readonly commandMap: Map<string, CommandBase>) {
        super();
        this.name = 'help';
        this.description = '`help [commandName]`: print command description';
    }

    async exec(...args: string[]) {
        const commandName = args[0];
        if (!commandName) {
            return getBlankMessage(this.commandMap)
        } else if (this.commandMap.has(commandName)) {
            return this.commandMap.get(commandName)?.description ?? '';
        } else {
            return getNoCommandMessage(commandName, this.commandMap);
        }
    }
}
