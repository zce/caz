import { SpyInstance } from 'jest-mock'
import { jest, test, expect, beforeEach, afterEach } from '@jest/globals'
import { context } from '../test/helpers'
import complete from './complete'
import { Context } from './types'

let log: SpyInstance<(message?: any, ...optionalParams: any[]) => void>

beforeEach(async () => {
  log = jest.spyOn(console, 'log')
})

afterEach(async () => {
  log.mockRestore()
})

test('unit:complete:fallback', async () => {
  const ctx = context({
    template: 'fallback',
    project: 'fallback-app',
    files: [
      { path: 'foo.txt', contents: Buffer.from('') },
      { path: 'foo/bar.txt', contents: Buffer.from('') },
      { path: 'bar.txt', contents: Buffer.from('') }
    ]
  })
  await complete(ctx)
  expect(log.mock.calls[0][0]).toBe('Created a new project in `fallback-app` by the `fallback` template.\n')
  expect(log.mock.calls[1][0]).toBe('- bar.txt')
  expect(log.mock.calls[2][0]).toBe('- foo.txt')
  expect(log.mock.calls[3][0]).toBe('- foo/bar.txt')
  expect(log.mock.calls[4][0]).toBe('\nHappy hacking :)')
})

test('unit:complete:string', async () => {
  const ctx = context({}, { complete: 'completed' })
  await complete(ctx)
  expect(log.mock.calls[0][0]).toBe('completed')
})

test('unit:complete:callback', async () => {
  const callback = jest.fn<(ctx: Context) => string | Promise<string> | Promise<void>>()
  const ctx = context({}, { complete: callback })
  await complete(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})

test('unit:complete:callback-return', async () => {
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const callback = jest.fn<(ctx: Context) => string | Promise<string> | Promise<void>>(() => 'completed')
  const ctx = context({}, { complete: callback })
  await complete(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe('completed')
})

test('unit:complete:callback-promise', async () => {
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const callback = jest.fn<(ctx: Context) => string | Promise<string> | Promise<void>>(async () => 'completed')
  const ctx = context({}, { complete: callback })
  await complete(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe('completed')
})
