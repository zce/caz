import _ from 'lodash'
import { Context } from './types'

/**
 * Render file if template.
 */
export default async (ctx: Context): Promise<void> => {
  // interpolate
  // https://github.com/lodash/lodash/blob/master/.internal/reEvaluate.js
  const regexp = /<%([\s\S]+?)%>/

  const imports = {
    ...ctx.config.metadata,
    ...ctx.config.helpers
  }

  ctx.files.forEach(item => {
    const text = item.contents.toString()

    // ignore files without interpolate
    if (!regexp.test(text)) return

    const compiled = _.template(text, { imports })
    const newContents = compiled(ctx.answers)
    item.contents = Buffer.from(newContents)
  })
}
