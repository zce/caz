import os from 'os'
import fs from 'fs'
import path from 'path'
// import prompts from 'prompts'
import { createContext } from './util'
import confirm from '../../src/init/confirm'

let cwd: string

beforeAll(async () => {
  cwd = process.cwd()
  process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), 'caz-test-')))
})

afterAll(async () => {
  const temp = process.cwd()
  process.chdir(cwd)
  fs.rmdirSync(temp, { recursive: true })
})

test('unit:init:confirm', async () => {
  expect(typeof confirm).toBe('function')
})

test('unit:init:confirm:not-exists', async () => {
  const ctx = createContext({
    project: 'not-exists'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.join(process.cwd(), 'not-exists'))
})

test('unit:init:confirm:force', async () => {
  await fs.promises.writeFile('force', '')
  const ctx = createContext({
    project: 'force',
    options: { force: true }
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.join(process.cwd(), 'force'))
})

test('unit:init:confirm:file', async () => {
  await fs.promises.writeFile('file', '')
  const ctx = createContext({
    project: 'file'
  })
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
  expect(ctx.dest).toBe(path.join(process.cwd(), 'empty'))
})

// test('unit:init:confirm:cwd', async () => {
//   prompts.inject()
//   const ctx = createContext({
//     project: '.'
//   })
//   await confirm(ctx)
//   expect(ctx.dest).toBe(process.cwd())
// })
