const Koa = require('koa');
const { connect, initSchemas } = require('./database/init');
const mongoose = require('mongoose');

(async () => {
    // 连接数据库
    await connect();
    // 初始化所有schema
    initSchemas();
    //require('./tasks/movie-list'); //爬取电影列表
    require('./tasks/douban-api'); //通过豆瓣api获取电影详情
})();
const app = new Koa();
app.use(async (ctx, next) => {
    ctx.body = '电影天堂，欢迎你';
});

app.listen(4455);
