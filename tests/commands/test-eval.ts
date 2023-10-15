import assert from 'assert';

import Eval from '../../lib/commands/eval';

const instance = new Eval();

assert.equal(instance.exec(...`1 + 2`.split(/ +/)), '3');

assert.equal(instance.exec(...`console.log(1)`.split(/ +/)), '1\nundefined');

assert.equal(instance.exec(...`print(2)`.split(/ +/)), '2\nundefined');

assert.notEqual(instance.exec(...`(() => {while(1) {} return 'ok'})()`.split(/ +/)), 'ok');
