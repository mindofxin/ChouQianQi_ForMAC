const { app, BrowserWindow } = require("electron");
const path = require("path");
// 定义全局变量

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            devTools: false,
            webSecurity: false,
            nodeIntegration: true, // 为安全考虑，设为 false
            contextIsolation: true, // 开启上下文隔离
            preload: path.resolve(__dirname, "./preload.js"), // 指定预加载脚本
        },
        icon: "./logo/logo.png",
    });

    win.loadFile(path.resolve(__dirname, "./web/index.html"));
    // 尝试在窗口创建后手动打开开发者工具
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
