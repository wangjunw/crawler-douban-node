const cp = require('child_process');
const { resolve } = require('path');

(async () => {
    // 获取到脚本
    const script = resolve(__dirname, '../crawler/movie-traller.js');
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
        console.log('error:', err);
    });
    childProcess.on('message', data => {
        console.log(data);
    });
})();
