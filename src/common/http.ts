import { join } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs'
import got, { StreamOptions } from 'got'
import config from './config'
import { name, version, homepage } from '../../package.json'

const pipe = promisify(pipeline)

const client = got.extend({
  headers: { 'user-agent': `${name}/${version} (${homepage})` }
})

/**
 * Send a http request.
 * @param url url
 * @param options options
 */
export const request = client.extend({
  timeout: 8 * 1000, // 8s
  responseType: 'json' // https://github.com/sindresorhus/got/issues/1117
})

/**
 * Download remote resource to temporary file.
 * @param url url
 * @param options options
 * @returns
 */
export const download = async (url: string, options?: StreamOptions): Promise<string> => {
  const filename = join(config.paths.temp, Date.now().toString() + '.tmp')
  await pipe(client.stream(url, options), createWriteStream(filename))
  return filename
}
