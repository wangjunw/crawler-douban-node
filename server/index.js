const Koa = require("koa");
const { connect, initSchemas } = require("./database/init");
const app = new Koa();
(async () => {
  // 连接数据库
  await connect();
  // 初始化所有schema
  await initSchemas();
  //require('./tasks/movie-list'); //爬取电影列表
  //require('./tasks/douban-api'); //通过豆瓣api获取电影详情

  await initRouter();
  app.use(async (ctx, next) => {
    ctx.body = "电影天堂，欢迎你";
  });
})();

const initRouter = () => {
  const movieRouter = require("./routes/movie");
  const userRouter = require("./routes/user");
  app.use(movieRouter.routes()).use(movieRouter.allowedMethods());
  app.use(userRouter.routes()).use(userRouter.allowedMethods());
};

app.listen(4455);
