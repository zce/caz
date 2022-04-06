import { context, fixture } from '../test/helpers'
import prepare from './prepare'

const src = fixture('features')

test('unit:prepare:default', async () => {
  const ctx = context({ src })
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

test('unit:prepare:custom', async () => {
  const ctx = context({
    src,
    answers: {
      features: ['cli', 'typescript']
    }
  }, {
    filters: {
      'bin/**': a => (a.features as string[]).includes('cli'),
      'src/**': a => (a.features as string[]).includes('typescript'),
      'lib/**': a => !(a.features as string[]).includes('typescript')
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

test('unit:prepare:hook', async () => {
  const callback = jest.fn()
  const ctx = context({}, { prepare: callback })
  await prepare(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
