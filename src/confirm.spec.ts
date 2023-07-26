import fs from 'fs/promises'
import path from 'path'
import prompts from 'prompts'
import { vi, test, expect, beforeAll, afterAll, SpyInstance } from 'vitest'
import { context, destory, exists, mktmpdir } from '../test/helpers'
import confirm from './confirm'

let tempcwd: string
let mockcwd: SpyInstance<[], string>

beforeAll(async () => {
  tempcwd = await mktmpdir()
  mockcwd = vi.spyOn(process, 'cwd').mockReturnValue(tempcwd)
})

afterAll(async () => {
  mockcwd.mockRestore()
  await destory(tempcwd)
})

test('unit:confirm:not-exists', async () => {
  const ctx = context({ project: 'not-exists' })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('not-exists'))
})

test('unit:confirm:force', async () => {
  await fs.writeFile(path.resolve('force'), '')
  const ctx = context({ project: 'force', options: { force: true } })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('force'))
})

test('unit:confirm:file', async () => {
  await fs.writeFile(path.resolve('file'), '')
  const ctx = context({ project: 'file' })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('Cannot create file: File exists.')
  }
})

test('unit:confirm:empty', async () => {
  await fs.mkdir(path.resolve('empty'))
  const ctx = context({ project: 'empty' })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('empty'))
})

test('unit:confirm:sure', async () => {
  await fs.mkdir(path.resolve('sure'))
  await fs.writeFile(path.resolve('sure/file'), '')
  prompts.inject([false])
  const ctx = context({ project: 'sure' })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
  }
})

test('unit:confirm:sure-cwd', async () => {
  prompts.inject([false])
  await fs.writeFile(path.resolve('sure-cwd'), '')
  const ctx = context({ project: '.' })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
  }
})

test('unit:confirm:merge', async () => {
  await fs.mkdir(path.resolve('merge'))
  await fs.writeFile(path.resolve('merge/file'), '')
  prompts.inject([true, 'merge'])
  const ctx = context({ project: 'merge' })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('merge'))
  expect(await exists(path.resolve('merge/file'))).toBe(true)
})

test('unit:confirm:overwrite', async () => {
  await fs.mkdir(path.resolve('overwrite'))
  await fs.writeFile(path.resolve('overwrite/file'), '')
  prompts.inject([true, 'overwrite'])
  const ctx = context({ project: 'overwrite' })
  await confirm(ctx)
  expect(ctx.dest).toBe(path.resolve('overwrite'))
  expect(await exists(path.resolve('overwrite'))).toBe(false)
})

test('unit:confirm:cancel', async () => {
  await fs.mkdir(path.resolve('cancel'))
  await fs.writeFile(path.resolve('cancel/file'), '')
  prompts.inject([true, 'cancel'])
  const ctx = context({ project: 'cancel' })
  expect.hasAssertions()
  try {
    await confirm(ctx)
  } catch (e) {
    expect((e as Error).message).toBe('You have cancelled this task.')
    expect(await exists(path.resolve('cancel/file'))).toBe(true)
  }
})
