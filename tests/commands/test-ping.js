const assert = require('assert');

const Ping = require('../../lib/commands/ping');

const instance = new Ping();

assert(instance.exec(), 'pong!');
