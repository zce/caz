import { vi, test, expect } from 'vitest'
import { context } from '../test/helpers'
import setup from './setup'
import { Context } from './types'

test('unit:setup:null', async () => {
  const ctx = context()
  const result = await setup(ctx)
  expect(result).toBe(undefined)
})

test('unit:setup:callback', async () => {
  const callback = vi.fn<[ctx: Context], Promise<void>>()
  const ctx = context({}, { setup: callback })
  await setup(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
