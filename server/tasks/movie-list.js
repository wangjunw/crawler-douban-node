/**
 * 爬取电影数据任务，并存库
 */
const cp = require('child_process');
const { resolve } = require('path');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

(async () => {
    // 获取到脚本
    const script = resolve(__dirname, '../crawler/movie-list.js');
    // 通过把脚本传递给fork，得到一个子进程对象
    const childProcess = cp.fork(script, []);
    let invoked = false;
    // 监听子进程报错
    childProcess.on('error', err => {
        if (invoked) {
            return;
        }
        invoked = true;
        console.log(err);
    });
    // 进程退出
    childProcess.on('exit', code => {
        if (invoked) {
            return;
        }
        invoked = false;
        let err = code === 0 ? null : new Error('exit code：' + code);
        console.log(err);
    });
    childProcess.on('message', data => {
        let result = data.result;
        console.log(result);
        // 把结果存储到数据库
        result.forEach(async item => {
            let movie = await Movie.findOne({ doubanId: item.doubanId });
            // 判断如果没有电影信息则存库
            if (!movie) {
                movie = new Movie(item);
                await movie.save();
            }
        });
    });
})();
