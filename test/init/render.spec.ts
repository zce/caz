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

  const ctx = createContext({
    answers: {
      title: 'caz test',
      enable: false
    },
    files: [
      { path: 'a.txt', contents: Buffer.from(template) },
      { path: 'b.txt', contents: Buffer.from('bar') }
    ]
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(`
    caz test
  `)

  expect(ctx.files[1].contents.toString()).toBe('bar')
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

test('unit:init:render:metadata', async () => {
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
