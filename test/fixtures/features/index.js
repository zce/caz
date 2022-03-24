// full features template
// @ts-check

const path = require('path')

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
    console.log(`Created a new project in ${ctx.project} by the ${ctx.template} template.\n`)
    console.log('Getting Started:')
    if (ctx.dest !== process.cwd()) {
      console.log(`  $ cd ${path.relative(process.cwd(), ctx.dest)}`)
    }
    if (ctx.config.install === false) {
      console.log('  $ npm install # or yarn')
    }
    console.log(`  $ ${ctx.config.install ? ctx.config.install : 'npm'} test`)
    console.log('\nHappy hacking :)\n')
  }
}
