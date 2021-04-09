const assert = require('assert');

const { getNoCommandMessage } = require('../lib/messages');

assert.equal(getNoCommandMessage(
    'xxxy',
    new Map([['xxxx', null], ['zzzz', null]])),
    `There are no command named \`xxxy\`!\nDid u mean: \`xxxx\`?`
);

assert.equal(getNoCommandMessage(
    'yyyy',
    new Map([['xxxx', null], ['zzzz', null]])),
    `There are no command named \`yyyy\`!`
);
