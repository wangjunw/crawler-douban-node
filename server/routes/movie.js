const Router = require("koa-router");
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require("../service/movie.js");
// const router = new Router({
//     prefix: '/movies'
// });
const router = new Router();
router.get("/movies", async (ctx, next) => {
  const { type, year } = ctx.query;
  const movies = await getAllMovies(type, year);
  ctx.body = {
    movies
  };
});

router.get("/movie/:id", async (ctx, next) => {
  const id = ctx.params.id;
  const movie = await getMovieDetail(id);
  const relativeMovies = await getRelativeMovies(movie);
  ctx.body = {
    data: {
      movie,
      relativeMovies
    },
    success: true
  };
});

module.exports = router;
