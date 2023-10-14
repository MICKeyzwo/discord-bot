import Poker from '../../lib/commands/poker';

const instance = new Poker();

console.log(instance.exec());

console.log(instance.hasStraight([
    {number: 0}, {number: 1}, {number: 2}, {number: 3}, {number: 12}
]));

console.log(instance.hasStraight([
    {number: 3}, {number: 4}, {number: 5}, {number: 6}, {number: 7}
]));

console.log(instance.hasStraight([
    {number: 4}, {number: 4}, {number: 5}, {number: 6}, {number: 7}
]));

console.log(instance.hasStraight([
    {number: 1}, {number: 2}, {number: 3}, {number: 4}, {number: 12}
]));

console.log(instance.hasFlush([
    {suit: 'S'}, {suit: 'S'}, {suit: 'S'}, {suit: 'S'}, {suit: 'S'}
]));

console.log(instance.hasFlush([
    {suit: 'S'}, {suit: 'S'}, {suit: 'H'}, {suit: 'S'}, {suit: 'S'}
]));
