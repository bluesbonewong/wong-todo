const db = require("../db");
const fs = require("fs"); // 这里require的实际上是假的fs模块
jest.mock("fs"); // 改变fs模块的路径（导向了假的fs模块）

describe("db", () => {
    // 每运行完一个it，都要清除mock
    afterEach(() => fs.clearMocks());

    it("can read", async () => {
        let data = [{title: "发mac和4k显示器", done: true}];
        fs.setReadMock("/xxx", null, JSON.stringify(data));
        let list = await db.read("/xxx");
        expect(list).toStrictEqual(data);
    });

    it("can write", async () => {
        let fakeFile = ""; // 假文件(变量)，用来存写文件的结果
        let data = [{title: "发mac和4k显示器", done: true}];

        fs.setWriteMock("/yyy", (path, data, options, cb) => {
            // 重载
            if (cb === undefined) cb = options;

            fakeFile = data;
            cb();
        });

        await db.write(data, "/yyy");
        expect(fakeFile).toStrictEqual(JSON.stringify(data));
    });
});
