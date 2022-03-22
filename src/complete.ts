import { Context } from './types'

/**
 * Fallback complete hook
 */
export const fallback = async (ctx: Context): Promise<void> => {
  console.log(`Created a new project in \`${ctx.project}\` by the \`${ctx.template}\` template.\n`)
  ctx.files.map(i => i.path).sort((a, b) => a > b ? +1 : -1).forEach(i => console.log('- ' + i))
  console.log('\nHappy hacking :)')
}

/**
 * Apply template complete hook.
 */
export default async (ctx: Context): Promise<void> => {
  if (ctx.config.complete == null) {
    return await fallback(ctx)
  }
  if (typeof ctx.config.complete === 'string') {
    return console.log(ctx.config.complete)
  }
  const result = await ctx.config.complete(ctx)
  if (result == null) return
  console.log(result)
}
