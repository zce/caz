import { Context } from './types'

/**
 * Rename file if necessary.
 */
export default async (ctx: Context): Promise<void> => {
  const regexp = /{(\w+)}/g

  ctx.files.forEach(item => {
    if (!regexp.test(item.path)) return

    // maybe windows path: \

    // rename it by replace
    item.path = item.path.replace(regexp, (_, key) => ctx.answers[key] as string)
  })
}
