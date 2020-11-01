const SearchVideo = require('../../lib/commands/search-video');

const instance = new SearchVideo();

(async () => {

    console.log(await instance.exec('brain', 'power'));

    console.log(await instance.exec('ぴえん'));

})();
