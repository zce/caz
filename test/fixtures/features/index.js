// full features template

// !!! Sharing the dependencies of caz
// Make sure the following statement is executed before all code
module.paths = require.main.paths

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
      name: 'name',
      type: 'text',
      message: 'Project name',
      initial: 'my-project'
    },
    {
      name: 'version',
      type: 'text',
      message: 'Project version',
      initial: '0.1.0'
    },
    {
      name: 'description',
      type: 'text',
      message: 'Project description',
      initial: 'Awesome project'
    },
    {
      name: 'features',
      type: 'multiselect',
      message: 'Project features',
      instructions: false,
      choices: [
        { title: 'TypeScript', value: 'typescript', selected: true },
        { title: 'CLI Program', value: 'cli' }
      ]
    },
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
  setup: async ctx => {
    console.log('template setup', ctx)
    // Execute install according to user's choice.
    ctx.config.install = ctx.answers.install && ctx.answers.pm
    // Dynamic setting template files directory.
    ctx.config.source = 'template'
    // Other settings ...
  },
  prepare: async ctx => {
    console.log('template prepare', ctx)
    // Add files to be generated dynamically
    ctx.files.push({
      path: 'additional.txt',
      contents: Buffer.from('<%= name %> additional contents')
    })
  },
  emit: async ctx => {
    console.log('template emit', ctx)
  },
  complete: async ctx => {
    console.clear()
    console.log(chalk`Created a new project in {cyan ${ctx.project}} by the {blue ${ctx.template}} template.\n`)
    console.log('Getting Started:')
    if (ctx.dest !== process.cwd()) {
      console.log(chalk`  $ {cyan cd ${path.relative(process.cwd(), ctx.dest)}}`)
    }
    if (ctx.config.install === false) {
      console.log(chalk`  $ {cyan npm install} {gray # or yarn}`)
    }
    console.log(chalk`  $ {cyan ${ctx.config.install ? ctx.config.install : 'npm'} test}`)
    // console.log('Good luck :)')
    console.log('\nHappy hacking :)\n')
  }
}
