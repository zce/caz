import { Context } from './types'

/**
 * Load template config.
 * @todo Adapt to any repository?
 */
export default async (ctx: Context): Promise<void> => {
  // default template name
  ctx.config.name = ctx.template

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(ctx.src)

    if (Object.prototype.toString.call(mod) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }

    Object.assign(ctx.config, mod)
  } catch (e) {
    // TODO: template dependencies not found.
    if (e.code === 'MODULE_NOT_FOUND') return
    e.message = `Invalid template: ${e.message as string}`
    throw e
  }
}
