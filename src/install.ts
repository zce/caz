import { exec } from './core'
import { Context } from './types'

/**
 * Execute `npm | yarn | pnpm install` command.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.install === false) return // off install

  if (ctx.config.install == null) {
    // not contains `package.json`
    if (ctx.files.find(i => i.path === 'package.json') == null) return
    // npm is used by default when it contains `package.json`
    ctx.config.install = 'npm'
  }

  // Installing dependencies...

  try {
    const client = ctx.config.install
    /* istanbul ignore next */
    const cmd = process.platform === 'win32' ? client + '.cmd' : client
    await exec(cmd, ['install'], { cwd: ctx.dest, stdio: 'inherit' })
  } catch (e) {
    throw new Error('Install dependencies failed.')
  }

  // Install deps completed.
}
