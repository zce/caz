import { Context } from './types'

/**
 * Apply template plugin.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.plugin == null) return
  await ctx.config.plugin(ctx)
}
