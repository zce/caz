import fs from 'fs'
import { createTempDir } from './util'
import init from '../../src/init'
import prompts from 'prompts'

test('unit:init', async () => {
  expect(typeof init).toBe('function')
})

test('unit:init:error', async () => {
  expect.assertions(2)
  try {
    await init(null as unknown as string)
  } catch (e) {
    expect(e.message).toBe('Missing required argument: `template`.')
  }
  try {
    await init('')
  } catch (e) {
    expect(e.message).toBe('Missing required argument: `template`.')
  }
})

test('unit:init:default', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const temp = await createTempDir()
  const original = process.cwd()
  process.chdir(temp)
  prompts.inject(['caz'])
  await init('minima', 'minima-app', { force: true, offline: true })
  expect(fs.existsSync('minima-app')).toBe(true)
  const contents = await fs.promises.readFile('minima-app/caz.txt', 'utf8')
  expect(contents.trim()).toBe('hey caz.')
  process.chdir(original)
  await fs.promises.rmdir(temp, { recursive: true })
  log.mockRestore()
  clear.mockRestore()
})
