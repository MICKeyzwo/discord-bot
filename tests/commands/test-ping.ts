import assert from 'assert';

import Ping from '../../lib/commands/ping';

const instance = new Ping();

assert.equal(instance.exec(), 'pong!');
