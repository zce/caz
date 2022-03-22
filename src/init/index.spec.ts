import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { http } from '../core'
import { destory, exists, fixture, mktmpdir } from '../../test/helpers'
import init from '.'

test('unit:init:error', async () => {
  expect.assertions(2)
  try {
    await init(null as unknown as string)
  } catch (e) {
    expect((e as Error).message).toBe('Missing required argument: `template`.')
  }
  try {
    await init('')
  } catch (e) {
    expect((e as Error).message).toBe('Missing required argument: `template`.')
  }
})

test('unit:init:default', async () => {
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
  prompts.inject(['caz'])
  await init('minima', 'minima-app', { force: true, offline: false })
  expect(await exists('minima-app')).toBe(true)
  const contents = await fs.promises.readFile('minima-app/caz.txt', 'utf8')
  expect(contents.trim()).toBe('hey caz.')
  process.chdir(original)
  log.mockRestore()
  clear.mockRestore()
  download.mockRestore()
  await destory(temp, downloadtmpdir)
})
