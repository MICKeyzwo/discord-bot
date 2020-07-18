const assert = require('assert');

const Eval = require('../../lib/commands/eval');

const instance = new Eval();

assert.equal(instance.exec(...`1 + 2`.split(/ +/)), '3');

assert.notEqual(instance.exec(...`(() => {while(1) {} return 'ok'})()`.split(/ +/)), 'ok');
