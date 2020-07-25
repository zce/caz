import fs from 'fs'
import ora from 'ora'
import { http, config } from '../core'

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
    const response = await http.request<Repository[]>(`https://api.github.com/users/${owner}/repos`, {
      username: '0cb723972877555ffb54',
      password: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      searchParams: {
        type: 'owner',
        sort: 'updated',
        per_page: 100 // max 100
      },
      responseType: 'json',
      timeout: 5 * 1000 // 5s
    })

    spinner.stop()

    return response.body.map(i => ({
      name: i.name,
      owner: i.owner.login,
      fullName: i.full_name,
      description: i.description,
      updated: i.updated_at
    }))
  } catch (e) {
    spinner.fail(`Failed to load list from remote: {red ${e.message as string}}.`)
    return []
  }
}

/**
 * Fetch local template list
 * @param owner template owner name
 */
export const local = async (owner: string): Promise<Result[]> => {
  const templates = await fs.promises.readdir(config.paths.cache)
  return templates
    .map(item => ({
      name: item,
      owner: 'zce',
      fullName: '',
      description: '',
      updated: ''
    }))
    .filter(i => i.owner === owner)
}
