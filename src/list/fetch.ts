import fs from 'fs'
import path from 'path'
import ora from 'ora'
import { file, http, config } from '../core'

export interface Repository {
  name: string
  full_name: string
  description: string
  updated_at: string
  owner: { login: string }
}

export interface Result {
  name: string
  owner: string
  fullName: string
  description: string
  updated: string
}

/**
 * Fetch remote template list
 * @param owner template owner name
 */
export const remote = async (owner: string): Promise<Result[]> => {
  const spinner = ora('Loading available list from remote...').start()

  try {
    const url = new URL(`https://api.github.com/users/${owner}/repos`)
    url.username = config.clientId
    url.password = config.clientSecret
    url.searchParams.append('type', 'owner')
    url.searchParams.append('sort', 'updated')
    url.searchParams.append('per_page', '100') // max 100

    const response = await http.request(url.toString())
    const json = await response.json() as Repository[]

    spinner.stop()

    return json.map(i => ({
      name: i.name,
      owner: i.owner.login,
      fullName: i.full_name,
      description: i.description,
      updated: i.updated_at
    }))
  } catch (e) {
    spinner.fail(`Failed to load list from remote: ${e.message as string}.`)
    console.log(e)
    return []
  }
}

/**
 * Fetch local template list
 * @param owner template owner name
 * @todo read local cache
 */
export const local = async (owner: string): Promise<Result[]> => {
  const exists = await file.exists(config.paths.cache)
  if (exists !== 'dir') return []

  const entries = await fs.promises.readdir(config.paths.cache)

  return entries.reduce<Result[]>((prev, current) => {
    const fullpath = path.join(config.paths.cache, current)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { name, owner: author, description, updated } = require(fullpath)
      if (author !== owner) return prev
      prev.push({ name, owner: author, description, updated, fullName: `${author as string}/${name as string}` })
    } catch {}
    return prev
  }, [])
}
