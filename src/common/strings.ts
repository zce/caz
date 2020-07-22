import crypto from 'crypto'
// import template from 'lodash/template'
// import { TemplateOptions } from 'lodash'

export type TemplateFunction = (ctx: Dictionary<unknown>) => string

/**
 * Compile an ES6 template literals string to a Template function.
 * @param source ES6 template literals.
 */
export const compile = (source: string): TemplateFunction => {
  return (context: Dictionary<unknown>) => {
    const props = Object.keys(context).join(', ')
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
    return new Function(`{ ${props} }`, `return \`${source}\``)(context)
  }
}

/**
 * Render a ES6 template literals string as a template.
 * @param input template literals string
 * @param context template context data
 * @return render result
 */
export const render = (input: string, context: Dictionary<unknown>): string => {
  const compiled = compile(input)
  return compiled(context)
}

// /**
//  * Render a template string as lodash template.
//  * @param input template string
//  * @param data template data
//  * @param options template options
//  * @return render result
//  */
// export const render = (input: string, data:  Dictionary<unknown>, options?: TemplateOptions): string => {
//   const compiled = template(input, options)
//   return compiled(data)
// }

/**
 * Compute md5 hash result
 * @param input source input strings
 * @return md5 strings
 */
export const md5 = (input: string): string => {
  return crypto.createHash('md5').update(input).digest('hex')
}
