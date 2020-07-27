import * as fetch from '../../src/list/fetch'

test('unit:fetch', async () => {
  expect(typeof fetch.local).toBe('function')
  expect(typeof fetch.remote).toBe('function')
})
