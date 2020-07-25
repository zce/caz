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

Configuration file can contain the following fields:

### name

- Type: `string`
- Details: Name of template.

```javascript
module.exports = {
  name: 'my-template'
}
```

### version

- Type: `string`
- Details: Version of template.

```javascript
module.exports = {
  version: '0.1.0'
}
```

### source

- Type: `string`
- Default: `'template'`
- Details: Template source files directory name.
- Example: [custom-source](../test/fixtures/source)

```javascript
module.exports = {
  string: 'template'
}
```

### metadata

- Type: `Record<string, unknown>`
- Details: The metadata you can use in the template.
- Example: [custom-metadata](../test/fixtures/metadata)

```javascript
module.exports = {
  metadata: {
    bio: 'my template generated'
  }
}
```

Upon metadata definition, they can be used as follows:

```ejs
<%= bio %>
// => 'my template generated'

// or es2015 template literal delimiter
${bio}
// => 'my template generated'
```

### prompts

- Type: `PromptObject | PromptObject[]`
- Details: Collect user input in CLI.
- Example: [custom-prompts](../test/fixtures/prompts)

```javascript
module.exports = {
  prompts: [
    { type: 'text', name: 'name', message: 'Project name' },
    { type: 'text', name: 'version', message: 'Project version' },
    { type: 'text', name: 'description', message: 'Project description', initial: 'Awesome project' },
    { type: 'text', name: 'license', message: 'Project license' },
    { type: 'confirm', name: 'sass', message: 'Use sass preprocessor?', initial: true }
  ]
}
```

> P.S. The following keys automatically assign initial values (from other config or system info)
>
> - `name` - destination path basename, path.basename(dest)
> - `version` - npm / yarn init config, fallback: `0.1.0`
> - `author` - npm / yarn / git name config
> - `email` - npm / yarn / git name config
> - `url` - npm / yarn / git name config
> - `license` - npm / yarn init config, fallback: `MIT`

> P.S. The following keys automatically assign default validater
>
> - `name` - by [validate-npm-package-name](https://github.com/npm/validate-npm-package-name)
> - `version` - by [semver](https://github.com/npm/node-semver)
> - `email` - by RegExp `/[^\s]+@[^\s]+\.[^\s]+/`
> - `url` - by RegExp `/https?:\/\/[^\s]*/`

### filters

- Type: `Record<string, (answers: Answers<string>) => boolean>`
- Details: Conditional filter files to output.
- Example: [custom-filters](../test/fixtures/filters)

```javascript
module.exports = {
  prompts: {
    sass: { type: 'confirm', message: 'Use sass preprocessor?', initial: true }
  },
  filters: {
    '*/*.scss': a => a.sass,
    '*/*.css': a => !a.sass
  }
}
```

### helpers

- Type: `Object`
- Default: `{ _: require('lodash') }`
- Details: Custom lodash template engine helpers.
- Example: [custom-helpers](../test/fixtures/helpers)

```javascript
module.exports = {
  helpers: {
    upper: i => i.toUpperCase()
  }
}
```

Upon registration, they can be used as follows:

```ejs
<%= upper('zce') %>
// => 'ZCE'

// lodash is always
<%= _.camelCase('wow caz') %>
// => 'wowCaz'
```

### install

- Type: `false | 'npm' | 'yarn'`
- Default: `false`
- Details: Auto install dependencies after generation.
- Example: [custom-install](../test/fixtures/install)

### init

- Type: `boolean`
- Default: `false`
- Details: Auto init git repository.
- Example: [custom-init](../test/fixtures/init)

### setup

- Type: `(ctx: Context) => Promise<void>`
- Details: Template setup hook.
- Example: [custom-setup](../test/fixtures/setup)

```javascript
module.exports = {
  setup: async (ctx) => {
    console.log('template setup')
  }
}
```

### complete

- Type: `string` or `(ctx: Context) => string | Promise<void | string>`
- Details: Generate completed callback. if got a string, print it to the console.
- Example: [custom-complete](../test/fixtures/complete)

```javascript
// callback
module.exports = {
  complete: async (ctx) => {
    console.log('  Happy hacking ;)')
  }
}

// or string
module.exports = {
  complete: '  Happy hacking ;)'
}
```

## Dependencies

Because the template does not automatically install its own dependencies before it works, it is not possible to load third-party modules in the template configuration file at this time.

e.g. template `index.js`:

```javascript
const chalk = require('chalk')
// => Cannot find module 'chalk'
```

The reason why we don't install template dependencies automatically is to ensure that the templates are simple and take less space.

To solve this problem, you can also host `node_modules` to template repository, these modules will work properly.

But I don't recommend it because it's extremely inefficient.

I personally prefer to modify `index.js` module paths to sharing the dependencies of caz.

e.g. template `index.js`:

```javascript
// Sharing the dependencies of caz
// Make sure the following statement is executed before all code
module.paths = require.main.paths

const chalk = require('chalk')
// => require chalk module from caz dependencies
```

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
