import assert from 'assert';

import Echo from '../../lib/commands/echo';

const instance = new Echo();

assert.equal(instance.exec('hello'), 'hello');
