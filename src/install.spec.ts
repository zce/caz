import fs from 'fs'
import path from 'path'
import { context, destory, exists, mktmpdir } from '../test/helpers'
import install from './install'

test('unit:install:false', async () => {
  const ctx = context({}, { install: false })
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

test('unit:install:null', async () => {
  const ctx = context()
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

test('unit:install:default', async () => {
  const temp = await mktmpdir()
  const pkg = { dependencies: { caz: '0.0.0' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = context({
    dest: temp,
    files: [{ path: 'package.json', contents: Buffer.from('') }]
  })
  await install(ctx)
  expect(ctx.config.install).toBe('npm')
  expect(await exists(path.join(temp, 'node_modules'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz', 'package.json'))).toBe(true)
  await destory(temp)
})

// required yarn env
test('unit:install:manual:yarn', async () => {
  const temp = await mktmpdir()
  const pkg = { dependencies: { caz: '0.0.0' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = context({ dest: temp }, { install: 'yarn' })
  await install(ctx)
  expect(await exists(path.join(temp, 'yarn.lock'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz', 'package.json'))).toBe(true)
  await destory(temp)
})

// required pnpm env
test('unit:install:manual:pnpm', async () => {
  const temp = await mktmpdir()
  const pkg = { dependencies: { caz: '0.0.0' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = context({ dest: temp }, { install: 'pnpm' })
  await install(ctx)
  expect(await exists(path.join(temp, 'pnpm-lock.yaml'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'caz', 'package.json'))).toBe(true)
  await destory(temp)
})

test('unit:install:manual:error', async () => {
  const temp = await mktmpdir()
  await fs.promises.writeFile(path.join(temp, 'package.json'), 'error package.json')
  const ctx = context({ dest: temp }, { install: 'npm' })
  expect.hasAssertions()
  try {
    await install(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Install dependencies failed.')
  }
  await destory(temp)
})
