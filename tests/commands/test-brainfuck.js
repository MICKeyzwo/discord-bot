const assert = require('assert');

const Brainfuck = require('../../lib/commands/brainfuck');

const instance = new Brainfuck();

assert.equal(instance.exec('+++++[>+++++++++++++<-]>.'), 'A');

assert.equal(instance.exec(',.,.,.', 'ABC'), 'ABC');

assert.equal(instance.exec('+[]'), 'Execution timeout! Check the code you gave!');
