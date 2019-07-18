const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    ctx.body = '电影天堂，欢迎你';
});

app.listen(4455);
