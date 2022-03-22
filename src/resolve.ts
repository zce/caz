import path from 'path'
import crypto from 'crypto'
import ora from 'ora'
import { file, http, config } from './core'
import { Context } from './types'

/**
 * Get local template dir.
 * @param input template dir
 * @example
 * 1. relative path, e.g. './foo', '../foo'
 * 2. absolute path, e.g. '/foo', 'C:\\foo'
 * 3. tildify path in windows, e.g. '~/foo'
 */
export const getTemplatePath = async (input: string): Promise<false | string> => {
  if (!/^[./]|^[a-zA-Z]:|^~[/\\]/.test(input)) return false

  const dir = path.resolve(file.untildify(input))

  if (await file.exists(dir) === 'dir') return dir

  throw new Error(`Local template not found: \`${input}\` is not a directory`)
}

/**
 * Get remote template url.
 * @param input template name or uri
 * @example
 * 1. short name, e.g. 'nm'
 * 2. full name, e.g. 'zce/nm'
 * 3. with branch, e.g. 'zce/nm#next'
 * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
 */
export const getTemplateUrl = async (input: string): Promise<string> => {
  if (/^https?:/.test(input)) return input

  const [fullname, maybeBranch] = input.split('#')
  const [maybeOwner, maybeName] = fullname.split('/')

  const isEmpty = (input?: string): boolean => input == null || input === ''

  const branch = isEmpty(maybeBranch) ? config.branch : maybeBranch
  const name = isEmpty(maybeName) ? maybeOwner : maybeName
  const owner = isEmpty(maybeName) ? config.official : maybeOwner

  const data: Record<string, string> = { owner, name, branch }

  return config.registry.replace(/{(\w+)}/g, (_, key) => data[key])
}

/**
 * Resolve template from remote or local.
 */
export default async (ctx: Context): Promise<void> => {
  // local template path
  const dir = await getTemplatePath(ctx.template)

  if (dir !== false) {
    ctx.src = dir
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
    throw new Error(`Failed to pull \`${ctx.template}\` template: ${(e as Error).message}.`)
  }
}
