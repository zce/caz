import { spawn } from 'child_process'
import { Context } from './types'

const command = (args: string[], cwd: string) => new Promise((resolve, reject) => {
  const child = spawn('git',args, { cwd, stdio: 'inherit' })
  child.on('error', reject).on('exit', code => {
    if (code === 0) return resolve()
    reject(new Error('Initial repository failed.'))
  })
})

/**
 * Execute `git init && git add . && git commit -m "feat: initial commit"` command.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.init == null || !ctx.config.init) return

  // Initializing git repository...

  await command(['init'], ctx.dest)
  await command(['add', '--all'], ctx.dest)
  await command(['commit', '-m', 'feat: initial commit'], ctx.dest)

  // Initial repo completed.
}
