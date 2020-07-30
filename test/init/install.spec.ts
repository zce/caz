import fs from 'fs'
import path from 'path'
import { createContext, createTempDir } from './util'
import install from '../../src/init/install'

// let stdoutWrite: jest.SpyInstance
// let stderrWrite: jest.SpyInstance

// beforeAll(async () => {
//   stdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation()
//   stderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation()
// })

// afterAll(async () => {
//   stdoutWrite.mockRestore()
//   stderrWrite.mockRestore()
// })

test('unit:init:install', async () => {
  expect(typeof install).toBe('function')
})

test('unit:init:init:false', async () => {
  const ctx = createContext({}, { install: false })
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

test('unit:init:init:null', async () => {
  const ctx = createContext()
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

test('unit:init:init:default', async () => {
  const temp = await createTempDir()
  const pkg = { dependencies: { caz: '0.0.0' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = createContext({
    dest: temp,
    files: [{ path: 'package.json', contents: Buffer.from('') }]
  })
  await install(ctx)
  expect(ctx.config.install).toBe('npm')
  expect(fs.existsSync(path.join(temp, 'node_modules'))).toBe(true)
  expect(fs.existsSync(path.join(temp, 'node_modules', 'caz'))).toBe(true)
  expect(fs.existsSync(path.join(temp, 'node_modules', 'caz', 'package.json'))).toBe(true)
  await fs.promises.rmdir(temp, { recursive: true })
})

test('unit:init:init:manual:yarn', async () => {
  const temp = await createTempDir()
  const pkg = { dependencies: { caz: '0.0.0' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = createContext({ dest: temp }, { install: 'yarn' })
  await install(ctx)
  expect(fs.existsSync(path.join(temp, 'yarn.lock'))).toBe(true)
  expect(fs.existsSync(path.join(temp, 'node_modules'))).toBe(true)
  expect(fs.existsSync(path.join(temp, 'node_modules', 'caz'))).toBe(true)
  expect(fs.existsSync(path.join(temp, 'node_modules', 'caz', 'package.json'))).toBe(true)
  await fs.promises.rmdir(temp, { recursive: true })
})

test('unit:init:init:manual:error', async () => {
  const temp = await createTempDir()
  await fs.promises.writeFile(path.join(temp, 'package.json'), 'error package.json')
  const ctx = createContext({ dest: temp }, { install: 'npm' })
  expect.hasAssertions()
  try {
    await install(ctx)
  } catch (e) {
    expect(e.message).toBe('Install dependencies failed.')
  }
  await fs.promises.rmdir(temp, { recursive: true })
})
