const fs = require("fs");
const homedir = require("os").homedir(); // 获取用户home目录
const home = process.env.HOME || homedir; // 做阈值处理：防止用户自己设置了HOME Variable
const p = require("path");
const dbPath = p.join(home, ".todo"); // 拼接路径

module.exports = {
    read(path = dbPath) {
        // readFile是异步操作，所以要用promise
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: "a+"}, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let list;
                    // 防止文件是初创导致data为空，用try抓一下
                    try {
                        list = JSON.parse(data.toString());
                    } catch (err2) {
                        list = [];
                    }
                    resolve(list);
                }
            });
        });
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const str = JSON.stringify(list);
            fs.writeFile(path, str, {flag: "w"}, err => {
                if (err) reject(err);

                resolve();
            });
        });
    }
};
