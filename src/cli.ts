import cac from 'cac'
import init, { list } from '.'
import { name, version } from '../package.json'

const onError = (err: Error): void => {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

const cli = cac(name)

cli
  .command('<template> [project]', 'Create new project from a template')
  .option('-o, --offline', 'Try to use an offline template')
  .example(name => `  $ ${name} <template> [project] # with an official template`)
  .example(name => `  $ ${name} <owner>/<repo> [project] # with a github repo`)
  .action(init)

cli
  .command('list [owner]', 'Show all available templates')
  .alias('ls')
  .option('-c, --cache', 'Show all cached templates')
  .option('-j, --json', 'Output with json format')
  .option('-s, --short', 'Output with short format')
  .action(list)

// Listen to unknown commands
cli.on('command:*', () => {
  throw new Error('Invalid command: ' + cli.args.join(' '))
})

cli.help().version(version).parse()

// use uncaughtException & unhandledRejection instead
// https://github.com/cacjs/cac#error-handling
// cli.runMatchedCommand().catch(err => {
//   console.error(err.message)
//   process.exit(1)
// })
