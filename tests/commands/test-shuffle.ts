import Shuffle from '../../lib/commands/shuffle';

const instance = new Shuffle();

console.log(instance.exec('hoge', 'fuga', 'foo', 'bar'));
