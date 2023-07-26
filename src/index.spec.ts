import fs from 'fs/promises'
import path from 'path'
import { vi, test, expect } from 'vitest'
import { destory, fixture, mktmpdir } from '../test/helpers'
import { http } from './core'
import * as caz from '.'

test('unit:exports', async () => {
  expect(typeof caz.inject).toBe('function')
  expect(typeof caz.file).toBe('object')
  expect(typeof caz.http).toBe('object')
  expect(typeof caz.config).toBe('object')
  expect(typeof caz.exec).toBe('function')
  expect(typeof caz.Ware).toBe('function')
  expect(typeof caz.list).toBe('function')
  expect(typeof caz.default).toBe('function')
})

test('unit:default', async () => {
  const cwdtmpdir = await mktmpdir()
  const downloadtmpdir = await mktmpdir()
  const log = vi.spyOn(console, 'log')
  const clear = vi.spyOn(console, 'clear')
  const cwd = vi.spyOn(process, 'cwd').mockReturnValue(cwdtmpdir)
  const download = vi.spyOn(http, 'download').mockImplementation(async () => {
    const file = fixture('minima.zip')
    const target = path.join(downloadtmpdir, 'minima.zip')
    await fs.copyFile(file, target)
    return target
  })
  await caz.default('minima', 'minima-app', { force: true, offline: false, name: 'caz' })
  const contents = await fs.readFile(path.resolve('minima-app/caz.txt'), 'utf8')
  expect(contents.trim()).toBe('hey caz.')
  log.mockRestore()
  clear.mockRestore()
  cwd.mockRestore()
  download.mockRestore()
  await destory(cwdtmpdir, downloadtmpdir)
})

test('unit:error', async () => {
  expect.assertions(2)
  try {
    await caz.default(null as unknown as string)
  } catch (e) {
    expect((e as Error).message).toBe('Missing required argument: `template`.')
  }
  try {
    await caz.default('')
  } catch (e) {
    expect((e as Error).message).toBe('Missing required argument: `template`.')
  }
})
