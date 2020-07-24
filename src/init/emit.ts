import path from 'path'
import { file } from '../common'
import { Context } from './types'

/**
 * Emit files to destination.
 */
export default async (ctx: Context): Promise<void> => {
  await Promise.all(ctx.files.map(async item => {
    const target = path.join(ctx.dest, item.path)
    await file.write(target, item.contents)

    // TODO: empty dir output ???
    // if (item.stats?.isFile() && item.contents != null) {
    //   await file.write(target, item.contents)
    // } else if (item.stats?.isDirectory()) {
    //   await file.mkdir(target)
    // }
  }))
}
