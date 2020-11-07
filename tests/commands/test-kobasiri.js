const Kobasiri = require('../../lib/commands/kobasiri');

const instance = new Kobasiri();

(async () => {

    console.log(await instance.exec());

    console.log(await instance.exec());

    console.log(await instance.exec());

    console.log(await instance.exec());

    console.log(await instance.exec());

})();
