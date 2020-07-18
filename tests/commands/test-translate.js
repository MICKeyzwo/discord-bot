const assert = require('assert');

const Translate = require('../../lib/commands/translate');

const instance = new Translate();

(async () => {

    assert.equal(await instance.exec('こんにちは'), 'Hello');

    assert.equal(await instance.exec('ja2en', 'こんにちは'), 'Hello');

    assert.equal(await instance.exec('xx2zz', 'こんにちは'), 'Translation Error! Language selection may be mulformed!');

    assert.equal(await instance.exec('ja2en2de', 'こんにちは'), 'Hallo');

})();
