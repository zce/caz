import fs from 'fs'
import path from 'path'
import { createContext } from './util'
import render from '../../src/init/render'

test('unit:init:render', async () => {
  expect(typeof render).toBe('function')
})

test('unit:init:render:normal', async () => {
  const template = `
    <%= title %><% if (enable) { %>
    hahaha
    <% } %>
  `
  // binary files
  const img = fs.readFileSync(path.join(__dirname, '../fixtures/caz.png'))
  const zip = fs.readFileSync(path.join(__dirname, '../fixtures/archive.zip'))

  const ctx = createContext({
    answers: {
      title: 'caz test',
      enable: false
    },
    files: [
      { path: 'a.txt', contents: Buffer.from(template) },
      { path: 'b.txt', contents: Buffer.from('bar') },
      { path: 'caz.png', contents: img },
      { path: 'archive.zip', contents: zip }
    ]
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(`
    caz test
  `)
  expect(ctx.files[1].contents.toString()).toBe('bar')
  expect(ctx.files[2].contents).toBe(img)
  expect(ctx.files[3].contents).toBe(zip)
})

test('unit:init:render:metadata', async () => {
  const now = Date.now()

  const ctx = createContext({
    files: [
      { path: 'a.txt', contents: Buffer.from('<%= now %>') }
    ]
  }, {
    metadata: { now }
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(now.toString())
})

test('unit:init:render:helpers', async () => {
  const ctx = createContext({
    files: [
      { path: 'a.txt', contents: Buffer.from('<%= upper(\'caz\') %>') }
    ]
  }, {
    helpers: {
      upper: (i: string) => i.toUpperCase()
    }
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe('CAZ')
})
