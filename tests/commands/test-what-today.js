const WhatToday = require('../../lib/commands/what-today');

const instance = new WhatToday();

(async () => {

    console.log(await instance.exec());

    console.log(await instance.exec());

})();
