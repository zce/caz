import { Context } from './types'

/**
 * Apply template complete hook.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.complete == null) return
  if (typeof ctx.config.complete === 'string') {
    return console.log(ctx.config.complete)
  }
  const result = await ctx.config.complete(ctx)
  if (result == null) return
  console.log(result)
}
