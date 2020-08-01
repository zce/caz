import cac from 'cac'
import init, { list } from '.'
import { name, version } from '../package.json'

const cli = cac(name)

cli
  .command('<template> [project]', 'Create new project from a template')
  .option('-f, --force', 'Overwrite if the target exists')
  .option('-o, --offline', 'Try to use an offline template')
  // .allowUnknownOptions() // for prompts override.
  .example('  # with an official template')
  .example(`  $ ${name} <template> [project]`)
  .example('  # with a custom github repo')
  .example(`  $ ${name} <owner>/<repo> [project]`)
  .action(init)

cli
  .command('list [owner]', 'Show all available templates')
  .alias('ls')
  .option('-j, --json', 'Output with json format')
  .option('-s, --short', 'Output with short format')
  .action(list)

cli.help().version(version).parse()

// https://github.com/cacjs/cac#error-handling
/* istanbul ignore next */
const onError = (err: Error): void => {
  console.error(err.message)
  process.exit(1)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)
