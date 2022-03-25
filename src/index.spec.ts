import fs from 'fs'
import path from 'path'
import { http } from './core'
import { destory, exists, fixture, mktmpdir } from '../test/helpers'
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
  const log = jest.spyOn(console, 'log').mockImplementation()
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const downloadtmpdir = await mktmpdir()
  const download = jest.spyOn(http, 'download').mockImplementation(async () => {
    const file = fixture('minima.zip')
    const target = path.join(downloadtmpdir, 'minima.zip')
    await fs.promises.copyFile(file, target)
    return target
  })
  const temp = await mktmpdir()
  const original = process.cwd()
  process.chdir(temp)
  await caz.default('minima', 'minima-app', { force: true, offline: false, name: 'caz' })
  expect(await exists('minima-app')).toBe(true)
  const contents = await fs.promises.readFile('minima-app/caz.txt', 'utf8')
  expect(contents.trim()).toBe('hey caz.')
  process.chdir(original)
  log.mockRestore()
  clear.mockRestore()
  download.mockRestore()
  await destory(temp, downloadtmpdir)
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
