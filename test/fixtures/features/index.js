// full features template

// !!! Sharing the dependencies of zce-cli
module.paths = module.parent.paths

const path = require('path')
const chalk = require('chalk')

/** @type {import('../../../src').Template} */
module.exports = {
  name: 'features',
  version: '0.1.0',
  source: 'template',
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
        { title: 'TypeScript', value: 'typescript', selected: true },
        { title: 'CLI Program', value: 'cli' }
      ]
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies',
      initial: true
    },
    {
      type: prev => prev ? 'select' : null,
      name: 'pm',
      message: 'Package manager',
      hint: ' ',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' }
      ]
    }
  ],
  filters: {
    /** @param {{ features: string[] }} a */
    'bin/**': a => a.features.includes('cli'),
    /** @param {{ features: string[] }} a */
    'src/**': a => a.features.includes('typescript'),
    /** @param {{ features: string[] }} a */
    'lib/**': a => !a.features.includes('typescript')
  },
  helpers: {
    lower: i => i.toLowerCase(),
    upper: i => i.toUpperCase()
  },
  install: 'npm',
  init: true,
  setup: ctx => {
    console.log(ctx.template, 'template setup')
  },
  prepare: ctx => {
    console.log(ctx.template, 'template prepare')
    ctx.config.install = ctx.answers.pm
  },
  emit: ctx => {
    console.log(ctx.template, 'template emit')
  },
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
