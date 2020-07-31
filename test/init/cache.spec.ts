import fs from 'fs'
import path from 'path'
import { createContext, createTempDir } from './util'
import cache from '../../src/init/cache'

test('unit:init:cache', async () => {
  expect(typeof cache).toBe('function')
})

test('unit:init:cache:normal', async () => {
  const temp = await createTempDir()
  const ctx = createContext({
    template: 'faker-template',
    src: temp
  }, {
    name: 'faker',
    version: '0.1.0'
  })
  await cache(ctx)
  const contents = await fs.promises.readFile(path.join(temp, '.cazrc.json'), 'utf8')
  expect(contents).toBe('{"template":"faker-template","name":"faker","version":"0.1.0"}')
  await fs.promises.rmdir(temp, { recursive: true })
})
