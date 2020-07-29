import { createContext } from './util'
import setup from '../../src/init/setup'

test('unit:init:setup', async () => {
  expect(typeof setup).toBe('function')
})

test('unit:init:setup:null', async () => {
  const ctx = createContext()
  const result = await setup(ctx)
  expect(result).toBe(undefined)
})

test('unit:init:setup:callback', async () => {
  const callback = jest.fn()
  const ctx = createContext({}, { setup: callback })
  await setup(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
