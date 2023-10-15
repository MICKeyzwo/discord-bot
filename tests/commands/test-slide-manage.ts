import dotenv from 'dotenv';

import SlideManage from '../../lib/commands/slide-manage';

dotenv.config();

const instance = new SlideManage();

(async () => {

    console.log(await instance.exec('list'));
    console.log(await instance.exec('addTime'));
    console.log(await instance.exec('add', 'mickey', 'てすと', 'https://www.google.com'));

})();
