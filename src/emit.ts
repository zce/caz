import path from 'path'
import { file } from './core'
import { Context } from './types'

/**
 * Emit files to destination.
 */
export default async (ctx: Context): Promise<void> => {
  await Promise.all(ctx.files.map(async item => {
    // TODO: empty dir output ???
    const target = path.join(ctx.dest, item.path)
    await file.write(target, item.contents)
  }))

  // Apply template emit hook.
  if (ctx.config.emit == null) return
  await ctx.config.emit(ctx)
}
