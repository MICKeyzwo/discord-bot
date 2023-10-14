import { CommandBase } from '../command-base';


/**
 * 脳を破壊する
 */
export default class Brainfuck extends CommandBase {
    constructor() {
        super();
        this.name = 'brainfuck';
        this.description = 
            '`brainfuck [code] [input]`: evaluates given string as Brainfuck code';
    }

    exec(...args: string[]) {
        const code = args[0];
        const input = args[1] || '';
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
                    let loopCount = 1, i = pcounter + 1;
                    for (; i < code.length; i++) {
                        if (code[i] === '[') {
                            loopCount++;
                        } else if (code[i] === ']') {
                            loopCount--;
                        }
                        if (loopCount === 0) {
                            pcounter = i;
                            break;
                        }
                    }
                    if (i >= code.length) {
                        return 'Runtime Error! The code has syntax errors!';
                    }
                }
            } else if (token === ']') {
                if (memory[mptr] !== 0) {
                    let loopCount = 1, i = pcounter - 1;
                    for (; i >= 0; i--) {
                        if (code[i] === ']') {
                            loopCount++;
                        } else if (code[i] === '[') {
                            loopCount--;
                        }
                        if (loopCount === 0) {
                            pcounter = i;
                            break;
                        }
                    }
                    if (i < 0) {
                        return 'Runtime Error! The code has syntax errors!';
                    }
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
