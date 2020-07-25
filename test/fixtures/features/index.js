// !!! Sharing the dependencies of zce-cli
module.paths = module.parent.paths

const path = require('path')
const chalk = require('chalk')

/** @type {import('../../../src').Template} */
module.exports = {
  name: 'features',
  version: '0.1.0',
  source: 'templates',
  metadata: { date: new Date() },
  prompts: [
    {
      type: 'text',
      name: 'name',
      message: 'Project name',
      initial: 'my-project'
    },
    {
      type: 'text',
      name: 'version',
      message: 'Project version',
      initial: '0.1.0'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description',
      initial: 'Awesome project'
    },
    {
      type: 'multiselect',
      name: 'features',
      message: 'Project description',
      instructions: false,
      choices: [
        { title: 'Foo', value: 'foo', selected: true },
        { title: 'Bar', value: 'bar', selected: true }
      ]
    }
  ],
  filters: {
    /** @param {{ features: string[] }} a */
    'foo.txt': a => a.features.includes('foo'),
    /** @param {{ features: string[] }} a */
    'bar.txt': a => a.features.includes('bar'),
    /** @param {{ features: string[] }} a */
    '**/*.js': a => a.features.includes('bar')
  },
  helpers: {
    lower: i => i.toLowerCase(),
    upper: i => i.toUpperCase()
  },
  install: 'npm',
  init: true,
  complete: ctx => {
    console.clear()

    console.log(chalk`Created a new project in {cyan ${ctx.dest}} by the {blue ${ctx.template}} template.\n`)

    console.log('Getting Started:')

    if (ctx.dest !== process.cwd()) {
      console.log(chalk.cyan(`  $ cd ${path.relative(process.cwd(), ctx.dest)}`))
    }
    console.log(chalk.cyan('  $ npm run dev'))

    // console.log('Good luck :)')
    console.log('\nHappy hacking :)\n')
  }
}
