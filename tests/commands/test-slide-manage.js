require('dotenv').config();

const SlideManage = require('../../lib/commands/slide-manage');

const instance = new SlideManage();

(async () => {

    console.log(await instance.exec('list'));
    console.log(await instance.exec('addTime'));
    console.log(await instance.exec('add', 'mickey', 'てすと', 'https://www.google.com'));

})();
