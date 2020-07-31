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
export default async (owner: string): Promise<Result[]> => {
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
    spinner.stop()
    throw new Error(`Failed to fetch list from remote: ${e.message as string}.`)
  }
}
