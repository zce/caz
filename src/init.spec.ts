import fs from 'fs'
import path from 'path'
import { context, destory, exists, mktmpdir } from '../test/helpers'
import init from './init'

test('unit:init:null', async () => {
  const ctx = context()
  const result = await init(ctx)
  expect(result).toBe(undefined)
})

test('unit:init:false', async () => {
  const ctx = context({}, { init: false })
  const result = await init(ctx)
  expect(result).toBe(undefined)
})

test('unit:init:default', async () => {
  const temp = await mktmpdir()
  await fs.promises.writeFile(path.join(temp, 'caz.txt'), 'hello')
  const ctx = context({
    dest: temp,
    files: [{ path: '.gitignore', contents: Buffer.from('') }]
  })
  await init(ctx)
  expect(await exists(path.join(temp, '.git'))).toBe(true)
  const stats = await fs.promises.stat(path.join(temp, '.git'))
  expect(stats.isDirectory()).toBe(true)
  expect(await exists(path.join(temp, '.git', 'COMMIT_EDITMSG'))).toBe(true)
  const msg = await fs.promises.readFile(path.join(temp, '.git', 'COMMIT_EDITMSG'), 'utf8')
  expect(msg.trim()).toBe('feat: initial commit')
  await destory(temp)
})

test('unit:init:manual', async () => {
  const temp = await mktmpdir()
  await fs.promises.writeFile(path.join(temp, 'caz.txt'), 'hello')
  const ctx = context({ dest: temp }, { init: true })
  await init(ctx)
  expect(await exists(path.join(temp, '.git'))).toBe(true)
  const stats = await fs.promises.stat(path.join(temp, '.git'))
  expect(stats.isDirectory()).toBe(true)
  expect(await exists(path.join(temp, '.git', 'COMMIT_EDITMSG'))).toBe(true)
  const msg = await fs.promises.readFile(path.join(temp, '.git', 'COMMIT_EDITMSG'), 'utf8')
  expect(msg.trim()).toBe('feat: initial commit')
  await destory(temp)
})

test('unit:init:error', async () => {
  const temp = await mktmpdir()
  const ctx = context({ dest: temp }, { init: true })
  expect.hasAssertions()
  try {
    await init(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Initial repository failed.')
  }
  await destory(temp)
})
