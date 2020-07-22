import { Context } from './types'

/**
 * Apply template plugin.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.options?.plugin == null) return
  await ctx.options.plugin(ctx)
}
