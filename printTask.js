const db = require("./db");
const inquirer = require("inquirer");

function printTask(list) {
    let choices = list.map((item, index) => {
        return {name: `${item.done ? "[x]" : "[_]"} ${index + 1} - ${item.title}`, value: index.toString()};
    }).concat([{name: "创建任务", value: "-1"}, {name: "退出", value: "-2"}]);
    inquirer
    .prompt([
        {
            type: "list",
            name: "index",
            message: "请选择你想选择的操作",
            choices
        }
    ])
    .then((answers) => {
        const idx = parseInt(answers.index);
        if (idx >= 0) askForAction(list, idx);
        else if (idx === -1) askForCreateTask(list);
    });
}

// 更多操作
function askForAction(list, idx) {
    const actions = {markAsDone, markAsUndo, updateTitle, remove};
    inquirer
    .prompt([
        {
            type: "list",
            name: "index",
            message: "请选择你想选择的操作",
            choices: [
                {name: "已完成", value: "markAsDone"},
                {name: "未完成", value: "markAsUndo"},
                {name: "改标题", value: "updateTitle"},
                {name: "删除", value: "remove"},
                {name: "退出", value: "quit"}
            ]
        }
    ])
    .then((answers) => {
        const action = actions[answers.index];
        action && action(list, idx);
    }).then();
}

function markAsDone(list, idx) {
    list[idx].done = true;
    db.write(list).then(() => console.log("操作成功！"), () => console.log("操作失败！"));
}

function markAsUndo(list, idx) {
    list[idx].done = false;
    db.write(list).then(() => console.log("操作成功！"), () => console.log("操作失败！"));
}

function updateTitle(list, idx) {
    inquirer
    .prompt([
        {
            type: "input",
            name: "title",
            message: "请输入标题",
        }
    ])
    .then((answers) => {
        list[idx].title = answers.title;
        db.write(list).then(() => console.log("操作成功！"), () => console.log("操作失败！"));
    });
}

function remove(list, idx) {
    list.splice(idx, 1);
    db.write(list).then(() => console.log("操作成功！"), () => console.log("操作失败！"));
}

// 创建任务
function askForCreateTask(list) {
    inquirer
    .prompt([
        {
            type: "input",
            name: "title",
            message: "请输入标题",
        }
    ])
    .then((answers) => {
        let task = {title: answers.title};
        list.push(task);
        db.write(list).then(() => console.log("操作成功！"), () => console.log("操作失败！"));
    });
}

module.exports.printTask = printTask;
