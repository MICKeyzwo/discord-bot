import assert from 'assert';

import { getNoCommandMessage } from '../lib/messages';
import { MockCommand } from './test-util';

assert.equal(getNoCommandMessage(
    'xxxy',
    new Map([['xxxx', new MockCommand()], ['zzzz', new MockCommand()]])),
    `There are no command named \`xxxy\`!\nDid u mean: \`xxxx\`?`
);

assert.equal(getNoCommandMessage(
    'yyyy',
    new Map([['xxxx', new MockCommand()], ['zzzz', new MockCommand()]])),
    `There are no command named \`yyyy\`!`
);
