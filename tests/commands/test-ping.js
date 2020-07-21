const assert = require('assert');

const Ping = require('../../lib/commands/ping');

const instance = new Ping();

assert.equal(instance.exec(), 'pong!');
