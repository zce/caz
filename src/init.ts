import { exec, config } from './core'
import { Context } from './types'

/**
 * Execute `git init && git add && git commit` command.
 */
export default async (ctx: Context): Promise<void> => {
  // init === false or not contains `.gitignore`
  if (!(ctx.config.init ?? ctx.files.find(i => i.path === '.gitignore') != null)) return

  // Initializing git repository...

  try {
    const options = { cwd: ctx.dest, stdio: 'inherit' as 'inherit' }
    await exec('git', ['init'], options)
    await exec('git', ['add', '--all'], options)
    await exec('git', ['commit', '-m', config.commitMessage], options)
  } catch (e) {
    throw new Error('Initial repository failed.')
  }

  // Initial repo completed.
}
