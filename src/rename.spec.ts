import { context } from '../test/helpers'
import rename from './rename'

test('unit:rename:normal', async () => {
  const ctx = context({
    answers: { foo: 'caz' },
    files: [
      { path: 'original', contents: Buffer.from('') },
      { path: '{foo}.txt', contents: Buffer.from('') },
      { path: 'lib/{foo}.txt', contents: Buffer.from('') },
      { path: '{foo}/{foo}.txt', contents: Buffer.from('') }
    ]
  })
  await rename(ctx)
  const names = ctx.files.map(i => i.path)
  expect(names).toEqual(['original', 'caz.txt', 'lib/caz.txt', 'caz/caz.txt'])
})
