import fs from 'fs'
import path from 'path'
import { context, destory, exists, fixture, mktmpdir } from '../test/helpers'
import load from './load'

test('unit:load:normal', async () => {
  const ctx = context({ src: fixture('features') })
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

test('unit:load:default', async () => {
  const ctx = context({ template: 'fake-load', src: fixture('minima') })
  await load(ctx)
  expect(ctx.config.name).toBe('fake-load')
})

test('unit:load:error', async () => {
  const ctx = context({ src: fixture('error') })
  expect.hasAssertions()
  try {
    await load(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Invalid template: template needs to expose an object.')
  }
})

test('unit:load:install-deps', async () => {
  const temp = await mktmpdir()

  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify({
    dependencies: { caz: '0.0.0' },
    devDependencies: { zce: '0.0.0' }
  }))

  const ctx = context({ src: temp })

  await load(ctx)

  expect(await exists(path.join(ctx.src, 'node_modules'))).toBe(true)
  expect(await exists(path.join(ctx.src, 'node_modules/caz'))).toBe(true)
  expect(await exists(path.join(ctx.src, 'node_modules/zce'))).toBe(false)

  await destory(temp)
})
