import path from 'path'
import semver from 'semver'
import prompts, { PromptObject } from 'prompts'
import validateName from 'validate-npm-package-name'
import { config } from './core'
import { Context } from './types'

/**
 * Prompt validater.
 */
export const validater: Record<string, (input: string) => true | string> = {
  name: input => {
    const result = validateName(input)
    if (result.validForNewPackages) return true
    /* istanbul ignore next */
    return result.errors?.join(', ') ?? result.warnings?.join(',') ?? ''
  },
  version: input => {
    const valid = semver.valid(input)
    if (valid != null) return true
    return `The \`${input}\` is not a semantic version.`
  },
  email: input => {
    const valid = /[^\s]+@[^\s]+\.[^\s]+/.test(input)
    return valid || `The \`${input}\` is not a email address.`
  },
  url: input => {
    const valid = /https?:\/\/[^\s]+/.test(input)
    return valid || `The \`${input}\` is not a url address.`
  }
}

/**
 * Return a prompt processor.
 * defaults & validater
 */
export const processor = (ctx: Context) => (item: PromptObject) => {
  switch (item.name) {
    case 'name':
      item.validate = item.validate ?? validater.name
      item.initial = item.initial ?? path.basename(ctx.dest)
      break
    case 'version':
      item.validate = item.validate ?? validater.version
      item.initial = item.initial ?? config.npm?.['init-version'] ?? '0.1.0'
      break
    case 'author':
      item.initial = item.initial ?? config.npm?.['init-author-name'] ?? config.git?.user?.name
      break
    case 'email':
      item.validate = item.validate ?? validater.email
      item.initial = item.initial ?? config.npm?.['init-author-email'] ?? config.git?.user?.email
      break
    case 'url':
      item.validate = item.validate ?? validater.url
      item.initial = item.initial ?? config.npm?.['init-author-url'] ?? config.git?.user?.url
      break
  }
}

/**
 * Inquire template prompts.
 */
export default async (ctx: Context): Promise<void> => {
  // require node >= v8.3.0
  console.clear()

  // default prompts
  if (ctx.config.prompts == null) {
    ctx.config.prompts = { name: 'name', type: 'text', message: 'Project name' }
  }

  if (!Array.isArray(ctx.config.prompts)) {
    ctx.config.prompts = [ctx.config.prompts]
  }

  ctx.config.prompts.forEach(processor(ctx))

  // override by options (cli argv)
  prompts.override(ctx.options)

  /* istanbul ignore next */
  const onCancel = (): never => {
    throw new Error('You have cancelled this task.')
  }

  Object.assign(ctx.answers, await prompts(ctx.config.prompts, { onCancel }))
}
