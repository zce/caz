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
  // github application
  // https://developer.github.com/v3/guides/basics-of-authentication
  clientId: 'c07ff4d0cbddbfe57545',
  clientSecret: '19484a928f48768a8329d6cb11ab020625dc86c3'
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
    return envPaths(name, { suffix: undefined })
  },
  ini: parseIni
}
