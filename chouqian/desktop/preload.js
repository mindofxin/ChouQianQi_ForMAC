const { contextBridge } = require("electron");
const { app } = require("electron");
const { readFileSync } = require("fs");
const path = require("path");
// 定义全局变量
// 获取下载文件夹路径
// const downloadPath = app.getPath("downloads");

// try {
//     // 假设要读取的文件名为 example.txt，你可以根据实际情况修改
//     const mustPath = path.join(downloadPath, "must.txt");
//     const noPath = path.join(downloadPath, "no.txt");
//     const mustContent = readFileSync(mustPath, "utf8");
//     const noContent = readFileSync(noPath, "utf8");
//     console.log("文件内容:", mustContent, noContent);
// } catch (error) {
//     console.error("读取文件时出错:", error);
// }

const must = [
    "许天翼",
    "刘萌",
    "姜增星",
    "朱舒凡",
    "吴洁",
    "李烨",
    "孙鹤",
    "陈舫",
    "陈秋月",
    "张伟",
    "张超",
    "朱雍",
    "王靖雯",
];

const no = ["李琳", "王敬", "张美琪", "张瑜", "温晨晨", "陈姣宇", "丁雨辰"];

contextBridge.exposeInMainWorld("res", {
    must,
    no,
});
