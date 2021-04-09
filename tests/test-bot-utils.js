const assert = require('assert');

const {
    objectToQueryString,
    getLevenshteinSimilarity,
    getOptionsMessage,
} = require('../lib/bot-utils');

assert.equal(objectToQueryString({hoge: 'fuga', foo: 'bar'}), '?hoge=fuga&foo=bar');

assert.equal(getLevenshteinSimilarity('xx', 'xx'), 1);
assert.equal(getLevenshteinSimilarity('xx', 'xy'), 0.5);
assert.equal(getLevenshteinSimilarity('xx', 'yy'), 0);

assert.equal(getOptionsMessage(['hoge']), '`hoge`');
assert.equal(getOptionsMessage(['hoge', 'fuga']), '`hoge` or `fuga`');
assert.equal(getOptionsMessage(['hoge', 'fuga', 'piyo']), '`hoge`, `fuga` or `piyo`');
