const Koa = require('koa');
const { connect, initSchemas } = require('./database/init');
const mongoose = require('mongoose');

(async () => {
    // 连接数据库
    await connect();
    // 初始化所有schema
    initSchemas();
    const Movie = mongoose.model('Movie');
    const movies = await Movie.find({});
    console.log(movies);
})();
const app = new Koa();
app.use(async (ctx, next) => {
    ctx.body = '电影天堂，欢迎你';
});

app.listen(4455);
