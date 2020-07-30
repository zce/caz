import path from 'path'
import crypto from 'crypto'
import ora from 'ora'
import { file, http, config } from '../core'
import { Context } from './types'

/**
 * Get template url.
 * @param input template name or uri
 * @example
 * 1. short name, e.g. 'nm'
 * 2. full name, e.g. 'zce/nm'
 * 3. with branch, e.g. 'zce/nm#next'
 * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
 */
export const getTemplateUrl = async (input: string): Promise<string> => {
  if (/^https?:/.test(input)) return input

  input = input.includes('/') ? input : `${config.official}/${input}`
  input = input.includes('#') ? input : `${input}#${config.branch}`

  const [owner, name, branch] = input.split(/\/|#/)
  const data: Record<string, string> = { owner, name, branch }

  return config.registry.replace(/{(.*?)}/g, (_, key) => data[key])
}

/**
 * Resolve template from remote or local.
 */
export default async (ctx: Context): Promise<void> => {
  // '~/foo/bar' in windows
  if (ctx.template.startsWith('~')) {
    ctx.src = file.untildify(ctx.template)
    return
  }

  // local template path
  if (/^[./]|^[a-zA-Z]:/.test(ctx.template)) {
    ctx.src = path.resolve(ctx.template)
    return
  }

  // fetch remote template
  const url = await getTemplateUrl(ctx.template)

  // url hash (16 digit md5)
  const hash = crypto.createHash('md5').update(url).digest('hex').substr(8, 16)

  // template cache path
  ctx.src = path.join(config.paths.cache, hash)

  // template cache exist
  const exists = await file.isDirectory(ctx.src)

  if (ctx.options.offline != null && ctx.options.offline) {
    // offline mode
    if (exists) {
      // found cached template
      return console.log(`Using cached template: \`${file.tildify(ctx.src)}\`.`)
    }

    console.log(`Cache not found: \`${file.tildify(ctx.src)}\`.`)
  }

  // clear cache
  exists && await file.remove(ctx.src)

  const spinner = ora('Downloading template...').start()

  try {
    // download template zip
    const temp = await http.download(url)
    // extract template
    await file.extract(temp, ctx.src, 1)
    // clean up
    await file.remove(temp)
    spinner.succeed('Download template complete.')
  } catch (e) {
    spinner.stop()
    throw new Error(`Failed to pull \`${ctx.template}\` template: ${e.message as string}.`)
  }
}
