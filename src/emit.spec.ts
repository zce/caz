import fs from 'fs'
import path from 'path'
import { context, destory, mktmpdir } from '../test/helpers'
import emit from './emit'

test('unit:emit:normal', async () => {
  const temp = await mktmpdir()
  const ctx = context({
    dest: temp,
    files: [
      { path: 'hello.txt', contents: Buffer.from('hello') },
      { path: 'foo/bar.txt', contents: Buffer.from('bar') }
    ]
  })
  await emit(ctx)
  const hello = await fs.promises.readFile(path.join(temp, 'hello.txt'), 'utf8')
  expect(hello).toBe('hello')
  const bar = await fs.promises.readFile(path.join(temp, 'foo/bar.txt'), 'utf8')
  expect(bar).toBe('bar')
  await destory(temp)
})

test('unit:emit:hook', async () => {
  const callback = jest.fn()
  const ctx = context({}, { emit: callback })
  await emit(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
