#! /usr/bin/env node
const {program} = require("commander");
const api = require("./index");
const version = require("./package.json").version;

// 指定版本号
program.version(version);

// add
program
.command("add")
.description("add a task")
.action((...arguments) => {
    let task = arguments[arguments.length - 1].args.join(" ");
    api.add(task).then(success => console.log("添加成功！"), err => console.log("添加失败！", err));
});

// clear
program
.command("clear")
.description("clear all task")
.action(async () => {
    api.clear().then(success => console.log("清除成功！"), err => console.log("清除失败！"));
    console.log("list is cleared!");
});

// showAll
program
.command("show")
.description("show & edit all task")
.action(async () => {
    await api.showAll();
});

// 这玩意必须放在最下面
program.parse(process.argv); // 接受输入的参数
