const Router = require("koa-router");
const { checkPassword } = require("../service/user.js");

const router = new Router();
router.post("/user", async (ctx, next) => {
  const { email, password } = ctx.request.body;

  const matchData = await checkPassword(email, password);
  if (!matchData.user) {
    return (ctx.body = {
      suceess: false,
      err: "用户不存在"
    });
  }
  if (matchData.match) {
    return (ctx.body = {
      suceess: true
    });
  }
  return (ctx.body = {
    suceess: false,
    err: "账号或密码不正确"
  });
});

module.exports = router;
