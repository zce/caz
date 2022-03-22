import fs from 'fs'
import { context, fixture } from '../test/helpers'
import render from './render'

test('unit:render:normal', async () => {
  const template = `
    <%= title %><% if (enable) { %>
    hahaha
    <% } %>
  `
  // binary files
  const img = fs.readFileSync(fixture('caz.png'))
  const zip = fs.readFileSync(fixture('archive.zip'))

  const ctx = context({
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

test('unit:render:metadata', async () => {
  const now = Date.now()

  const ctx = context({
    files: [
      { path: 'a.txt', contents: Buffer.from('<%= now %>') }
    ]
  }, {
    metadata: { now }
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(now.toString())
})

test('unit:render:helpers', async () => {
  const ctx = context({
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
