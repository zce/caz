import path from 'path'
import prompts from 'prompts'
import { file } from './core'
import { Context } from './types'

/**
 * Confirm destination.
 */
export default async (ctx: Context): Promise<void> => {
  // resolve dest path
  ctx.dest = path.resolve(ctx.project)

  // exist
  const exists = await file.exists(ctx.dest)

  // dist not exists
  if (exists === false) return

  // force mode
  if (ctx.options.force != null && ctx.options.force) {
    return await file.remove(ctx.dest)
  }

  // destination is file
  if (exists !== 'dir') throw new Error(`Cannot create ${ctx.project}: File exists.`)

  // is empty dir
  if (await file.isEmpty(ctx.dest)) return

  // is current working directory
  const isCurrent = ctx.dest === process.cwd()

  // // require node >= v8.3.0
  // console.clear()

  // confirm & choose next
  const { choose }: { choose?: string } = await prompts([
    {
      name: 'sure',
      type: 'confirm',
      message: isCurrent ? 'Create in current directory?' : 'Target directory already exists. Continue?'
    },
    {
      name: 'choose',
      type: (prev: boolean) => prev ? 'select' : null,
      message: `${isCurrent ? 'Current' : 'Target'} directory is not empty. How to continue?`,
      hint: ' ',
      choices: [
        { title: 'Merge', value: 'merge' },
        { title: 'Overwrite', value: 'overwrite' },
        { title: 'Cancel', value: 'cancel' }
      ]
    }
  ])

  // Otherwise is cancel task
  if (choose == null || choose === 'cancel') throw new Error('You have cancelled this task.')

  // Overwrite require empty dest
  if (choose === 'overwrite') await file.remove(ctx.dest)

  // Merge not require any action
}
