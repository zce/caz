import { spawn } from 'child_process'
import { Context } from './types'

/**
 * Execute `npm | yarn install` command.
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

  const client = ctx.config.install
  const cmd = process.platform === 'win32' ? client + '.cmd' : client

  await new Promise((resolve, reject) => {
    const child = spawn(cmd, ['install'], { cwd: ctx.dest, stdio: 'inherit' })
    child.on('error', reject).on('exit', code => {
      if (code === 0) return resolve()
      reject(new Error('Install dependencies failed.'))
    })
  })

  // Install deps completed。
}
