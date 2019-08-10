/**
 * 通过豆瓣api获取数据
 */
const rp = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
async function fetchMovie(item) {
    const url = `http://douban.uieee.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    let body;
    try {
        body = JSON.parse(res);
    } catch (err) {
        console.log(err);
    }
    return body;
}
(async () => {
    let movies = await Movie.find({
        // 查询满足以下某一条件的数据（这里查的也就是信息不完整的数据）
        $or: [
            { summary: { $exists: false } }, //没有summary字段，说明是新插入的数据
            { summary: null },
            { year: { $exists: false } },
            { title: '' },
            { summary: '' }
        ]
    });
    for (let i = 0, len = movies.length; i < len; i++) {
        let movie = movies[i];
        // 通过api拿到详情
        let movieData = await fetchMovie(movie);
        // 补全信息
        if (movieData) {
            let tags = movieData.tags || [];
            movie.tags = [];
            movie.summary = movieData.summary || '';
            movie.title = movieData.alt_title || movieData.title || '';
            movie.rawTitle = movieData.rawTitle || movieData.title || '';
            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || [];
                for (let i = 0; i < movie.movieTypes.length; i++) {
                    let item = movie.movieTypes[i];
                    // 操作类型库
                    let cat = await Category.findOne({
                        name: item
                    });
                    // 如果没有查到类型就创建
                    if (!cat) {
                        cat = new Category({
                            name: item,
                            movies: [movie._id]
                        });
                    }
                    // 如果查到了
                    else {
                        // 判断movies字段中没有包含当前电影数据的id就添加进去
                        if (cat.movies.indexOf(movie._id) === -1) {
                            cat.movies.push(movie._id);
                        }
                    }
                    await cat.save();

                    // 检查电影的类型字段，如果为空就添加
                    if (!movie.category) {
                        movie.category.push(cat._id);
                    } else {
                        // 判断是否存过当前category，如果没有就保存
                        if (movie.category.indexOf(cat._id) === -1) {
                            movie.category.push(cat._id);
                        }
                    }
                }

                // pubdate的格式为：2020-07-24(美国)
                let dates = movieData.attrs.pubdate || [];
                let pubdate = [];
                dates.map(item => {
                    if (item && item.split('(').length > 0) {
                        let parts = item.split('(');
                        let date = parts[0];
                        let country = '未知';
                        if (parts[1]) {
                            country = parts[1].split(')')[0];
                        }
                        pubdate.push({
                            date: new Date(date),
                            country
                        });
                    }
                });
                movie.pubdate = pubdate;
            }

            // 标签
            console.log(tags);
            tags.forEach(tag => {
                movie.tags.push(tag);
            });

            await movie.save();
        }
    }
})();
