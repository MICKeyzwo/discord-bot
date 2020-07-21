const assert = require('assert');

const Echo = require('../../lib/commands/echo');

const instance = new Echo();

assert.equal(instance.exec('hello'), 'hello');
