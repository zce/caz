# Writing Custom Templates from Scratch

In reading this section, you'll learn how to create and distribute your own template.

## Template structure

```
└── my-template
    ├── template ··················· Template source files directory (Required)
    │   ├── lib ···················· Any directory (Recurse all subdirectories)
    │   │   ├── {name}.js ·········· Any file name with interpolate (Auto rename by answers)
    │   │   └── logo.png ··········· Any file without interpolate (Auto skip binary file)
    │   └── package.json ··········· Any file with interpolate (Auto render interpolate by answers)
    ├── index.js ··················· Entry point (Optional, Template configuration file)
    ├── package.json ··············· Package info (Optional)
    └── README.md ·················· README (Optional)
```

## Generate a template from a template

We built a [template](https://github.com/caz-templates/template) to help users get started with their own template. Feel free to use it to bootstrap your own template once you understand the below concepts.

```shell
$ caz template my-template
```

## Configuration

A template repo may have a configuration file for the template which can be either a `index.js` or `main` field defined in `package.json`.

It must export an object:

```javascript
module.exports = {
  // your config...
}
```

Type: [Template](#template)

The configuration file can contain the following fields:

### name

The name of the template.

- Type: `string`

```javascript
module.exports = {
  name: 'my-template'
}
```

### version

The version of the template.

- Type: `string`

```javascript
module.exports = {
  version: '0.1.0'
}
```

### source

Template source files directory.

- Type: `string`
- Default: `'template'`

```javascript
module.exports = {
  source: 'template'
}
```

### metadata

The metadata you can use in the template files.

- Type: `Record<string, unknown>`

```javascript
module.exports = {
  metadata: {
    bio: 'my template generated',
    year: new Date().getFullYear()
  }
}
```

Upon metadata definition, they can be used in template files as follows:

```ejs
<%= bio %>
// => 'my template generated'
<%= year %>
// => 2020 (current year)
```

### prompts

Interactive prompts, use [prompts](https://github.com/terkelg/prompts), please refer to [prompts docs](https://github.com/terkelg/prompts#-prompt-objects).

- Type: `PromptObject | PromptObject[]`
- Default: `'{ name: 'name', type: 'text', message: 'Project name' }'`

```javascript
module.exports = {
  prompts: [
    { name: 'name', type: 'text', message: 'Project name' },
    { name: 'version', type: 'text', message: 'Project version' },
    { name: 'sass', type: 'confirm', message: 'Use sass preprocessor?', initial: true }
  ]
}
```

The following keys automatically assign initial values (from other config or system info):

- `name` - destination path basename, fallback: path.basename(dest)
- `version` - npm init config, fallback: `0.1.0`
- `author` - npm or git name config
- `email` - npm or git email config
- `url` - npm or git url config
<!-- - `license` - npm init config, fallback: `MIT` -->

The following keys automatically assign default validater:

- `name` - by [validate-npm-package-name](https://github.com/npm/validate-npm-package-name)
- `version` - by [semver](https://github.com/npm/node-semver)
- `email` - by RegExp `/[^\s]+@[^\s]+\.[^\s]+/`
- `url` - by RegExp `/https?:\/\/[^\s]*/`

Upon prompts answers, they can be used in template files as follows:

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

Filter files that you want to output.

- Type: `Record<string, (answers: Answers) => boolean>`

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

Custom template engine helpers.

- Type: `Record<string, any>`
- Default: `{ _: require('lodash') }`

```javascript
module.exports = {
  helpers: {
    upper: input => input.toUpperCase()
  }
}
```

Upon registration, they can be used in template files as follows:

```ejs
<%= upper('zce') %>
// => 'ZCE'

// lodash is always
<%= _.camelCase('wow caz') %>
// => 'wowCaz'
```

### install

Auto install dependencies after generation.

- Type: `false | 'npm' | 'yarn' | 'pnpm'`
- Default: According generated files contains `package.json`

```javascript
module.exports = {
  // run `yarn install` after files emit.
  install: 'yarn'
}
```

### init

Auto init git repository after generation.

- Type: `boolean`
- Default: According generated files contains `.gitignore`

```javascript
module.exports = {
  // run `git init && git add && git commit` after files emit.
  init: true
}
```

### setup

Template setup hook, execute after template loaded & inquire completed.

- Type: `(ctx: Context) => Promise<void>`
- Ref: [Context](#context)

```javascript
module.exports = {
  setup: async ctx => {
    // You can get the following data in context
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers // inquire answers
    } = ctx
    console.log('template setup', ctx)
  }
}
```

#### Examples:

Package manager choose.

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
    // Execute install according to user's choice.
    ctx.config.install = ctx.answers.install && ctx.answers.pm
  }
}
```

Dynamic setting template files directory.

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
    // Dynamic setting template files directory.
    ctx.config.source = ctx.answers.features.includes('typescript')
      ? 'template/typescript'
      : 'template/javascript'
  }
}
```

Other settings, use your creativity as much as possible...

### prepare

Template prepare hook, execute after template files prepare, before rename & render.

- Type: `(ctx: Context) => Promise<void>`
- Ref: [Context](#context)

```javascript
module.exports = {
  prepare: async ctx => {
    // You can get the following data in context
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers,
      files // before rename & render
    } = ctx
    console.log('template prepare', ctx)
  }
}
```

#### Examples:

Add files to be generated dynamically.

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

- Type: `(ctx: Context) => Promise<void>`
- Ref: [Context](#context)

```javascript
module.exports = {
  emit: async ctx => {
    const {
      template,
      project,
      options,
      dest,
      src,
      config,
      answers,
      files // after rename & render
    } = ctx
    console.log('template emit')
  }
}
```

### complete

Generate completed callback. if got a string, print it to the console.

- Type: `string` or `(ctx: Context) => string | Promise<void | string>`
- Default: Log all generated files.
- Ref: [Context](#context)

callback

```javascript
module.exports = {
  complete: async ctx => {
    // ctx => all context
    console.log('  Happy hacking ;)')
  }
}
```

or string

```javascript
module.exports = {
  complete: '  Happy hacking ;)'
}
```

_For more examples, please refer to the [fixtures](../test/fixtures/features/index.js)._

## Core Types

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

> ## Dependencies
>
> Because the template does not automatically install its own dependencies before it works, it is not possible to load third-party modules in the template configuration file at this time.
>
> e.g. template `index.js`:
>
> ```javascript
> const chalk = require('chalk')
> // => Cannot find module 'chalk'
> ```
>
> The reason why we don't install template dependencies automatically is to ensure that the templates are simple and take less space.
>
> To solve this problem, you can also host `node_modules` to template repository, these modules will work properly.
>
> But I don't recommend it because it's extremely inefficient.
>
> I personally prefer to modify `index.js` module paths to sharing the [dependencies of caz](https://npm.im/caz).
>
> e.g. template `index.js`:
>
> ```javascript
> // Sharing the dependencies of caz
> // Make sure the following statement is executed before all code
> module.paths = require.main.paths
>
> const chalk = require('chalk')
> // => require chalk module from caz dependencies
> ```

## Type Annotation

Install `caz` as devDependencies:

```shell
$ npm i caz --save-dev
```

Then in your template configuration file:

```javascript
/** @type {import('caz').Template} */
module.exports = {
  // Have type hint and IntelliSense (VSCode)
}
```

## Template Paraphrase

If you want direct output template interpolate, like this:

- `<%= '\<%= name %\>' %>` => `<%= name %>`
- `<%= '${name}' %>` => `${name}`
