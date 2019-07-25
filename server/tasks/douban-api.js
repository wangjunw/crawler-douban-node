const rp = require('request-promise-native');
async function fetchMovie(item) {
    const url = `http://douban.uieee.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    return res;
}
(async () => {
    let movies = [
        {
            doubanId: 1866475,
            title: '无敌浩克',
            rate: 7,
            picLink:
                'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p916263375.jpg'
        },
        {
            doubanId: 1432146,
            title: '钢铁侠',
            rate: 8.2,
            picLink:
                'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p725871968.jpg'
        }
    ];
    movies.map(async movie => {
        let movieData = await fetchMovie(movie);
        try {
            let resultObj = JSON.parse(movieData);
            console.log(resultObj);
        } catch (err) {
            console.log(err);
        }
    });
})();
