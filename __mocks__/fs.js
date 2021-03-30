const fs = jest.createMockFromModule("fs"); // 指定要mock的模块
const _fs = jest.requireActual("fs"); // 导入实际的fs模块

Object.assign(fs, _fs); // 把_fs拷贝一份到fs

// 写一个假的readFile
let readMocks = {};
/*
 @param path 文件路径
 @param error 回调的第一个参数
 @param data 回调的第二个参数
 */
fs.setReadMock = (path, error, data) => {
    readMocks[path] = [error, data];
};

fs.readFile = (path, options, cb) => {
    // 重载
    if (cb === undefined) {
        cb = options;
        options = undefined;
    }
    // 如果path是mock的，就用假fs
    if (path in readMocks) {
        cb(...readMocks[path]);
        return;
    }

    // 否则用真fs
    _fs.readFile(path, options, cb);
};

// 写一个假的writeFile
let writeMocks = {};
/*
 @param path 文件路径
 @param fn mockWrite的回调 - 由于不能写到真实的文件里，因此我们需要利用回调来写到mock里
 */
fs.setWriteMock = (path, fn) => {
    writeMocks[path] = fn;
};

fs.writeFile = (path, data, options, cb) => {
    // 如果path是mock的，就用假fs
    if (path in writeMocks) {
        writeMocks[path](path, data, options, cb);
        return;
    }

    // 否则用真fs
    _fs.writeFile(path, data, options, cb);

};

fs.clearMocks = () => {
    readMocks = {};
    writeMocks = {};
};

module.exports = fs;
