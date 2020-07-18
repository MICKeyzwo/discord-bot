const assert = require('assert');

const { objectToQueryString } = require('../lib/bot-utils');

assert.equal(objectToQueryString({hoge: 'fuga', foo: 'bar'}), '?hoge=fuga&foo=bar');
