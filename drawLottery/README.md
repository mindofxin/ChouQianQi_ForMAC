# 抽签器项目文档

## 项目概述

本项目是一个结合了 Electron 桌面应用和 Vue 3 前端的抽签器。用户可以通过前端界面上传名单文件，进行随机抽签操作，并在界面上查看抽签结果。该应用支持跨平台运行，适合各种需要随机抽取的场景。

## 项目结构

```plaintext
drawLottery/
├── desktop/
│   ├── dist/                # 桌面应用构建输出目录
│   ├── logo/                # 桌面应用图标目录
│   ├── main.js              # Electron 主进程文件
│   ├── package.json         # 桌面应用依赖和脚本配置
│   └── web/                 # 桌面应用内嵌网页
└── web/
    ├── .gitignore           # Git 忽略文件配置
    ├── index.html           # 前端入口 HTML 文件
    ├── jsconfig.json        # JavaScript 配置文件
    ├── package.json         # 前端依赖和脚本配置
    ├── src/                 # 前端源代码目录
    │   ├── App.vue          # 前端主组件
    │   └── main.js          # Vue 应用入口文件
    └── vite.config.js       # Vite 配置文件
```

## 技术栈

### 前端

-   **Vue 3**：用于构建响应式的用户界面。
-   **Element Plus**：提供丰富的 UI 组件，加速界面开发。
-   **Vite**：快速的前端构建工具，提升开发效率。
-   **XLSX**：用于处理 Excel 文件，支持用户上传名单文件。

### 桌面应用

-   **Electron**：基于 Chromium 和 Node.js，用于构建跨平台的桌面应用。

## 开发环境配置

### 推荐 IDE

-   [VSCode](https://code.visualstudio.com/)：功能强大的代码编辑器。
-   [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)：Vue 3 官方推荐的 VSCode 插件，需禁用 Vetur。

### 环境准备

确保你已经安装了以下环境：

-   [Node.js](https://nodejs.org/)（建议版本 >= 16.x）
-   [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)（建议使用 npm）

## 项目设置与运行

### 前端项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产环境版本
npm run build

# 预览生产环境版本
npm run preview
```

### 桌面应用

```bash
# 开发模式
npm run dev

# 构建应用
npm run build
```

## 使用方法

### 上传名单

1. 启动应用后，在界面中找到“上传名单”区域。
2. 点击“拖动或者点击上传文件”，选择包含名单的 Excel 文件。

### 进行抽签

1. 上传名单成功后，输入需要抽取的人数。
2. 点击“开始抽签”按钮，等待抽签结果显示。

### 查看结果

抽签结束后，抽签结果将显示在“抽签结果”区域。

## 注意事项

-   `desktop/main.js` 中的 `nodeIntegration` 建议设置为 `false`，以提高应用的安全性。
-   开发过程中，可以在窗口创建后手动打开开发者工具进行调试。

## 常见问题解答

### 1. 上传文件后没有显示名单怎么办？

确保上传的文件格式为 Excel 文件，并且文件内容符合要求。如果问题仍然存在，请检查控制台输出的错误信息。

### 2. 应用启动失败怎么办？

检查依赖是否正确安装，可以尝试重新运行 `npm install`。如果问题仍然存在，请查看日志文件中的错误信息。

### 2. 特色是什么？

轮播抽奖，好用又好看！
