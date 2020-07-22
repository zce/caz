import { Context } from './types'

/**
 * Apply template complete.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.options?.complete == null) return
  if (typeof ctx.options.complete === 'string') {
    return console.log(ctx.options.complete)
  }
  const result = await ctx.options.complete(ctx)
  if (result == null) return
  console.log(result)
}
