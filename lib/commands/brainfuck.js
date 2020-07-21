const CommandBase = require('../command-base');

/**
 * 脳を破壊する
 */
class Brainfuck extends CommandBase {
    constructor() {
        super();
        this.name = 'brainfuck';
        this.description = '`brainfuck [code] [input]`: evaluates given string as Brainfuck code';
    }
    /**
     * @param  {...string} args 
     */
    exec(...args) {
        const code = args[0];
        const input = args[1] || '';
        const loopSets = [];
        {
            const loopStuck = [];
            for (const [idx, token] of Object.entries(code.split(''))) {
                if (token === '[') {
                    loopStuck.push(idx);
                } else if (token === ']') {
                    if (!loopStuck.length) {
                        return 'Parse Error! The code has syntax errors!';
                    }
                    loopSets.push({ start: +loopStuck.pop(), end: +idx });
                }
            }
            if (loopStuck.length) {
                return 'Parse Error! The code has syntax errors!';
            }
        }
        const memory = new Uint16Array(2 ** 15);
        let pcounter = 0;
        let iptr = 0;
        let mptr = 0;
        let result = '';
        const startTime = Date.now();
        while (pcounter < code.length) {
            const token = code[pcounter];
            if (token === '>') {
                mptr = (mptr + 1) % memory.length;
            } else if (token === '<') {
                mptr = (mptr - 1 + memory.length) % memory.length;
            } else if (token === '+') {
                memory[mptr]++;
            } else if (token === '-') {
                memory[mptr]--;
            } else if (token === '.') {
                result += String.fromCharCode(memory[mptr]);
            } else if (token === ',' && input) {
                memory[mptr] = input.charCodeAt(iptr);
                iptr = (iptr + 1) % input.length;
            } else if (token === '[') {
                if (memory[mptr] === 0) {
                    pcounter = loopSets.find(set => set.start === pcounter).end;
                }
            } else if (token === ']') {
                if (memory[mptr] !== 0) {
                    pcounter = loopSets.find(set => set.end === pcounter).start;
                }
            }
            pcounter++;
            if (Date.now() - startTime >= 5000) {
                return 'Execution timeout! Check the code you gave!';
            }
        }
        return result;
    }
}

module.exports = Brainfuck;
