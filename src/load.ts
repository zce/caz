import ora from 'ora'
import { exec } from './core'
import { Context } from './types'

/**
 * Load template config.
 * @todo
 * - Adapt to any repository?
 * - Automatic install template dependencies.
 * - Template dependencies not found.
 * - Check template is available.
 */
export default async (ctx: Context): Promise<void> => {
  // default template name
  ctx.config.name = ctx.template

  // Automatic install template dependencies.
  const spinner = ora('Installing template dependencies...').start()
  try {
    /* istanbul ignore next */
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    await exec(cmd, ['install', '--production'], { cwd: ctx.src })
    spinner.succeed('Installing template dependencies complete.')
  } catch {
    spinner.fail('Install template dependencies failed.')
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(ctx.src)

    if (Object.prototype.toString.call(mod) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }

    Object.assign(ctx.config, mod)
  } catch (err) {
    const e = err as NodeJS.ErrnoException
    if (e.code === 'MODULE_NOT_FOUND') return
    e.message = `Invalid template: ${e.message}`
    throw e
  }
}
