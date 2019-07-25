const puppeteer = require('puppeteer');
// 详情页
const base = `https://movie.douban.com/subject/`;
const doubanId = '24773958';
const videoBase = `https://movie.douban.com/trailer/230072/`;
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
    await page.goto(base + doubanId, { waitUntil: 'networkidle2' });
    await sleep(1000);

    // 爬取预告片视频
    const result = await page.evaluate(() => {
        let $ = window.$;
        let it = $('.related-pic-video');
        if (it && it.length > 0) {
            let link = it.attr('href'); // 连接
            let coverImg = it
                .css('background-image')
                .replace('url("', '')
                .replace(')"', ''); // 图片
            return {
                link,
                coverImg
            };
        }

        return {};
    });

    // 如果有连接，获取预告片视频
    let video;
    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        });
        await sleep(1000);
        video = await page.evaluate(() => {
            var $ = window.$;
            var it = $('source');
            if (it && it.length > 0) {
                return it.attr('src');
            }
            return '';
        });
    }

    const data = {
        video,
        doubanId,
        coverImg: result.coverImg
    };

    browser.close();
    process.send({ data });
    process.exit(0);
})();
