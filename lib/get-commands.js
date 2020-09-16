const fs = require('fs');

const CommandBase = require('./command-base');
const {
    getBlankMessage,
    getNoCommandMessage
} = require('./messages');


const COMMANDS_DIR = `${__dirname}/commands`;

/**
 * ./commandsからコマンドを収集する
 * @returns {Map<string, CommandBase>}
 */
function getCommandMap() {
    const files = fs.readdirSync(COMMANDS_DIR);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    const commandMap = new Map();
    for (const file of jsFiles) {
        const Clas = require(`${COMMANDS_DIR}/${file}`);
        const command = new Clas();
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
     * @param {Map<string, CommandBase>} commandMap 
     */
    constructor(commandMap) {
        super();
        this.commandMap = commandMap;
        this.name = 'help';
        this.description = '`help [commandName]`: print command description';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const commandName = args[0];
        if (!commandName) {
            return getBlankMessage(this.commandMap)
        } else if (this.commandMap.has(commandName)) {
            return this.commandMap.get(commandName).description;
        } else {
            return getNoCommandMessage(commandName);
        }
    }
}

module.exports = getCommandMap;
