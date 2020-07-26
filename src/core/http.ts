import { join } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { promises as fs, createWriteStream } from 'fs'
import fetch from 'node-fetch'
import config from './config'

const pipe = promisify(pipeline)

export { fetch }

/**
 * Download remote resource to temporary file.
 * @param url remote url
 * @returns temporary filename
 */
export const download = async (url: string): Promise<string> => {
  const response = await fetch(url)

  if (!response.ok || response.body == null) {
    throw new Error(`Unexpected response: ${response.statusText}.`)
  }

  // ensure temp dirname
  await fs.mkdir(config.paths.temp, { recursive: true })
  const filename = join(config.paths.temp, Date.now().toString() + '.tmp')
  await pipe(response.body, createWriteStream(filename))
  return filename
}
