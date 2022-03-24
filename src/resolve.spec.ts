import fs from 'fs'
import path from 'path'
import { file, http, config } from './core'
import { context, exists, destory, fixture, mktmpdir } from '../test/helpers'
import resolve, { getTemplatePath, getTemplateUrl } from './resolve'

let log: jest.SpyInstance
let download: jest.SpyInstance
let tmpdir: string | undefined

const src = path.join(config.paths.cache, 'f8327697301af2fa')

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  download = jest.spyOn(http, 'download').mockImplementation(async () => {
    tmpdir = await mktmpdir()
    const file = fixture('archive.zip')
    const target = path.join(tmpdir, 'archive.zip')
    await fs.promises.copyFile(file, target)
    return target
  })
})

afterEach(async () => {
  log.mockRestore()
  download.mockRestore()
  if (tmpdir != null) {
    await destory(tmpdir)
    tmpdir = undefined
  }
})

test('unit:resolve:getTemplatePath', async () => {
  const notdir = await getTemplatePath('caz-faker')
  expect(notdir).toBe(false)

  const dir1 = await getTemplatePath(__dirname)
  expect(dir1).toBe(__dirname)

  try {
    await getTemplatePath('./caz-faker')
  } catch (e) {
    expect((e as Error).message).toBe('Local template not found: `./caz-faker` is not a directory')
  }

  try {
    await getTemplatePath('~/caz-faker')
  } catch (e) {
    expect((e as Error).message).toBe('Local template not found: `~/caz-faker` is not a directory')
  }
})

test('unit:resolve:getTemplateUrl', async () => {
  const url1 = await getTemplateUrl('tpl1')
  expect(url1).toBe('https://github.com/caz-templates/tpl1/archive/refs/heads/master.zip')

  const url2 = await getTemplateUrl('zce/tpl2')
  expect(url2).toBe('https://github.com/zce/tpl2/archive/refs/heads/master.zip')

  const url3 = await getTemplateUrl('zce/tpl3#dev')
  expect(url3).toBe('https://github.com/zce/tpl3/archive/refs/heads/dev.zip')

  const url4 = await getTemplateUrl('tpl4#dev')
  expect(url4).toBe('https://github.com/caz-templates/tpl4/archive/refs/heads/dev.zip')

  const url5 = await getTemplateUrl('https://github.com/zce/tpl5/archive/refs/heads/dev.zip')
  expect(url5).toBe('https://github.com/zce/tpl5/archive/refs/heads/dev.zip')

  const url6 = await getTemplateUrl('zce/tpl3#dev/cli')
  expect(url6).toBe('https://github.com/zce/tpl3/archive/refs/heads/dev/cli.zip')

  const url7 = await getTemplateUrl('tpl7#topic/xyz')
  expect(url7).toBe('https://github.com/caz-templates/tpl7/archive/refs/heads/topic/xyz.zip')
})

test('unit:resolve:local-relative', async () => {
  const ctx = context({ template: './caz-faker' })
  try {
    await resolve(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Local template not found: `./caz-faker` is not a directory')
  }
})

test('unit:resolve:local-absolute', async () => {
  const ctx = context({ template: __dirname })
  await resolve(ctx)
  expect(ctx.src).toBe(__dirname)
})

test('unit:resolve:local-tildify', async () => {
  const ctx = context({ template: '~/caz-faker' })
  try {
    await resolve(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Local template not found: `~/caz-faker` is not a directory')
  }
})

test('unit:resolve:fetch-remote', async () => {
  await fs.promises.mkdir(src, { recursive: true })

  const ctx = context({ template: 'minima' })
  await resolve(ctx)
  expect(ctx.src).toBe(src)
  expect(await exists(src)).toBe(true)
  expect(await exists(path.join(src, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(src, 'README.md'))).toBe(true)
})

test('unit:resolve:fetch-cache-success', async () => {
  await fs.promises.mkdir(src, { recursive: true })

  const ctx = context({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(`Using cached template: \`${file.tildify(src)}\`.`)
})

test('unit:resolve:fetch-cache-failed', async () => {
  await destory(src)

  const ctx = context({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(`Cache not found: \`${file.tildify(src)}\`.`)
  expect(ctx.src).toBe(src)
  expect(await exists(src)).toBe(true)
  expect(await exists(path.join(src, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(src, 'README.md'))).toBe(true)
})

test('unit:resolve:fetch-error', async () => {
  download.mockImplementation(async () => {
    throw new Error('download error')
  })

  const ctx = context({ template: 'not-found' })
  expect.hasAssertions()
  try {
    await resolve(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Failed to pull `not-found` template: download error.')
  }
})
