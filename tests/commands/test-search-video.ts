import SearchVideo from '../../lib/commands/search-video';

const instance = new SearchVideo();

(async () => {

    console.log(await instance.exec('brain', 'power'));

    console.log(await instance.exec('ぴえん'));

    console.log(await instance.exec('--unsafe', 'tri poloski'));

})();
