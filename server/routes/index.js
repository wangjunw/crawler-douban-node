const Router = require('koa-router');
const mongoose = require('mongoose');
const router = new Router({
    prefix: '/movies'
});
router.get('/all', async (ctx, next) => {
    const Movie = mongoose.model('Movie');
    const movies = await Movie.find({}).sort({
        'meta.createdAt': -1
    });
    ctx.body = {
        movies
    };
});

router.get('/detail/:id', async (ctx, next) => {
    const Movie = mongoose.model('Movie');
    const id = ctx.params.id;
    const movie = await Movie.findOne({ _id: id });
    ctx.body = {
        movie
    };
});

module.exports = router;
