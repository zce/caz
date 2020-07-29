import fs from 'fs'
import path from 'path'
import { createContext } from './util'
import emit from '../../src/init/emit'

test('unit:init:emit', async () => {
  expect(typeof emit).toBe('function')
})

test('unit:init:emit:all', async () => {
  const ctx = createContext({
    dest: path.join(__dirname, '../.temp'),
    files: [
      { path: 'hello.txt', contents: Buffer.from('hello') },
      { path: 'foo.txt', contents: Buffer.from('foo') }
    ]
  })
  await emit(ctx)
  const hello = await fs.promises.readFile(path.join(ctx.dest, 'hello.txt'), 'utf8')
  expect(hello).toBe('hello')
  const foo = await fs.promises.readFile(path.join(ctx.dest, 'foo.txt'), 'utf8')
  expect(foo).toBe('foo')
  await fs.promises.rmdir(ctx.dest, { recursive: true })
})
