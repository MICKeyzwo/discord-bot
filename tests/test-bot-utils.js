const assert = require('assert');

const {
    parseMessage,
    objectToQueryString,
    getLevenshteinSimilarity,
    getOptionsMessage,
} = require('../lib/bot-utils');

const blank = parseMessage(`!bot   `);
assert.equal(blank.commandName, '');
assert.equal(blank.argsError, false);
assert.equal(blank.args.length, 0)
const poker = parseMessage(`!bot poker`);
assert.equal(poker.commandName, 'poker');
assert.equal(poker.argsError, false);
assert.equal(poker.args.length, 0);
const echo = parseMessage(`!bot echo hoge "fuga"   '"piyo"'`);
assert.equal(echo.commandName, 'echo');
assert.equal(echo.argsError, false);
assert.equal(echo.args.length, 3);
assert.equal(echo.args[0], 'hoge');
assert.equal(echo.args[1], 'fuga');
assert.equal(echo.args[2], '"piyo"');
const shuffle = parseMessage(`!bot  shuffle    hoge "fu
ga" foo
bar    
`);
assert.equal(shuffle.commandName, 'shuffle');
assert.equal(shuffle.argsError, false);
assert.equal(shuffle.args.length, 4);
assert.equal(shuffle.args[0], 'hoge');
assert.equal(shuffle.args[1], 'fu\nga');
assert.equal(shuffle.args[2], 'foo');
assert.equal(shuffle.args[3], 'bar');
const argsError = parseMessage(`!bot echo "hoge`);
assert.equal(argsError.commandName, 'echo');
assert.equal(argsError.argsError, true);
assert.equal(poker.args.length, 0);

assert.equal(objectToQueryString({hoge: 'fuga', foo: 'bar'}), '?hoge=fuga&foo=bar');

assert.equal(getLevenshteinSimilarity('xx', 'xx'), 1);
assert.equal(getLevenshteinSimilarity('xx', 'xy'), 0.5);
assert.equal(getLevenshteinSimilarity('xx', 'yy'), 0);

assert.equal(getOptionsMessage(['hoge']), '`hoge`');
assert.equal(getOptionsMessage(['hoge', 'fuga']), '`hoge` or `fuga`');
assert.equal(getOptionsMessage(['hoge', 'fuga', 'piyo']), '`hoge`, `fuga` or `piyo`');
