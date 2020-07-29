import fs from 'fs'
import path from 'path'
import { createContext } from './util'
import emit from '../../src/init/emit'

test('unit:init:emit', async () => {
  expect(typeof emit).toBe('function')
})

test('unit:init:emit:normal', async () => {
  const ctx = createContext({
    dest: path.join(__dirname, '../.temp'),
    files: [
      { path: 'hello.txt', contents: Buffer.from('hello') },
      { path: 'foo/bar.txt', contents: Buffer.from('bar') }
    ]
  })
  await emit(ctx)
  const hello = await fs.promises.readFile(path.join(ctx.dest, 'hello.txt'), 'utf8')
  expect(hello).toBe('hello')
  const bar = await fs.promises.readFile(path.join(ctx.dest, 'foo/bar.txt'), 'utf8')
  expect(bar).toBe('bar')
  await fs.promises.rmdir(ctx.dest, { recursive: true })
})
