import fs from 'fs'
import * as http from './http'
import { destory } from '../../test/helpers'

const registry = 'https://registry.npmjs.org'
const tarball = `${registry}/caz/-/caz-0.0.0.tgz`

test('unit:core:http:request', async () => {
  const response = await http.request(registry)
  expect(response.ok).toBe(true)

  const data = await response.json() as Record<string, string>
  expect(data).toBeTruthy()
  expect(data.db_name).toBe('registry')
})

test('unit:core:http:request:error', async () => {
  expect.hasAssertions()
  try {
    await http.request(`${registry}/faaaaaaaaaker-${Date.now()}`)
  } catch (e) {
    expect((e as Error).message).toBe('Unexpected response: Not Found')
  }
})

test('unit:core:http:download', async () => {
  const filename = await http.download(tarball)
  const stats = await fs.promises.stat(filename)
  expect(stats.isFile()).toBe(true)
  expect(stats.size).toBe(367)
  await destory(filename)
})

test('unit:core:http:download:text', async () => {
  const filename = await http.download(registry)
  const stats = await fs.promises.stat(filename)
  expect(stats.isFile()).toBe(true)
  await destory(filename)
})

test('unit:core:http:download:error', async () => {
  expect.hasAssertions()
  try {
    await http.download(`${registry}/faaaaaaaaaker-${Date.now()}.tgz`)
  } catch (e) {
    expect((e as Error).message).toBe('Unexpected response: Not Found')
  }
})
