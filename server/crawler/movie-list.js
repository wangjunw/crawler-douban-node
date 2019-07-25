const puppeteer = require('puppeteer');
const url = `https://movie.douban.com/tag/#/?sort=U&range=0,10&tags=%E7%BE%8E%E5%9B%BD,%E7%94%B5%E5%BD%B1`;

const sleep = time =>
    new Promise(resolve => {
        setTimeout(resolve, time);
    });
(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });
    const page = await browser.newPage();
    /**
     * 导航到的地址
     * waitUntil：满足什么条件认为跳转完成，networkidle2只有2个网络连接时触发
     *  */
    await page.goto(url, { waitUntil: 'networkidle2' });
    await sleep(1000);

    // 要等待的元素选择器，加载更多按钮
    await page.waitForSelector('.more');

    await sleep(1000);
    // 点击按钮
    await page.click('.more');

    const result = await page.evaluate(() => {
        // 因为网站引用了jquery，所以可以直接使用全局的$变量
        let $ = window.$;
        // 列表中的每一项
        let items = $('.list-wp a');
        let list = [];
        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item);
                let doubanId = it.children('.cover-wp').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                // 拿到图片路径，替换为清晰大图
                let picLink = it
                    .find('img')
                    .attr('src')
                    .replace('s_ratio', 'l_ratio');

                list.push({ doubanId, title, rate, picLink });
            });
        }
        return list;
    });
    browser.close();
    // 拿到结果
    console.log(result);

    // 发送结果并退出进程，在子进程脚本中接收
    process.send({ result });
    process.exit(0);
})();
