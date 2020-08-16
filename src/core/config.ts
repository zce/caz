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
  registry: 'https://github.com/{owner}/{name}/archive/{branch}.zip',
  official: 'caz-templates',
  branch: 'master',
  // git init commit message
  commitMessage: 'feat: initial commit'
}

const config = parseIni(path.join(os.homedir(), `.${name}rc`))

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
    return envPaths(name, { suffix: undefined })
  },
  ini: parseIni
}
