import { context, fixture } from '../../test/helpers'
import load from './load'

test('unit:init:load:normal', async () => {
  const ctx = context({
    src: fixture('features')
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
  const ctx = context({
    template: 'fake-load',
    src: fixture('minima')
  })
  await load(ctx)
  expect(ctx.config.name).toBe('fake-load')
})

test('unit:init:load:error', async () => {
  const ctx = context({
    src: fixture('error')
  })
  expect.hasAssertions()
  try {
    await load(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Invalid template: template needs to expose an object.')
  }
})
