import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { createContext, createTempDir } from './util'
import confirm from '../../src/init/confirm'

let cwd: string

beforeAll(async () => {
  cwd = process.cwd()
  process.chdir(await createTempDir())
})

afterAll(async () => {
  const temp = process.cwd()
  process.chdir(cwd)
  await fs.promises.rmdir(temp, { recursive: true })
})

test('unit:init:confirm', async () => {
  expect(typeof confirm).toBe('function')
})

test('unit:init:confirm:not-exists', async () => {
  const ctx = createContext({
    project: 'not-exists'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('not-exists'))
})

test('unit:init:confirm:force', async () => {
  await fs.promises.writeFile('force', '')
  const ctx = createContext({
    project: 'force',
    options: { force: true }
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('force'))
})

test('unit:init:confirm:file', async () => {
  await fs.promises.writeFile('file', '')
  const ctx = createContext({
    project: 'file'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect(e.message).toBe('Cannot create file: File exists.')
  }
})

test('unit:init:confirm:empty', async () => {
  await fs.promises.mkdir('empty')
  const ctx = createContext({
    project: 'empty'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('empty'))
})

test('unit:init:confirm:sure', async () => {
  await fs.promises.mkdir('sure')
  await fs.promises.writeFile('sure/file', '')
  prompts.inject([false])
  const ctx = createContext({
    project: 'sure'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect(e.message).toBe('You have cancelled this task.')
  }
})

test('unit:init:confirm:sure-cwd', async () => {
  prompts.inject([false])
  await fs.promises.writeFile('file', '')
  const ctx = createContext({
    project: '.'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect(e.message).toBe('You have cancelled this task.')
  }
})

test('unit:init:confirm:merge', async () => {
  await fs.promises.mkdir('merge')
  await fs.promises.writeFile('merge/file', '')
  prompts.inject([true, 'merge'])
  const ctx = createContext({
    project: 'merge'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('merge'))
  expect(fs.existsSync('merge/file')).toBe(true)
})

test('unit:init:confirm:overwrite', async () => {
  await fs.promises.mkdir('overwrite')
  await fs.promises.writeFile('overwrite/file', '')
  prompts.inject([true, 'overwrite'])
  const ctx = createContext({
    project: 'overwrite'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('overwrite'))
  expect(fs.existsSync('overwrite')).toBe(false)
})

test('unit:init:confirm:cancel', async () => {
  await fs.promises.mkdir('cancel')
  await fs.promises.writeFile('cancel/file', '')
  prompts.inject([true, 'cancel'])
  const ctx = createContext({
    project: 'cancel'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect(e.message).toBe('You have cancelled this task.')
    expect(fs.existsSync('cancel/file')).toBe(true)
  }
})
