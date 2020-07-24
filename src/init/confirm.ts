import path from 'path'
import prompts from 'prompts'
import { file } from '../common'
import { Context } from './types'

/**
 * Confirm destination.
 */
export default async (ctx: Context): Promise<void> => {
  // resolve dest path
  ctx.dest = path.resolve(ctx.project)

  // exist
  const exists = await file.exists(ctx.dest)

  //  dist not exists
  if (exists === false) return

  // empty dir
  if (await file.isEmpty(ctx.dest)) return

  // destination is file
  if (exists !== 'dir') throw new Error(`Cannot create ${ctx.project}: File exists.`)

  // clear console
  console.clear()

  // is current working directory
  const isCurrent = ctx.dest === process.cwd()

  // confirm & choose next
  const { choose }: { choose?: string } = await prompts([
    {
      type: 'confirm',
      name: 'sure',
      message: isCurrent ? 'Create in current directory?' : 'Target directory already exists. Continue?'
    },
    {
      type: (prev: boolean) => prev ? 'select' : null,
      name: 'choose',
      message: `${isCurrent ? 'Current' : 'Target'} directory is not empty. How to continue?`,
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
  if (choose === 'overwrite') await file.empty(ctx.dest)

  // Merge not require any action
}
