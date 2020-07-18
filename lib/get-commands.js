const fs = require('fs');
const CommandBase = require('./command-base');

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
    return commandMap;
}

module.exports = getCommandMap;
