import { join } from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { promises as fs, createWriteStream } from 'fs'
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import config from './config'

const pipe = promisify(pipeline)

/**
 * Send a http request.
 * @param url url
 * @param init init
 */
export const request = async (url: RequestInfo, init: RequestInit = {}): Promise<Response> => {
  /* istanbul ignore if */
  if (config.proxy != null) {
    init.agent = new SocksProxyAgent(config.proxy)
  }
  const response = await fetch(url, init)
  // res.status >= 200 && res.status < 300
  if (response.ok) return response
  throw Error(`Unexpected response: ${response.statusText}`)
}

/**
 * Download remote resource to temporary file.
 * @param url remote url
 * @returns temporary filename
 */
export const download = async (url: string): Promise<string> => {
  const response = await request(url)
  /* istanbul ignore if */
  if (response.body == null) throw Error('Unexpected response: Response body is empty')
  // ensure temp dirname
  await fs.mkdir(config.paths.temp, { recursive: true })
  const filename = join(config.paths.temp, Date.now().toString() + '.tmp')
  await pipe(response.body, createWriteStream(filename))
  return filename
}
