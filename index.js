const db = require("./db");
const {printTask} = require("./printTask");

let api = {
    async add(title) {
        // 读取之前的任务
        let list = await db.read();
        // 插入任务
        list.push({title, done: false});
        // 存储到db
        await db.write(list);
    },
    async clear() {
        // 直接调用write，将db覆盖
        await db.write([]);
    },
    async showAll() {
        // 获取之前的任务
        let list = await db.read();
        // 打印之前的任务
        printTask(list);
    }
};

module.exports = api;
