const mongoose = require('mongoose');
const { resolve } = require('path');
const db = 'mongodb://localhost/douban-trailer';
const glob = require('glob'); // 允许使用*号引入所有文件
// 把mongoose内置的Promise替换成js的Promise
mongoose.Promise = global.Promise;
//加载所有schame
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require);
};
exports.connect = () => {
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        // 如果不是生产环境，打开debug模式
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(db, { useNewUrlParser: true });

        // 对连接增加事件监听
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('数据库 game over!!');
            }
        });
        mongoose.connection.on('error', err => {
            console.log(err);
        });
        mongoose.connection.once('open', () => {
            resolve();
            console.log('mongodb connect success!');
        });
    });
};
