import * as core from '../../src/core'

test('unit:core', async () => {
  expect(typeof core.file).toBe('object')
  expect(typeof core.http).toBe('object')
  expect(typeof core.config).toBe('object')
  expect(typeof core.Ware).toBe('function')
})
