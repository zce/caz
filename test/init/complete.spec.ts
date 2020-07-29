import { createContext } from './util'
import complete from '../../src/init/complete'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log.mockRestore()
})

test('unit:init:complete', async () => {
  expect(typeof complete).toBe('function')
})

test('unit:init:complete:null', async () => {
  const ctx = createContext()
  const result = await complete(ctx)
  expect(result).toBe(undefined)
  expect(log).not.toHaveBeenCalled()
})

test('unit:init:complete:string', async () => {
  const ctx = createContext({}, { complete: 'completed' })
  await complete(ctx)
  expect(log.mock.calls[0][0]).toBe('completed')
})

test('unit:init:complete:callback', async () => {
  const callback = jest.fn()
  const ctx = createContext({}, { complete: callback })
  await complete(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})

test('unit:init:complete:callback-return', async () => {
  const callback = jest.fn().mockReturnValue('completed')
  const ctx = createContext({}, { complete: callback })
  await complete(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe('completed')
})

test('unit:init:complete:callback-promise', async () => {
  const callback = jest.fn().mockReturnValue(Promise.resolve('completed'))
  const ctx = createContext({}, { complete: callback })
  await complete(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe('completed')
})
