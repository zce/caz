# Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## Prerequisites

- [Node.js](https://nodejs.org) (>= 12.10)
- [npm](https://www.npmjs.com) (>= 6.x)
- [yarn](https://yarnpkg.com) (>= 1.20)
- [Git](https://git-scm.com) (>= 2.20)

## Development

```shell
$ git clone https://github.com/zce/caz.git
$ cd caz
$ npm install
$ npm link
```

dev cli entry

```javascript
const fs = require('fs')
const path = require('path')

// tsconfig filename
const project = path.join(__dirname, '../tsconfig.json')

// check if we're running in dev mode
const devMode = fs.existsSync(project)
// or want to "force" running the compiled version with --compiled-build
const wantsCompiled = process.argv.indexOf('--compiled-build') >= 0

if (!devMode || wantsCompiled) {
  // import cli from the compiled
  // run the CLI with the current process arguments
  require('../lib/cli')
} else {
  // hook into ts-node so we can run typescript on the fly
  require('ts-node').register({ project, files: true })

  // import cli from the source
  // run the CLI with the current process arguments
  require('../src/cli')
}
```