import path from 'path'
import { file } from '../core'
import { Context } from './types'

/**
 * Cache template info.
 */
export default async (ctx: Context): Promise<void> => {
  const info = {
    template: ctx.template,
    name: ctx.config.name,
    version: ctx.config.version
  }

  const json = JSON.stringify(info)

  await file.write(path.join(ctx.src, '.cazrc.json'), json)
}
