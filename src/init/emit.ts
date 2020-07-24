import fs from 'fs'
import path from 'path'
import { Context } from './types'

/**
 * Emit files to destination.
 */
export default async (ctx: Context): Promise<void> => {
  await Promise.all(ctx.files.map(async item => {
    const target = path.join(ctx.dest, item.path)
    await fs.promises.mkdir(path.dirname(target), { recursive: true })
    await fs.promises.writeFile(target, item.contents)

    // TODO: empty dir output ???
    // if (item.stats?.isFile() && item.contents != null) {
    //   await fs.promises.mkdir(path.dirname(target), { recursive: true })
    //   await fs.promises.writeFile(target, item.contents)
    // } else if (item.stats?.isDirectory()) {
    //   await fs.promises.mkdir(target, { recursive: true })
    // }
  }))
}
