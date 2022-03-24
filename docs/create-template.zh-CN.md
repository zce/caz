# 从头开始编写自定义模板

**简体中文** | [English](create-template.md)

通过阅读这部分，你将学习如何创建和发布你自己的 CAZ 模版。

## 模板结构

```
└── my-template
    ├── template ··················· 模板源文件目录（必须的，但可以配置为其他名称）
    │   ├── lib ···················· 任何文件夹（可以递归包含任意层级的子目录）
    │   │   ├── {name}.js ·········· 文件名包含插值表达式（自动替换插值重命名）
    │   │   └── logo.png ··········· 其他文件（二进制文件不经过加工，自动拷贝输出）
    │   └── package.json ··········· 文件内容包含插值表达式（自动经过模板引擎加工）
    ├── index.js ··················· 入口文件（可选的，作为模板配置文件）
    ├── package.json ··············· 模板包信息文件（可选的）
    └── README.md ·················· 模板自述文件（可选的）
```

## 使用模板创建一个自定义模板

我们开发了一个 [template](https://github.com/caz-templates/template) 用于帮助用户快速创建自己的自定义模板。

```shell
$ caz template my-template
```

一旦你理解了以下的基本概念，就可以使用它来引导你创建自己的模板。

## 配置选项

一个模板仓库可以有一个配置文件，这个配置文件可以是 `index.js` 或者是在 `package.json` 中 `main` 字段定义的文件。

这个文件必须导出一个对象：

```javascript
module.exports = {
  // 你的自定义配置...
}
```

对象类型：[Template](#template)

这个配置文件可以包含以下字段：

### name

模板名称

- 类型：`string`

```javascript
module.exports = {
  name: 'my-template'
}
```

### version

模板版本

- 类型：`string`

```javascript
module.exports = {
  version: '0.1.0'
}
```

### source

模板源文件目录

- 类型：`string`
- 默认值：`'template'`

```javascript
module.exports = {
  source: 'template'
}
```

### metadata

可以在模板文件中使用的预设元数据

- 类型：`Record<string, unknown>`

```javascript
module.exports = {
  metadata: {
    bio: 'my template generated',
    year: new Date().getFullYear()
  }
}
```

一旦定义了以上数据，可以在模板文件中使用以下方式：

```ejs
<%= bio %>
// => 'my template generated'
<%= year %>
// => 2022 (current year)
```

### prompts

交互式询问，使用 [prompts](https://github.com/terkelg/prompts)，请参考 [prompts 文档](https://github.com/terkelg/prompts#-prompt-objects)

- 类型：`PromptObject | PromptObject[]`
- 默认值：`'{ name: 'name', type: 'text', message: 'Project name' }'`

```javascript
module.exports = {
  prompts: [
    { name: 'name', type: 'text', message: 'Project name' },
    { name: 'version', type: 'text', message: 'Project version' },
    { name: 'sass', type: 'confirm', message: 'Use sass preprocessor?', initial: true }
  ]
}
```

使用以下键名将自动分配初始值（来自其他配置或系统信息）：

- `name` - 目标文件夹名称，默认值：`path.basename(dest)`
- `version` - npm 配置的版本号，默认值：`'0.1.0'`
- `author` - npm 或 git 配置的作者
- `email` - npm 或 git 配置的邮箱
- `url` - npm 或 git 配置的网址

使用以下键名将自动指定默认验证器：

- `name` - 使用 [validate-npm-package-name](https://github.com/npm/validate-npm-package-name)
- `version` - 使用 [semver](https://github.com/npm/node-semver)
- `email` - 使用正则 `/[^\s]+@[^\s]+\.[^\s]+/`
- `url` - 使用正则 `/https?:\/\/[^\s]*/`

Upon prompts answers, they can be used in template files as follows:
经过上述问题询问，最后可以在模板文件中使用以下变量：

```ejs
<%= name %>
// => User input text

<%= version %>
// => User input text

<% if (sass) { %>
// use sass preprocessor
<% } %>
```

### filters

过滤哪些文件你希望被输出

- 类型：`Record<string, (answers: Answers) => boolean>`

```javascript
module.exports = {
  prompts: [
    { name: 'sass', type: 'confirm', message: 'Use sass preprocessor?', initial: true }
  ],
  filters: {
    '*/*.scss': answers => answers.sass,
    '*/*.css': answers => !answers.sass
  }
}
```

### helpers

自定义模板引擎的助手函数

- 类型：`Record<string, any>`
- 默认值：`{ _: require('lodash') }`

```javascript
module.exports = {
  helpers: {
    upper: input => input.toUpperCase()
  }
}
```

一旦注册，你可以在模板中使用以下函数：

```ejs
<%= upper('zce') %>
// => 'ZCE'

// lodash is always
<%= _.camelCase('wow caz') %>
// => 'wowCaz'
```

### install

在生成文件完成过后自动安装依赖项

- 类型：`false | 'npm' | 'yarn' | 'pnpm'`
- 默认值：根据所生成的文件中是否包含 `package.json` 文件决定

```javascript
module.exports = {
  // 生成文件后运行 `yarn install`
  install: 'yarn'
}
```

### init

在生成文件完成过后自动初始化仓库

- 类型：`boolean`
- 默认值：根据所生成的文件中是否包含 `.gitignore` 文件决定

```javascript
module.exports = {
  // 生成文件后运行 `git init && git add && git commit`
  init: true
}
```

### setup

模板初始化钩子，在模板加载完成且问题询问完成后执行

- 类型：`(ctx: Context) => Promise<void>`
- 引用：[Context](#context)

```javascript
module.exports = {
  setup: async ctx => {
    // 此时你可以在上下文中安全的访问以下成员
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers // 用户回答
    } = ctx
    console.log('template setup', ctx)
  }
}
```

#### 示例：

选择包管理工具

```javascript
module.exports = {
  // ...
  prompts: [
    {
      name: 'install',
      type: 'confirm',
      message: 'Install dependencies',
      initial: true
    },
    {
      name: 'pm',
      type: prev => prev ? 'select' : null,
      message: 'Package manager',
      hint: ' ',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' }
      ]
    }
  ],
  setup: async ctx => {
    // 根据用户选择决定如何安装依赖
    ctx.config.install = ctx.answers.install && ctx.answers.pm
  }
}
```

动态设置模板源文件目录

```javascript
module.exports = {
  // ...
  prompts: [
    {
      name: 'features',
      type: 'multiselect',
      message: 'Project features',
      instructions: false,
      choices: [
        { title: 'TypeScript', value: 'typescript', selected: true }
        // ....
      ]
    }
  ],
  setup: async ctx => {
    // 动态设置模板源文件目录
    ctx.config.source = ctx.answers.features.includes('typescript')
      ? 'template/typescript'
      : 'template/javascript'
  }
}
```

其他设置，尽可能发挥你的创造力...

### prepare

Template prepare hook, execute after template files prepare, before rename & render.
模板准备完成钩子，在模板文件准备完成后、重命名和渲染之前执行

- 类型：`(ctx: Context) => Promise<void>`
- 引用：[Context](#context)

```javascript
module.exports = {
  prepare: async ctx => {
    // 此时你可以在上下文中安全的访问以下成员
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers,
      files // 尚未重命名和渲染的文件列表
    } = ctx
    console.log('template prepare', ctx)
  }
}
```

#### 示例：

动态添加需要生成的文件

```javascript
module.exports = {
  prepare: async ctx => {
    ctx.files.push({
      path: 'additional.txt',
      contents: Buffer.from('<%= name %> additional contents')
    })
  }
}
```

### emit

Template emit hook, execute after all files emit to the destination.
模板文件生成钩子，在所有文件生成到目标目录后执行

- 类型：`(ctx: Context) => Promise<void>`
- 引用：[Context](#context)

```javascript
module.exports = {
  emit: async ctx => {
    // 此时你可以在上下文中安全的访问以下成员
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers,
      files // 已经重命名和渲染的文件列表
    } = ctx
    console.log('template emit')
  }
}
```

### complete

生成完成回调，如果设置为一个字符串，则将其打印到控制台

- 类型：`string` or `(ctx: Context) => string | Promise<void | string>`
- 默认值：打印全部生成的文件列表
- 引用：[Context](#context)

回掉函数

```javascript
module.exports = {
  complete: async ctx => {
    // ctx => all context
    console.log('  Happy hacking ;)')
  }
}
```

或者字符串

```javascript
module.exports = {
  complete: '  Happy hacking ;)'
}
```

_更多示例，可以参考 [fixtures](../test/fixtures/features/index.js)。_

## 核心类型

### Context

```typescript
/**
 * Creator context.
 */
interface Context {
  /**
   * Template name.
   * e.g.
   * - offlical short name: `nm`
   * - offlical short name with branch: `nm#master`
   * - custom full name: `zce/nm`
   * - custom full name with branch: `zce/nm#master`
   * - local directory path: `~/templates/nm`
   * - full url: `https://github.com/zce/nm/archive/master.zip`
   */
  readonly template: string
  /**
   * Project name, which is also the project directory.
   */
  readonly project: string
  /**
   * More options.
   */
  readonly options: Options & Record<string, any>
  /**
   * The source directory where the template (absolute).
   */
  src: string
  /**
   * Generated result output destination directory (absolute).
   */
  dest: string
  /**
   * Template config.
   */
  readonly config: Template
  /**
   * Template prompts answers.
   */
  readonly answers: Answers<string>
  /**
   * Template files.
   */
  readonly files: File[]
}
```

### Template

```typescript
/**
 * Template config.
 */
export interface Template {
  /**
   * Template name.
   */
  name: string
  /**
   * Template version.
   */
  version?: string
  /**
   * Template source dirname.
   */
  source?: string
  /**
   * Template metadata.
   */
  metadata?: Record<string, unknown>
  /**
   * Template prompts.
   */
  prompts?: PromptObject | PromptObject[]
  /**
   * Template file filters.
   */
  filters?: Record<string, (answers: Answers<string>) => boolean>
  /**
   * Template engine helpers.
   */
  helpers?: Record<string, unknown>
  /**
   * Auto install dependencies.
   */
  install?: false | 'npm' | 'yarn' | 'pnpm'
  /**
   * Auto init git repository.
   */
  init?: boolean
  /**
   * Template setup hook, execute after template loaded & inquire completed.
   */
  setup?: (ctx: Context) => Promise<void>
  /**
   * Template prepare hook, execute after template files prepare, before rename & render.
   */
  prepare?: (ctx: Context) => Promise<void>
  /**
   * Template emit hook, execute after all files emit to the destination.
   */
  emit?: (ctx: Context) => Promise<void>
  /**
   * Template all completed.
   */
  complete?: ((ctx: Context) => string | Promise<string> | Promise<void>) | string
}
```

### File

```typescript
/**
 * File info.
 */
export interface File {
  /**
   * File full path
   */
  path: string
  /**
   * File contents (buffer)
   */
  contents: Buffer
}
```

## 依赖项

因为模板在工作前会自动安装生产依赖，所以你可以在模板配置文件中正常的使用第三方的 NPM 模块。

e.g.

将 `chalk` 模块作为生产依赖安装：

```shell
$ npm install chalk --save
```

`index.js`:

```javascript
const chalk = require('chalk')
```

> **注意：** 只有生产依赖才会被自动安装。

## 类型注解

将 `caz` 模块作为开发依赖安装：

```shell
$ npm install caz --save-dev
```

然后在你的模板配置文件中：

```javascript
/** @type {import('caz').Template} */
module.exports = {
  // 拥有智能提示和类型感知（VSCode）
}
```

## 模板转译

如果你想直接输出模板插值表达式字符，你可以这样：

- `<%= '\<%= name %\>' %>` => `<%= name %>`
- `<%= '${name}' %>` => `${name}`
