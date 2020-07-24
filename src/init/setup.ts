import { Context } from './types'

/**
 * Apply template setup hook.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.setup == null) return
  await ctx.config.setup(ctx)
}
