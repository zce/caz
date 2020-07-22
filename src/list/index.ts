import chalk from 'chalk'
import { local, remote } from './fetch'
import { config } from '../common'

export interface ListOptions {
  cache?: boolean
  json?: boolean
  short?: boolean
}

/**
 * Show all available templates.
 * @todo local template list
 */
export default async (owner: string = config.official, options: ListOptions = {}): Promise<void> => {
  const results = await (options.cache ?? false ? local(owner) : remote(owner))

  const isOfficial = owner === config.official

  // json output
  if (options.json ?? false) {
    return console.log(JSON.stringify(results))
  }

  // short output
  if (options.short ?? false) {
    return results.forEach(i => console.log(`→ ${isOfficial ? i.name : i.fullName}`))
  }

  // full mode
  if (results.length === 0) {
    return console.log('No available templates.')
  }

  console.log(`Available ${isOfficial ? 'official' : owner}'s templates:`)
  const infos = results.map(i => [isOfficial ? i.name : i.fullName, i.description])
  const width = Math.max(5, ...infos.map(i => i[0].length))
  const gap = (i: string[]): string => ' '.repeat(width - i[0].length)
  infos.forEach(i => console.log(chalk`  {yellow →} {blue ${i[0]}} ${gap(i)} ${i[1]}`))
}
