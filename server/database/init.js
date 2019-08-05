const mongoose = require('mongoose');
const db = 'mongodb://localhost/douban-trailer';
// 把mongoose内置的Promise替换成js的Promise
mongoose.Promise = global.Promise;

exports.connet = () => {
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        // 如果不是生产环境，打开debug模式
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(db);

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
            console.log('mongodb connect success!');
        });
    });
};
