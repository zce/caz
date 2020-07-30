import os from 'os'
import fs from 'fs'
import path from 'path'
import { file, config } from '../../src'
import { createContext } from './util'
import resolve, { getTemplateUrl } from '../../src/init/resolve'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log.mockRestore()
})

test('unit:init:resolve', async () => {
  expect(typeof resolve).toBe('function')
})

test('unit:init:resolve:getTemplateUrl', async () => {
  const url1 = await getTemplateUrl('tpl1')
  expect(url1).toBe('https://github.com/caz-templates/tpl1/archive/master.zip')

  const url2 = await getTemplateUrl('zce/tpl2')
  expect(url2).toBe('https://github.com/zce/tpl2/archive/master.zip')

  const url3 = await getTemplateUrl('zce/tpl3#dev')
  expect(url3).toBe('https://github.com/zce/tpl3/archive/dev.zip')

  const url4 = await getTemplateUrl('tpl4#dev')
  expect(url4).toBe('https://github.com/caz-templates/tpl4/archive/dev.zip')

  const url5 = await getTemplateUrl('https://github.com/zce/tpl5/archive/dev.zip')
  expect(url5).toBe('https://github.com/zce/tpl5/archive/dev.zip')
})

test('unit:init:resolve:local-tildify', async () => {
  const ctx = createContext({ template: '~/caz' })
  await resolve(ctx)
  expect(ctx.src).toBe(path.join(os.homedir(), 'caz'))
})

test('unit:init:resolve:local-relative', async () => {
  const ctx = createContext({ template: './caz' })
  await resolve(ctx)
  expect(ctx.src).toBe(path.join(process.cwd(), 'caz'))
})

test('unit:init:resolve:local-absolute', async () => {
  const ctx = createContext({ template: __dirname })
  await resolve(ctx)
  expect(ctx.src).toBe(__dirname)
})

test('unit:init:resolve:fetch-remote', async () => {
  const src = path.join(config.paths.cache, '2680caf29ce3a5b7')
  if (!fs.existsSync(src)) {
    await fs.promises.mkdir(src, { recursive: true })
  }
  const ctx = createContext({ template: 'minima' })
  await resolve(ctx)
  expect(ctx.src).toBe(src)
  expect(fs.existsSync(src)).toBe(true)
  expect(fs.existsSync(path.join(src, 'template'))).toBe(true)
  expect(fs.existsSync(path.join(src, 'template', 'caz.txt'))).toBe(true)
})

test('unit:init:resolve:fetch-cache-success', async () => {
  const src = path.join(config.paths.cache, '2680caf29ce3a5b7')
  if (!fs.existsSync(src)) {
    await fs.promises.mkdir(src, { recursive: true })
  }
  const ctx = createContext({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(`Using cached template: \`${file.tildify(src)}\`.`)
})

test('unit:init:resolve:fetch-cache-failed', async () => {
  const src = path.join(config.paths.cache, '2680caf29ce3a5b7')
  if (fs.existsSync(src)) {
    await fs.promises.rmdir(src, { recursive: true })
  }
  const ctx = createContext({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(`Cache not found: \`${file.tildify(src)}\`.`)
  expect(ctx.src).toBe(src)
  expect(fs.existsSync(src)).toBe(true)
  expect(fs.existsSync(path.join(src, 'template'))).toBe(true)
  expect(fs.existsSync(path.join(src, 'template', 'caz.txt'))).toBe(true)
})

test('unit:init:resolve:fetch-error', async () => {
  const ctx = createContext({ template: 'not-found' })
  expect.hasAssertions()
  try {
    await resolve(ctx)
  } catch (e) {
    expect(e.message).toBe('Failed to pull `not-found` template: Unexpected response: Not Found.')
  }
})
