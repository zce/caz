import fs from 'fs'
import path from 'path'
import { createContext } from './util'
import { file, config } from '../../src'
import resolve, { getTemplatePath, getTemplateUrl } from '../../src/init/resolve'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log.mockRestore()
})

test('unit:init:resolve', async () => {
  expect(typeof resolve).toBe('function')
  expect(typeof getTemplatePath).toBe('function')
  expect(typeof getTemplateUrl).toBe('function')
})

test('unit:init:resolve:getTemplatePath', async () => {
  const notdir = await getTemplatePath('caz-faker')
  expect(notdir).toBe(false)

  const dir1 = await getTemplatePath(__dirname)
  expect(dir1).toBe(__dirname)

  try {
    await getTemplatePath('./caz-faker')
  } catch (e) {
    expect(e.message).toBe('Local template not found: `./caz-faker` is not a directory')
  }

  try {
    await getTemplatePath('~/caz-faker')
  } catch (e) {
    expect(e.message).toBe('Local template not found: `~/caz-faker` is not a directory')
  }
})

test('unit:init:resolve:getTemplateUrl', async () => {
  const url1 = await getTemplateUrl('tpl1')
  expect(url1).toBe('https://github.com/caz-templates/tpl1/archive/refs/heads/master.zip')

  const url2 = await getTemplateUrl('zce/tpl2')
  expect(url2).toBe('https://github.com/zce/tpl2/archive/refs/heads/master.zip')

  const url3 = await getTemplateUrl('zce/tpl3:dev')
  expect(url3).toBe('https://github.com/zce/tpl3/archive/refs/heads/dev.zip')

  const url4 = await getTemplateUrl('tpl4:dev')
  expect(url4).toBe('https://github.com/caz-templates/tpl4/archive/refs/heads/dev.zip')

  const url5 = await getTemplateUrl('https://github.com/zce/tpl5/archive/refs/heads/dev.zip')
  expect(url5).toBe('https://github.com/zce/tpl5/archive/refs/heads/dev.zip')

  const url6 = await getTemplateUrl('zce/tpl3:dev/cli')
  expect(url6).toBe('https://github.com/zce/tpl3/archive/refs/heads/dev/cli.zip')

  const url7 = await getTemplateUrl('tpl7:topic/xyz')
  expect(url7).toBe('https://github.com/caz-templates/tpl7/archive/refs/heads/topic/xyz.zip')
})

test('unit:init:resolve:local-relative', async () => {
  const ctx = createContext({ template: './caz-faker' })
  try {
    await resolve(ctx)
  } catch (e) {
    expect(e.message).toBe('Local template not found: `./caz-faker` is not a directory')
  }
})

test('unit:init:resolve:local-absolute', async () => {
  const ctx = createContext({ template: __dirname })
  await resolve(ctx)
  expect(ctx.src).toBe(__dirname)
})

test('unit:init:resolve:local-tildify', async () => {
  const ctx = createContext({ template: '~/caz-faker' })
  try {
    await resolve(ctx)
  } catch (e) {
    expect(e.message).toBe('Local template not found: `~/caz-faker` is not a directory')
  }
})

test('unit:init:resolve:fetch-remote', async () => {
  const src = path.join(config.paths.cache, 'f8327697301af2fa')
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
  const src = path.join(config.paths.cache, 'f8327697301af2fa')
  if (!fs.existsSync(src)) {
    await fs.promises.mkdir(src, { recursive: true })
  }
  const ctx = createContext({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(`Using cached template: \`${file.tildify(src)}\`.`)
})

test('unit:init:resolve:fetch-cache-failed', async () => {
  const src = path.join(config.paths.cache, 'f8327697301af2fa')
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
