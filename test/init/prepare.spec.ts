import path from 'path'
import { createContext } from './util'
import prepare from '../../src/init/prepare'

const src = path.join(__dirname, '../fixtures/features')

test('unit:init:prepare', async () => {
  expect(typeof prepare).toBe('function')
})

test('unit:init:prepare:default', async () => {
  const ctx = createContext({ src })
  await prepare(ctx)
  expect(ctx.files).toHaveLength(6)
  const names = ctx.files.map(i => i.path)
  expect(names).toContain('README.md')
  expect(names).toContain('caz.png')
  expect(names).toContain('package.json')
  expect(names).toContain('bin/{name}.js')
  expect(names).toContain('lib/index.js')
  expect(names).toContain('src/index.ts')
})

test('unit:init:prepare:custom', async () => {
  const ctx = createContext({
    src,
    answers: {
      features: ['cli', 'typescript']
    }
  }, {
    source: 'template',
    filters: {
      'bin/**': a => a.features.includes('cli'),
      'src/**': a => a.features.includes('typescript'),
      'lib/**': a => a.features.includes('typescript') === false
    }
  })
  await prepare(ctx)
  expect(ctx.files).toHaveLength(5)
  const names = ctx.files.map(i => i.path)
  expect(names).toContain('README.md')
  expect(names).toContain('caz.png')
  expect(names).toContain('package.json')
  expect(names).toContain('bin/{name}.js')
  expect(names).toContain('src/index.ts')
})

test('unit:init:prepare:hook', async () => {
  const callback = jest.fn()
  const ctx = createContext({}, { prepare: callback })
  await prepare(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
