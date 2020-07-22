import prompts from 'prompts'
import { file } from '../common'
import { Context } from './types'

/**
 * confirm destination
 */
export default async (ctx: Context): Promise<void> => {
  const exists = await file.exists(ctx.dest)

  //  dist not exists
  if (exists === false) return

  if (exists !== 'dir') throw new Error(`Cannot init ${ctx.project}: File exists.`)

  // empty dir
  if (await file.isEmpty(ctx.dest)) return

  // clear console
  console.clear()

  // confirm
  const { sure }: { sure: boolean } = await prompts({
    type: 'confirm',
    name: 'sure',
    message: ctx.dest === process.cwd() ? 'Generate project in current directory?' : 'Target directory already exists. Continue?'
  })

  // cancel task
  if (!sure) throw new Error('You have to cancel the init task.')

  // choose next
  const { choose }: { choose: string } = await prompts({
    type: 'select',
    name: 'choose',
    message: 'Target directory is not empty. Pick an action:',
    choices: [
      { title: 'Merge', value: 'merge' },
      { title: 'Overwrite', value: 'overwrite' },
      { title: 'Cancel', value: 'cancel' }
    ]
  })

  // cancel task
  if (choose === 'cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'overwrite') await file.remove(ctx.dest)
}
