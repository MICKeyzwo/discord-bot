import RandomWord from '../../lib/commands/random-word';

const instance = new RandomWord();

(async () => {

    console.log(await instance.exec());

    console.log(await instance.exec());

})();
