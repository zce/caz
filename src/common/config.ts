import os from 'os'
import fs from 'fs'
import path from 'path'
import ini from 'ini'
import envPaths from 'env-paths'
import { name } from '../../package.json'

const parseIni = (filename: string): Dictionary<any> | undefined => {
  try {
    return ini.parse(fs.readFileSync(filename, 'utf8'))
  } catch {}
}

const npm = parseIni(path.join(os.homedir(), '.npmrc'))
const yarn = parseIni(path.join(os.homedir(), '.yarnrc'))
const git = parseIni(path.join(os.homedir(), '.gitconfig'))

const config = parseIni(path.join(os.homedir(), `.${name}rc`))

const defaults = {
  official: 'zce-templates',
  // eslint-disable-next-line no-template-curly-in-string
  registry: 'https://github.com/${owner}/${name}/archive/${branch}.zip'
}

const paths = envPaths(name, { suffix: undefined })

export default { ...defaults, ...config, npm, yarn, git, paths }
