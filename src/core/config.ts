import os from 'os'
import fs from 'fs'
import path from 'path'
import ini from 'ini'
import envPaths from 'env-paths'
import { name } from '../../package.json'

/**
 * Parse ini config file.
 * @param filename ini config filename
 */
const parseIni = (filename: string): Record<string, any> | undefined => {
  try {
    return ini.parse(fs.readFileSync(filename, 'utf8'))
  } catch {}
}

const defaults = {
  // template download registry
  // {owner} & {name} & {branch} will eventually be replaced by the corresponding value
  registry: 'https://github.com/{owner}/{name}/archive/refs/heads/{branch}.zip',
  // template offlicial owner name
  official: 'caz-templates',
  // default template branch name
  branch: 'master',
  // download socks proxy config
  proxy: undefined as string | undefined,
  // git init commit message
  commitMessage: 'feat: initial commit'
}

const config = parseIni(path.join(os.homedir(), `.${name}rc`)) ?? {}

// env proxy config
const envProxy = process.env.http_proxy ?? process.env.HTTP_PROXY ?? process.env.https_proxy ?? process.env.HTTPS_PROXY ?? process.env.ALL_PROXY
config.proxy = envProxy ?? config.proxy

if (process.env.no_proxy != null || process.env.NO_PROXY != null) {
  delete config.proxy // disable proxy
}

export default {
  ...defaults,
  ...config,
  get npm () {
    return parseIni(path.join(os.homedir(), '.npmrc'))
  },
  get git () {
    return parseIni(path.join(os.homedir(), '.gitconfig'))
  },
  get paths () {
    // TODO: cache version
    return envPaths(name, { suffix: '' })
  },
  ini: parseIni
}
