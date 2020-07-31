import path from 'path'
import { createContext } from './util'
import load from '../../src/init/load'

test('unit:init:load', async () => {
  expect(typeof load).toBe('function')
})

test('unit:init:load:normal', async () => {
  const ctx = createContext({
    src: path.join(__dirname, '../fixtures/features')
  })
  await load(ctx)
  expect(ctx.config.name).toBe('features')
  expect(ctx.config.version).toBe('0.1.0')
  expect(ctx.config.source).toBe('template')
  expect(ctx.config.metadata?.date).toBeTruthy()
  expect(ctx.config.prompts).toBeInstanceOf(Array)
  expect(ctx.config.filters).toBeTruthy()
  expect(ctx.config.helpers).toBeTruthy()
  expect(ctx.config.install).toBe('npm')
  expect(ctx.config.init).toBe(true)
  expect(typeof ctx.config.setup).toBe('function')
  expect(typeof ctx.config.prepare).toBe('function')
  expect(typeof ctx.config.emit).toBe('function')
  expect(typeof ctx.config.complete).toBe('function')
})

test('unit:init:load:default', async () => {
  const ctx = createContext({
    template: 'fake-load',
    src: path.join(__dirname, '../fixtures/minima')
  })
  await load(ctx)
  expect(ctx.config.name).toBe('fake-load')
})

test('unit:init:load:error', async () => {
  const ctx = createContext({
    src: path.join(__dirname, '../fixtures/error')
  })
  expect.hasAssertions()
  try {
    await load(ctx)
  } catch (e) {
    expect(e.message).toBe('Invalid template: template needs to expose an object.')
  }
})
