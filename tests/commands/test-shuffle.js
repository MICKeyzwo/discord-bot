const assert = require('assert');

const Shuffle = require('../../lib/commands/shuffle');

const instance = new Shuffle();

console.log(instance.exec('hoge', 'fuga', 'foo', 'bar'));
