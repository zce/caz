<div align="center">
  <a href="https://github.com/zce/caz"><img src="https://user-images.githubusercontent.com/6166576/88473000-af5fa800-cf4b-11ea-8ce4-59f1b1f09efe.png" alt="CAZ"></a>
  <p align="center">一个基于模板机制、简单而又强大的脚手架工具，用于提升我个人生产力。</p>
  <p align="center">
    <a href="https://github.com/zce/caz/actions"><img src="https://img.shields.io/github/workflow/status/zce/caz/CI" alt="构建状态"></a>
    <a href="https://codecov.io/gh/zce/caz"><img src="https://img.shields.io/codecov/c/github/zce/caz" alt="测试覆盖率"></a>
    <a href="https://github.com/zce/caz/blob/master/LICENSE"><img src="https://img.shields.io/github/license/zce/caz" alt="许可证"></a>
    <a href="https://npm.im/caz"><img src="https://img.shields.io/npm/v/caz" alt="NPM 版本"></a>
    <a href="https://npm.im/caz"><img src="https://img.shields.io/node/v/caz" alt="Node 版本要求"></a>
    <br>
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen" alt="代码风格"></a>
    <a href="https://npm.im/caz"><img src="https://img.shields.io/npm/dm/caz" alt="NPM 下载量"></a>
    <a href="https://packagephobia.com/result?p=caz"><img src="https://packagephobia.com/badge?p=caz" alt="安装包体积"></a>
    <a href="https://github.com/zce/caz"><img src="https://img.shields.io/github/repo-size/zce/caz" alt="仓库体积"></a>
  </p>
</div>

<br>

**简体中文** | [English](README.md)

## 简介

CAZ (**C**reate **A**pp **Z**en)

这是一个基于模板机制、简单而强大的脚手架工具，用于提升我个人生产力，受启发于 [Yeoman](https://yeoman.io)、[Vue CLI 2](https://npm.im/vue-cli) 等项目。

- 读作：[[kæz]](http://dict.youdao.com/dictvoice?audio=caz) 📷 ✌
- 写作：CAZ / caz

_更多介绍，请阅读[它如何工作](#如何工作)。_

### 特性

- 简单易用
- 轻量化
- 依然强大
- 高工作效率
- 零生产依赖
- 基于模板
- 可配置
- 可扩展
- 使用 TypeScript
- 使用现代化的 API

> 稍后我会给出具体的理由。

## 目录

- [简介](#简介)
  - [特性](#特性)
- [起步](#起步)
  - [环境准备](#环境准备)
  - [安装](#安装)
  - [快速起步](#快速起步)
- [配方](#配方)
  - [GitHub 仓库模板](#gitHub-仓库模板)
  - [本地模板](#本地模板)
  - [远程压缩包模板](#远程压缩包模板)
  - [离线模式](#离线模式)
  - [命令行参数](#命令行参数)
  - [调试模式](#调试模式)
  - [列出可用模板](#列出可用模板)
- [官方模板](#官方模板)
- [高级](#高级)
  - [配置选项](#配置选项)
  - [创建你的模板](#创建你的模板)
  - [创建你的脚手架](#创建你的脚手架)
- [参考资料](#参考资料)
- [开发动机](#开发动机)
- [概念](#概念)
  - [如何工作](#如何工作)
  - [用到什么](#用到什么)
- [路线图](#路线图)
- [参与贡献](#参与贡献)
- [许可证](#许可证)

## 起步

### 环境准备

- [Node.js](https://nodejs.org) (必须 >= 14.14, >= 16.13 更佳)
- [npm](https://www.npmjs.com) (>= 7.x) 或 [pnpm](https://pnpm.io) (>= 6.x) 或 [yarn](https://yarnpkg.com) (>= 1.22)
- [Git](https://git-scm.com) (>= 2.0)

### 安装

```shell
# 全局安装
$ npm install -g caz

# 或者使用 yarn 安装
$ yarn global add caz
```

### 快速起步

使用模板创建一个新项目。

```shell
$ caz <template> [project] [-f|--force] [-o|--offline]

# 使用官方模板
$ caz <template> [project]

# 使用 GitHub 仓库（自定义模板）
$ caz <owner>/<repo> [project]
```

如果您只是偶尔使用它，我建议您使用 `npx` 直接运行 `caz`。

```shell
$ npx caz <template> [project] [-f|--force] [-o|--offline]
```

#### 选项

- `-f, --force`: 如果目标存在就覆盖掉
- `-o, --offline`: 尝试使用本地离线缓存模板

## 配方

### GitHub 仓库模板

```shell
$ caz nm my-project
```

此命令会从 [caz-templates/nm](https://github.com/caz-templates/nm) 拉取模板，然后根据模板的配置，询问你一些问题，最后生成项目在 `./my-project`。

```shell
$ caz nm#typescript my-project
```

运行此命令，CAZ 将从 [caz-templates/nm](https://github.com/caz-templates/nm) 的 `typescript` 分支拉取模板。

#### 使用自定义模板

```shell
$ caz zce/nm my-project
```

此命令会从 [zce/nm](https://github.com/zce/nm) 拉取模板。这意味着你也可以从你的公开 GitHub 仓库拉取模板。

**注意：模板必须使用公开的仓库。**

### 本地模板

你也可以使用本地文件系统的模板。

例如：

```shell
$ caz ~/local/template my-project
```

以上命令将使用 `~/local/template` 文件夹作为模板。

### 远程压缩包模板

你也可以使用 zip 压缩包的模板。

例如：

```shell
$ caz https://cdn.zce.me/boilerplate.zip my-project
```

以上命令将从 `https://cdn.zce.me/boilerplate.zip` 下载并解压模板。

### 离线模式

```shell
$ caz nm my-project --offline
```

运行以上命令，CAZ 将尝试从缓存中找到 `nm` 模板，如果找不到该模板的缓存，它仍将自动从 GitHub 下载。

### 命令行参数

CAZ 允许你通过命令行参数来指定提示问题的答案。

```shell
$ caz minima my-project --name my-proj
```

运行以上命令，你就不用再回答接下来 `name` 的问题了。

### 调试模式

```shell
$ caz nm my-project --debug
```

`--debug` 参数将打开调试模式。

在调试模式下，一旦发生异常，命令行将自动输出异常详细信息。这对于查找模板中的错误非常有帮助。

### 列出可用模版

显示全部可用的模板：

```shell
$ caz list [owner] [-j|--json] [-s|--short]
```

#### 参数

- `[owner]`: GitHub 组织或用户的别名, 默认值：`'caz-templates'`

#### 选项

- `-j, --json`: 以 JSON 格式输出
- `-s, --short`: 以精简格式输出

## 官方模板

目前 CAZ 可用的官方模板有：

- [template](https://github.com/caz-templates/template) - 用来创建 [CAZ](https://github.com/zce/caz) 的模板
- [nm](https://github.com/caz-templates/nm) - 用来创建 [Node](https://nodejs.org) 模块
- [vercel](https://github.com/caz-templates/vercel) - 用来创建 [Vercel](https://vercel.com) 应用
- [react](https://github.com/caz-templates/react) - 用来创建现代化 [React](https://reactjs.org) 应用
- [vue](https://github.com/caz-templates/vue) - 用来创建现代化 [Vue.js](https://vuejs.org) 应用
- [vite](https://github.com/caz-templates/vite) - 用来创建基于 [Vite](https://github.com/vitejs/vite) 的 Vue.js 应用
- [electron](https://github.com/caz-templates/electron) - :construction: 用来创建 [Electron](https://electronjs.org) 应用
- [mp](https://github.com/caz-templates/mp) - :construction: 用来创建[微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework)
- [jekyll](https://github.com/caz-templates/jekyll) - :construction: 用来创建 [Jekyll](https://jekyllrb.com) 站点
- [x-pages](https://github.com/caz-templates/x-pages) - 用来创建 [X-Pages](https://github.com/zce/x-pages) 静态站点

可能还有更多：https://github.com/caz-templates

> 你也可以通过运行 `$ caz list` 命令来实时列出所有官方模板。

**目前所有模板都托管在 GitHub 上，中国用户可以[使用在 coding.net 上镜像](#中国用户镜像)。**

## 高级

### 配置选项

CAZ 将会读取 `~/.cazrc` 配置文件，默认配置：

```ini
; 模板下载地址
; {owner} & {name} & {branch} 最终将被相应的值替换。
registry = https://github.com/{owner}/{name}/archive/{branch}.zip
; 模板缺省 owner 的值，可以理解为官方名称
official = caz-templates
; 缺省的模板分支名称
branch = master
```

这就意味着你可以通过修改配置文件来自定义配置。

例如，你的 `~/.cazrc`：

```ini
registry = https://gitlab.com/{owner}/{name}/archive/{branch}.zip
official = faker
branch = main
```

然后运行以下命令：

```shell
$ caz nm my-project
```

这样就会从 `https://gitlab.com/faker/nm/archive/main.zip` 下载模板。

#### 中国用户镜像

由于网络限制，很多时候下载 GitHub 上的模板都会超时，你可以考虑使用我在 [coding.net](https://coding.net) 上镜像的模板。

`~/.cazrc`:

```ini
registry = https://zce.coding.net/p/{owner}/d/{name}/git/archive/{branch}
official = caz
```

### 创建你的模板

```shell
$ caz template my-template
```

以上命令会从 [caz-templates/template](https://github.com/caz-templates/template) 下载模板，并帮你创建你自己的 CAZ 模板。

创建并发布模板，详细可以请参考 [如何创建模板](docs/create-template.zh-CN.md)。

> 也许 fork 一个官方模板是一个更好的决定。

### 创建你的脚手架

```shell
# 本地安装 caz 模块
$ npm install caz

# 或者使用 yarn 安装
$ yarn add caz
```

以 ESM 和 async/await 的方式使用：

```javascript
import caz from 'caz'

try {
  const template = 'nm'
  // project path (relative cwd or full path)
  const project = 'my-project'
  const options = { force: false, offline: false }
  // scaffolding by caz...
  await caz(template, project, options)
  // success created my-project by nm template
} catch (e) {
  // error handling
  console.error(e)
}
```

或者使用 CommonJS 和 Promise 的方式：

```javascript
const { default: caz } = require('caz')

const template = 'nm'
// project path (relative cwd or full path)
const project = 'my-project'
const options = { force: false, offline: false }
// scaffolding by caz...
caz(template, project, options)
  .then(() => {
    // success created my-project by nm template
  })
  .catch(e => {
    // error handling
    console.error(e)
  })
```

这也就意味着你可以基于 CAZ 模块开发自己的脚手架工具。

创建并发布脚手架工具，详细可以请参考 [如何创建脚手架工具](docs/create-scaffold.zh-CN.md)。

## 参考资料

<!-- API Docs -->

### caz(template, project?, options?)

使用指定模板创建一个新项目

#### template

- 类型：`string`
- 描述：模板名称，也可以是模板文件夹路径

#### project

- 类型：`string`
- 描述：项目名称，也可以是项目文件夹路径
- 默认值：`'.'`

#### options

- 类型：`object`
- 描述：选项参数 & 预设询问结果
- 默认值：`{}`

##### force

- 类型：`boolean`
- 描述：如果目标路径已存在就强制覆盖
- 默认值：`false`

##### offline

- 类型：`boolean`
- 描述：尝试使用离线模板
- 默认值：`false`

##### [key: string]

- 类型：`any`
- 描述：命令行参数覆盖问题答案

## 开发动机

👉 🛠 ⚙

开个玩笑：我就是想造个轮子 ;P

真实的原因是因为我觉得我需要一个更适合我的个人生产力的脚手架工具：简洁、强大、高效。现存的工具因为出发点的不同，都或多或少有一定的局限性。

再无其他

## 概念

### 如何工作

![脚手架工作流程](https://user-images.githubusercontent.com/6166576/88473012-d4ecb180-cf4b-11ea-968a-5508c6f84502.png)

> P.S. 图片来自互联网，但是我没有记住具体来源，这里对愿作者说声抱歉。

#### 主要的工作流程

[核心代码](src/index.ts) 是基于 [zce/mwa](https://github.com/zce/mwa) 项目提供的中间件机制。

以下中间件将按顺序依次执行：

1. [confirm](src/confirm.ts) - 使用 [prompts](https://github.com/terkelg/prompts) 确认目标路径可用。
2. [resolve](src/resolve.ts) - 从远程或者本地磁盘中找到模板。
3. [load](src/load.ts) - 自动安装模板依赖项，使用 `require` 加载模板的配置文件。
4. [inquire](src/inquire.ts) - 使用 [prompts](https://github.com/terkelg/prompts) 询问用户模板所需要的问题。
5. [setup](src/setup.ts) - 只是调用模板中定义的 `setup` 钩子函数。
6. [prepare](src/prepare.ts) - 过滤掉不需要的文件，并读取全部将要输出的文件内容。
7. [rename](src/rename.ts) - 如果文件名中包含插值表达式就重命名文件（替换文件名中的变量）。
8. [render](src/render.ts) - 如果文件是一个模板文件就渲染文件内容（替换文件内容中的变量）。
9. [emit](src/emit.ts) - 将每一个文件内容输出写入到目标路径。
10. [install](src/install.ts) - 如果需要的话，执行 `npm | yarn | pnpm install`。
11. [init](src/init.ts) - 如果需要的话，执行 `git init && git add && git commit`。
12. [complete](src/complete.ts) - 只是调用模板中定义的 `complete` 钩子函数。

### 用到什么

- [adm-zip](https://github.com/cthackers/adm-zip) - 一个 JavaScript 实现的 zip 文件压缩解压缩的库，支持内存和磁盘上的压缩解压缩。
- [cac](https://github.com/cacjs/cac) - 简单而强大的命令行工具框架。
- [env-paths](https://github.com/sindresorhus/env-paths) - 获取系统存储路径，例如数据、配置、缓存等。
- [fast-glob](https://github.com/mrmlnc/fast-glob) - 非常快的和非常高效的 glob 库，用于 Node.js
- [ini](https://github.com/npm/ini) - 一个 Node.js 的 ini 文件解析器。
- [lodash](https://github.com/lodash/lodash) - Lodash 工具库。
- [node-fetch](https://github.com/node-fetch/node-fetch) - 一个 Node.js 的 fetch API 的封装。
- [ora](https://github.com/sindresorhus/ora) - 强大的终端加载动画。
- [prompts](https://github.com/terkelg/promptss) - 轻量级，美观的和用户友好的提示。
- [semver](https://github.com/npm/node-semver) - 一个 Node.js 的 semver 库。
- [validate-npm-package-name](https://github.com/npm/validate-npm-package-name) - 一个 Node.js 的 npm 包名验证器。

## 路线图

以下是我想要实现或者正在开发的功能：

- [ ] config 命令
- [ ] cache 命令
- [ ] 全部生命周期钩子
- [ ] 静默控制台输出 & 彩色控制台输出
- [ ] 越来越多的官方模板

也可以查看 [打开的 Issues](https://github.com/zce/caz/issues) 中有关建议功能（和已知问题）的列表。

## 参与贡献

1. **Fork** 一个仓库在 GitHub 上!
2. **Clone** 你复刻的仓库到你本地机器上
3. **Checkout** 一个特性分支：`git checkout -b my-awesome-feature`
4. **Commit** 你的修改到你自己的分支上：`git commit -am 'Add some feature'`
5. **Push** 你的修改到你复刻的仓库中：`git push -u origin my-awesome-feature`
6. 提交一个 **Pull Request** 让我可以看到你的修改

> **提示**: 请确保尝试合并你的修改之前已经拉取了上游最新的代码。

## 许可证

基于 MIT 协议开源，有关详细信息请查看 [LICENSE](LICENSE) 文件。&copy; [汪磊](https://zce.me)

<!-- Acknowledgements -->
