import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { context, destory, mktmpdir } from '../test/helpers'
import confirm from './confirm'

const cwd = process.cwd()

beforeAll(async () => {
  process.chdir(await mktmpdir())
})

afterAll(async () => {
  const temp = process.cwd()
  process.chdir(cwd)
  await destory(temp)
})

test('unit:confirm:not-exists', async () => {
  const ctx = context({
    project: 'not-exists'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('not-exists'))
})

test('unit:confirm:force', async () => {
  await fs.promises.writeFile('force', '')
  const ctx = context({
    project: 'force',
    options: { force: true }
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('force'))
})

test('unit:confirm:file', async () => {
  await fs.promises.writeFile('file', '')
  const ctx = context({
    project: 'file'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Cannot create file: File exists.')
  }
})

test('unit:confirm:empty', async () => {
  await fs.promises.mkdir('empty')
  const ctx = context({
    project: 'empty'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('empty'))
})

test('unit:confirm:sure', async () => {
  await fs.promises.mkdir('sure')
  await fs.promises.writeFile('sure/file', '')
  prompts.inject([false])
  const ctx = context({
    project: 'sure'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
  }
})

test('unit:confirm:sure-cwd', async () => {
  prompts.inject([false])
  await fs.promises.writeFile('file', '')
  const ctx = context({
    project: '.'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
  }
})

test('unit:confirm:merge', async () => {
  await fs.promises.mkdir('merge')
  await fs.promises.writeFile('merge/file', '')
  prompts.inject([true, 'merge'])
  const ctx = context({
    project: 'merge'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('merge'))
  expect(fs.existsSync('merge/file')).toBe(true)
})

test('unit:confirm:overwrite', async () => {
  await fs.promises.mkdir('overwrite')
  await fs.promises.writeFile('overwrite/file', '')
  prompts.inject([true, 'overwrite'])
  const ctx = context({
    project: 'overwrite'
  })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('overwrite'))
  expect(fs.existsSync('overwrite')).toBe(false)
})

test('unit:confirm:cancel', async () => {
  await fs.promises.mkdir('cancel')
  await fs.promises.writeFile('cancel/file', '')
  prompts.inject([true, 'cancel'])
  const ctx = context({
    project: 'cancel'
  })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
    expect(fs.existsSync('cancel/file')).toBe(true)
  }
})
