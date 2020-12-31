const Omikuji = require('../../lib/commands/omikuji');

const instance = new Omikuji();

(async () => {

    console.log(await instance.exec());

    console.log(await instance.exec());

})();
