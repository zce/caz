import * as core from '.'

test('unit:core', async () => {
  expect(typeof core.file).toBe('object')
  expect(typeof core.http).toBe('object')
  expect(typeof core.config).toBe('object')
  expect(typeof core.exec).toBe('function')
  expect(typeof core.Ware).toBe('function')
})
