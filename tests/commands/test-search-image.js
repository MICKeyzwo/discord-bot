const SearchImage = require('../../lib/commands/search-image');

const instance = new SearchImage();

(async () => {

    console.log(await instance.exec('現場猫'));

    console.log(await instance.exec('現場猫'));

})();
