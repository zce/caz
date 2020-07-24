import path from 'path'
import semver from 'semver'
import prompts, { PromptObject } from 'prompts'
import validateName from 'validate-npm-package-name'
import { config } from '../common'
import { Context } from './types'

/**
 * Prompt validater.
 */
export const validater: Dictionary<(input: string) => true | string> = {
  name: input => {
    const result = validateName(input)
    if (result.validForNewPackages) return true
    return result.errors?.join(', ') ?? ''
  },
  version: input => {
    const valid = semver.valid(input)
    if (valid != null) return true
    return `The \`${input}\` is not a semantic version.`
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
      item.initial = item.initial ?? config.npm?.['init-version'] ?? config.yarn?.['init-version'] ?? '0.1.0'
      break
    case 'author':
      item.initial = item.initial ?? config.npm?.['init-author-name'] ?? config.yarn?.['init-author-name'] ?? config.git?.['user.name']
      break
    case 'email':
      item.initial = item.initial ?? config.npm?.['init-author-email'] ?? config.yarn?.['init-author-email'] ?? config.git?.['user.email']
      break
    case 'url':
      item.initial = item.initial ?? config.npm?.['init-author-url'] ?? config.yarn?.['init-author-url'] ?? config.git?.['user.url']
      break
    case 'license':
      item.initial = item.initial ?? config.npm?.['init-license'] ?? config.yarn?.['init-license'] ?? 'MIT'
      break
  }
}

/**
 * Inquire prompts.
 */
export default async (ctx: Context): Promise<void> => {
  // default prompts
  if (ctx.config.prompts == null) {
    ctx.config.prompts = { name: 'name', type: 'text', message: 'Project name' }
  }

  if (!Array.isArray(ctx.config.prompts)) {
    ctx.config.prompts = [ctx.config.prompts]
  }

  ctx.config.prompts.forEach(processor(ctx))

  // TODO: override by options (cli argv)
  // prompts.override(ctx.options)

  const onCancel = (): never => {
    throw new Error('You have cancelled this task.')
  }

  Object.assign(ctx.answers, await prompts(ctx.config.prompts, { onCancel }))
}
