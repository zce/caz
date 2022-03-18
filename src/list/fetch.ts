import ora from 'ora'
import { http } from '../core'

export interface Result {
  name: string
  owner: string
  fullname: string
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
    const url = `https://caz.vercel.app/templates?owner=${owner}`
    const response = await http.request(url)
    const results = await response.json() as Result[]
    spinner.stop()
    return results
  } catch (e) {
    spinner.stop()
    throw new Error(`Failed to fetch list from remote: ${(e as Error).message}.`)
  }
}
