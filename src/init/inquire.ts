import path from 'path'
import semver from 'semver'
import prompts from 'prompts'
import validateName from 'validate-npm-package-name'
import { Context } from './types'
import { config } from '../common'

/**
 * Prompt validater.
 */
export const validater: Record<string, (input: string) => true | string> = {
  name: input => {
    const result = validateName(input)
    if (result.validForNewPackages) return true
    return result.errors?.join(', ') ?? ''
  },
  version: input => {
    const valid = semver.valid(input)
    if (valid != null) return true
    return `The '${input}' is not a semantic version.`
  }
}

/**
 * Inquire prompts.
 */
export default async (ctx: Context): Promise<void> => {
  // default prompts
  if (ctx.options.prompts == null) {
    ctx.options.prompts = { name: 'name', type: 'text', message: 'Project name' }
  }

  if (!Array.isArray(ctx.options.prompts)) {
    ctx.options.prompts = [ctx.options.prompts]
  }

  ctx.options.prompts.map(item => {
    switch (item.name) {
      case 'name':
        item.initial = item.initial ?? path.basename(ctx.dest)
        item.validate = item.validate ?? validater.name
        break
      case 'version':
        item.validate = validater.version
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
  })

  ctx.answers = await prompts(ctx.options.prompts)
}
