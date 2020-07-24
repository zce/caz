import { Context } from './types'

/**
 * Apply template plugin.
 */
export default async (ctx: Context): Promise<void> => {
  const regexp = /{(.*?)}/g

  ctx.files.forEach(item => {
    if (!regexp.test(item.path)) return

    // maybe windows path: \

    // rename it by replace
    item.path = item.path.replace(regexp, (_, key) => ctx.answers[key])
  })
}
