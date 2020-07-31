import * as caz from '../src'

test('unit', async () => {
  expect(typeof caz.inject).toBe('function')
  expect(typeof caz.file).toBe('object')
  expect(typeof caz.http).toBe('object')
  expect(typeof caz.config).toBe('object')
  expect(typeof caz.Ware).toBe('function')
  expect(typeof caz.list).toBe('function')
  expect(typeof caz.default).toBe('function')
})
