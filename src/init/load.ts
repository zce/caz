import { Context } from './types'

/**
 * Load template options.
 */
export default async (ctx: Context): Promise<void> => {
  // default template options
  ctx.options = { name: ctx.template }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(ctx.src)
    if (Object.prototype.toString.call(mod) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }
    Object.assign(ctx.options, mod)
  } catch (e) {
    // TODO: template deps not found
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = `This template is invalid: ${e.message as string}`
      throw e
    }
  }
}
